import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logAuditEvent } from '../auditService';
import { config } from '../../config/env';
import { tokenOptimizer } from './TokenOptimizer';

interface AIModel {
  priority: number;
  healthCheck: () => Promise<boolean>;
  process: (prompt: string) => Promise<string>;
}

export class AIOrchestrator {
  private models: Record<string, AIModel>;
  private errorThreshold = 3;
  private errorCounts = new Map<string, number>();
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
      dangerouslyAllowBrowser: true
    });

    this.anthropic = new Anthropic({
      apiKey: config.anthropic?.apiKey || ''
    });

    this.models = {
      ollama: {
        priority: 1,
        healthCheck: async () => {
          try {
            const response = await fetch('http://localhost:11434/api/health');
            return response.ok;
          } catch {
            return false;
          }
        },
        process: this.processWithOllama.bind(this)
      },
      gpt4: {
        priority: 2,
        healthCheck: async () => {
          return !!config.openai.apiKey;
        },
        process: this.processWithGPT4.bind(this)
      },
      claude: {
        priority: 3,
        healthCheck: async () => {
          return !!config.anthropic?.apiKey;
        },
        process: this.processWithClaude.bind(this)
      }
    };
  }

  private async processWithOllama(prompt: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'medical',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Ollama processing failed');
    }

    const data = await response.json();
    return data.response;
  }

  private async processWithGPT4(prompt: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical expert specialized in analyzing medical data and generating reports."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || '';
  }

  private async processWithClaude(prompt: string): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    return message.content[0].text;
  }

  private async selectBestModel(excludeModel?: string): Promise<string | null> {
    const availableModels = Object.entries(this.models)
      .filter(([name]) => name !== excludeModel)
      .sort(([, a], [, b]) => a.priority - b.priority);

    for (const [name, model] of availableModels) {
      if (await model.healthCheck()) {
        return name;
      }
    }

    return null;
  }

  async processRequest(data: any, type: string): Promise<string> {
    const currentModel = await this.selectBestModel();
    if (!currentModel) {
      throw new Error('No AI models available');
    }

    try {
      const optimizedPrompt = await tokenOptimizer.optimizePrompt(data, currentModel as any);
      const cachedResponse = tokenOptimizer.getCachedResponse(optimizedPrompt);
      
      if (cachedResponse) {
        return cachedResponse;
      }

      const result = await this.models[currentModel].process(optimizedPrompt);
      
      tokenOptimizer.cacheResponse(optimizedPrompt, result, currentModel);
      this.errorCounts.set(currentModel, 0);
      
      await logAuditEvent('system', 'ai_request', {
        model: currentModel,
        type,
        tokenUsage: tokenOptimizer.getTokenUsage(),
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      console.error(`Error with ${currentModel}:`, error);
      
      const errorCount = (this.errorCounts.get(currentModel) || 0) + 1;
      this.errorCounts.set(currentModel, errorCount);

      if (errorCount >= this.errorThreshold) {
        const nextModel = await this.selectBestModel(currentModel);
        if (nextModel) {
          return this.processRequest(data, type);
        }
      }

      throw error;
    }
  }
}

export const aiOrchestrator = new AIOrchestrator();
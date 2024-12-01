import { SpecialtyConfig } from '../../types/specialty';
import { specialtyConfigs } from '../../config/specialties';

interface TokenLimits {
  ollama: number;
  gpt4: number;
  claude: number;
}

interface TokenCosts {
  gpt4: number;
  claude: number;
  ollama: number;
}

export class TokenOptimizer {
  private maxTokens: TokenLimits = {
    ollama: 4096,
    gpt4: 8192,
    claude: 200000
  };

  private costPerToken: TokenCosts = {
    gpt4: 0.00003,
    claude: 0.00001,
    ollama: 0
  };

  private tokenCounters = new Map<string, number>();
  private responseCache = new Map<string, {
    response: string;
    timestamp: number;
    tokens: number;
    model: string;
  }>();

  async optimizePrompt(data: any, modelType: keyof TokenLimits): Promise<string> {
    const relevantData = this.extractRelevantData(data);
    const compressedPrompt = this.compressPrompt(relevantData);
    
    if (this.estimateTokens(compressedPrompt) > this.maxTokens[modelType]) {
      return this.truncatePrompt(compressedPrompt, modelType);
    }

    return compressedPrompt;
  }

  private extractRelevantData(data: any) {
    const specialty = data.specialty || 'general';
    const config = specialtyConfigs[specialty];
    
    return {
      critical: this.extractCriticalInfo(data, config),
      symptoms: this.summarizeSymptoms(data.symptoms || []),
      vitals: this.filterRelevantVitals(data.vitals || {}, specialty),
      history: this.summarizeHistory(data.medicalHistory || '')
    };
  }

  private extractCriticalInfo(data: any, config: SpecialtyConfig) {
    const criticalFields = config.requiredFields || [];
    return criticalFields.reduce((acc: Record<string, any>, field: string) => {
      if (data[field]) {
        acc[field] = data[field];
      }
      return acc;
    }, {});
  }

  private summarizeSymptoms(symptoms: string[]): string[] {
    const uniqueSymptoms = new Set(symptoms.map(s => s.toLowerCase()));
    return Array.from(uniqueSymptoms)
      .sort((a, b) => this.getSymptomPriority(b) - this.getSymptomPriority(a))
      .slice(0, 5);
  }

  private getSymptomPriority(symptom: string): number {
    const urgentKeywords = ['dolor', 'dificultad', 'sangrado', 'fiebre'];
    return urgentKeywords.some(keyword => symptom.includes(keyword)) ? 2 : 1;
  }

  private filterRelevantVitals(vitals: Record<string, any>, specialty: string) {
    const config = specialtyConfigs[specialty];
    const relevantFields = config.specialtyFields || {};
    
    return Object.entries(vitals)
      .filter(([key]) => key in relevantFields)
      .reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  private summarizeHistory(history: string): string {
    const sentences = history.split(/[.!?]+/).filter(Boolean);
    return sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '...' : '');
  }

  private compressPrompt(data: any): string {
    return JSON.stringify(data, null, 0);
  }

  private truncatePrompt(prompt: string, modelType: keyof TokenLimits): string {
    const maxLength = this.maxTokens[modelType] * 4; // Rough character estimation
    return prompt.slice(0, maxLength);
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  async calculateCost(tokens: number, model: keyof TokenCosts): Promise<number> {
    return tokens * this.costPerToken[model];
  }

  cacheResponse(prompt: string, response: string, model: string): void {
    const hash = this.hashPrompt(prompt);
    const cacheEntry = {
      response,
      timestamp: Date.now(),
      tokens: this.estimateTokens(prompt + response),
      model
    };

    this.responseCache.set(hash, cacheEntry);
    this.updateTokenCount(model, cacheEntry.tokens);
  }

  getCachedResponse(prompt: string): string | null {
    const hash = this.hashPrompt(prompt);
    const cached = this.responseCache.get(hash);
    
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
      return cached.response;
    }
    
    return null;
  }

  private hashPrompt(prompt: string): string {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  private updateTokenCount(model: string, tokens: number): void {
    const current = this.tokenCounters.get(model) || 0;
    this.tokenCounters.set(model, current + tokens);
  }

  getTokenUsage(): Record<string, number> {
    return Object.fromEntries(this.tokenCounters);
  }
}

export const tokenOptimizer = new TokenOptimizer();
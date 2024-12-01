import { validateEnvVariables } from './env';

interface APIConfig {
  openai: {
    apiKey: string;
    baseURL: string;
  };
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  wordpress: {
    apiURL: string;
    nonce: string;
  };
  ollama: {
    baseURL: string;
    model: string;
  };
}

class APIConfigManager {
  private config: APIConfig;

  constructor() {
    validateEnvVariables();

    // Get WordPress settings from localized script
    const wpSettings = (window as any).medConsultSettings || {};

    this.config = {
      openai: {
        apiKey: wpSettings.openaiKey || '',
        baseURL: 'https://api.openai.com/v1'
      },
      emailjs: {
        serviceId: wpSettings.emailjsServiceId || '',
        templateId: wpSettings.emailjsTemplateId || '',
        publicKey: wpSettings.emailjsPublicKey || ''
      },
      wordpress: {
        apiURL: wpSettings.apiUrl || '/wp-json/med-consult/v1',
        nonce: wpSettings.nonce || ''
      },
      ollama: {
        baseURL: 'http://localhost:11434',
        model: 'medical'
      }
    };
  }

  async validateConnections(): Promise<Record<string, boolean>> {
    const status = {
      openai: false,
      emailjs: false,
      wordpress: false,
      ollama: false
    };

    try {
      // Check OpenAI
      const openaiResponse = await fetch(`${this.config.openai.baseURL}/models`, {
        headers: { Authorization: `Bearer ${this.config.openai.apiKey}` }
      });
      status.openai = openaiResponse.ok;

      // Check WordPress API
      const wpResponse = await fetch(`${this.config.wordpress.apiURL}/health-check`, {
        headers: { 'X-WP-Nonce': this.config.wordpress.nonce }
      });
      status.wordpress = wpResponse.ok;

      // Check EmailJS
      const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: this.config.emailjs.publicKey })
      });
      status.emailjs = emailjsResponse.ok;

      // Check Ollama
      const ollamaResponse = await fetch(`${this.config.ollama.baseURL}/api/health`);
      status.ollama = ollamaResponse.ok;
    } catch (error) {
      console.error('Error validating API connections:', error);
    }

    return status;
  }

  getConfig(): APIConfig {
    return this.config;
  }
}

export const apiConfig = new APIConfigManager();
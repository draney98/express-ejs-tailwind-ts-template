export interface AiClient {
  generateCompanyAnswer(prompt: string): Promise<string>;
}

export type AiProvider = 'ollama' | 'openai' | 'vertex' | 'anthropic';

export interface AiClientConfig {
  provider: AiProvider;
  // Common options
  temperature?: number;
  // Ollama
  ollamaBaseUrl?: string;
  ollamaModel?: string;
  // Placeholder fields for future providers
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}



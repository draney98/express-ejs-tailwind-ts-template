import { AiClient, AiClientConfig } from './types';

export class OllamaClient implements AiClient {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly temperature: number | undefined;

  constructor(config?: Partial<AiClientConfig>) {
    this.baseUrl = config?.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = config?.ollamaModel || process.env.OLLAMA_MODEL || 'llama3.1:8b';
    this.temperature = config?.temperature;
  }

  async generateCompanyAnswer(prompt: string): Promise<string> {
    const body: Record<string, unknown> = {
      model: this.model,
      prompt,
      stream: false
    };
    if (typeof this.temperature === 'number') {
      body.options = { temperature: this.temperature };
    }

    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Ollama error ${res.status}: ${text}`);
    }
    const data = await res.json().catch(() => ({}));
    const response = (data as { response?: string }).response;
    return response || '';
  }
}



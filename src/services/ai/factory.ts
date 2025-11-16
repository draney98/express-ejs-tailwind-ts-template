import { AiClient, AiClientConfig, AiProvider } from './types';
import { OllamaClient } from './ollamaClient';

let singletonClient: AiClient | null = null;

function resolveProvider(): AiProvider {
  const raw = (process.env.AI_PROVIDER || 'ollama').toLowerCase();
  if (raw === 'ollama') return 'ollama';
  if (raw === 'openai') return 'openai';
  if (raw === 'vertex') return 'vertex';
  if (raw === 'anthropic') return 'anthropic';
  return 'ollama';
}

export function getAiClient(config?: Partial<AiClientConfig>): AiClient {
  if (singletonClient) return singletonClient;

  const provider = config?.provider || resolveProvider();
  switch (provider) {
    case 'ollama':
      singletonClient = new OllamaClient(config);
      return singletonClient;
    // Future providers can be added here with the same interface
    case 'openai':
    case 'vertex':
    case 'anthropic':
    default:
      // Fallback to Ollama for now to keep behavior consistent
      singletonClient = new OllamaClient(config);
      return singletonClient;
  }
}



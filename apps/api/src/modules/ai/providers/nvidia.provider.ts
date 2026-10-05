import { IAIProvider, AIProviderMessage, AIProviderOptions } from './ai-provider.interface';
import { ENV } from '../../../config/env';

export class NvidiaProvider implements IAIProvider {
  readonly name = 'nvidia';

  isAvailable(): boolean {
    return Boolean(ENV.NVIDIA_API_KEY && ENV.NVIDIA_API_KEY.trim().length > 0);
  }

  async generateChatCompletion(
    messages: AIProviderMessage[],
    options?: AIProviderOptions
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('[NVIDIA NIM] NVIDIA_API_KEY is not configured on the backend server.');
    }

    const baseUrl = (ENV.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/+$/, '');
    const endpoint = `${baseUrl}/chat/completions`;
    const model = ENV.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35-second timeout

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ENV.NVIDIA_API_KEY}`,
          'User-Agent': 'Codexa-AI-Gateway/1.0',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.2,
          top_p: options?.topP ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errJson: any = await response.json();
          if (errJson?.error?.message) {
            errorDetail += ` - ${errJson.error.message}`;
          } else if (errJson?.message) {
            errorDetail += ` - ${errJson.message}`;
          }
        } catch {
          // Response body was not JSON
        }
        throw new Error(`[NVIDIA NIM] Request failed: ${errorDetail}`);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content || typeof content !== 'string') {
        throw new Error('[NVIDIA NIM] Received empty response from model endpoint.');
      }

      return content.trim();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('[NVIDIA NIM] Request timed out after 35 seconds.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

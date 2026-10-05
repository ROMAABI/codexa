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
    const model = ENV.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout

    try {
      console.log(`[AI Gateway:NVIDIA] Requesting completion from '${model}' (${messages.length} messages)...`);

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
          top_p: options?.topP ?? 0.8,
          max_tokens: options?.maxTokens ?? 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      const durationMs = Date.now() - startTime;

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
        console.error(`[AI Gateway:NVIDIA] Request failed in ${durationMs}ms: ${errorDetail}`);
        throw new Error(`[NVIDIA NIM] Request failed: ${errorDetail}`);
      }

      const data: any = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        console.warn(`[AI Gateway:NVIDIA] Model '${model}' returned empty content in ${durationMs}ms.`);
        throw new Error('[NVIDIA NIM] Received empty response from model endpoint.');
      }

      console.log(`[AI Gateway:NVIDIA] Model '${model}' completed in ${durationMs}ms (${content.length} chars).`);
      return content.trim();
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      if (err.name === 'AbortError') {
        console.error(`[AI Gateway:NVIDIA] Request to '${model}' timed out after 20s.`);
        throw new Error(`[NVIDIA NIM] Request timed out after 20 seconds.`);
      }
      console.error(`[AI Gateway:NVIDIA] Execution error in ${durationMs}ms:`, err.message);
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

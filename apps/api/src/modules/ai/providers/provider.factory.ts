import { IAIProvider } from './ai-provider.interface';
import { NvidiaProvider } from './nvidia.provider';
import { LocalProvider } from './local.provider';
import { ENV } from '../../../config/env';

export class AIProviderFactory {
  private static nvidiaProvider = new NvidiaProvider();
  private static localProvider = new LocalProvider();

  static getProvider(): IAIProvider {
    const providerName = (ENV.AI_PROVIDER || 'nvidia').toLowerCase();

    if (providerName === 'nvidia') {
      if (this.nvidiaProvider.isAvailable()) {
        return this.nvidiaProvider;
      }
      // Graceful local fallback if key is not supplied in environment
      return this.localProvider;
    }

    if (providerName === 'local') {
      return this.localProvider;
    }

    // Default to nvidia if key available, else local
    return this.nvidiaProvider.isAvailable() ? this.nvidiaProvider : this.localProvider;
  }

  static getNvidiaProvider(): NvidiaProvider {
    return this.nvidiaProvider;
  }

  static getLocalProvider(): LocalProvider {
    return this.localProvider;
  }
}

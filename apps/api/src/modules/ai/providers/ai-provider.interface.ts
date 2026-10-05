export interface AIProviderMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProviderOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface IAIProvider {
  readonly name: string;
  generateChatCompletion(
    messages: AIProviderMessage[],
    options?: AIProviderOptions
  ): Promise<string>;
  isAvailable(): boolean;
}

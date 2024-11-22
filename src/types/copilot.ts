import type {
  MessageCreateParams as AnthropicChatCompletionCreateParamsBase,
  Message as AnthropicChatCompletionType,
} from '@anthropic-ai/sdk/resources';
import type {
  ModelParams as GoogleChatCompletionCreateParamsBase,
  GenerateContentResponse as GoogleChatCompletionType,
} from '@google/generative-ai';
import type {
  ChatCompletionCreateParamsBase as GroqChatCompletionCreateParamsBase,
  ChatCompletion as GroqChatCompletionType,
} from 'groq-sdk/resources/chat/completions';
import type {
  ChatCompletionCreateParamsBase as OpenAIChatCompletionCreateParamsBase,
  ChatCompletion as OpenAIChatCompletionType,
} from 'openai/resources/chat/completions';

/**
 * Models available for OpenAI provider.
 */
export type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini' | 'o1-mini';

/**
 * Models available for Groq provider.
 */
export type GroqModel = 'llama-3-70b';

/**
 * Models available for Anthropic provider.
 */
export type AnthropicModel =
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-3-haiku';

/**
 * Models available for Google provider.
 */
export type GoogleModel =
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-8b'
  | 'gemini-1.5-pro';

/**
 * Union of all predefined Copilot models.
 */
export type CopilotModel =
  | OpenAIModel
  | GroqModel
  | AnthropicModel
  | GoogleModel;

/**
 * Providers supported by Copilot.
 */
export type CopilotProvider = 'openai' | 'groq' | 'anthropic' | 'google';

/**
 * Mapping of providers to their models.
 */
type ProviderModelMap = {
  openai: OpenAIModel;
  groq: GroqModel;
  anthropic: AnthropicModel;
  google: GoogleModel;
};

/**
 * Utility type to pick the appropriate model type based on the provider.
 */
export type PickCopilotModel<T extends CopilotProvider> = ProviderModelMap[T];

/**
 * Union of all ChatCompletionCreateParams types.
 */
export type ChatCompletionCreateParams =
  | OpenAIChatCompletionCreateParamsBase
  | GroqChatCompletionCreateParamsBase
  | AnthropicChatCompletionCreateParamsBase
  | GoogleChatCompletionCreateParamsBase;

/**
 * Specific ChatCompletionCreateParams types for each provider.
 */
export type OpenAIChatCompletionCreateParams =
  OpenAIChatCompletionCreateParamsBase;
export type GroqChatCompletionCreateParams = GroqChatCompletionCreateParamsBase;
export type AnthropicChatCompletionCreateParams =
  AnthropicChatCompletionCreateParamsBase;
export type GoogleChatCompletionCreateParams =
  GoogleChatCompletionCreateParamsBase;

/**
 * Mapping of providers to their ChatCompletionCreateParams types.
 */
type ProviderChatCompletionCreateParamsMap = {
  openai: OpenAIChatCompletionCreateParams;
  groq: GroqChatCompletionCreateParams;
  anthropic: AnthropicChatCompletionCreateParams;
  google: GoogleChatCompletionCreateParams;
};

/**
 * Utility type to pick the appropriate ChatCompletionCreateParams type based on the provider.
 */
export type PickChatCompletionCreateParams<T extends CopilotProvider> =
  ProviderChatCompletionCreateParamsMap[T];

/**
 * Union of all ChatCompletion types.
 */
export type ChatCompletion =
  | OpenAIChatCompletionType
  | GroqChatCompletionType
  | AnthropicChatCompletionType
  | GoogleChatCompletionType;

/**
 * Specific ChatCompletion types for each provider.
 */
export type OpenAIChatCompletion = OpenAIChatCompletionType;
export type GroqChatCompletion = GroqChatCompletionType;
export type AnthropicChatCompletion = AnthropicChatCompletionType;
export type GoogleChatCompletion = GoogleChatCompletionType;

/**
 * Mapping of providers to their ChatCompletion types.
 */
type ProviderChatCompletionMap = {
  openai: OpenAIChatCompletion;
  groq: GroqChatCompletion;
  anthropic: AnthropicChatCompletion;
  google: GoogleChatCompletion;
};

/**
 * Utility type to pick the appropriate ChatCompletion type based on the provider.
 */
export type PickChatCompletion<T extends CopilotProvider> =
  ProviderChatCompletionMap[T];

/**
 * Data structure representing the prompt data.
 */
export interface PromptData {
  system: string;
  user: string;
}

/**
 * Function type for configuring a custom model.
 */
export type CustomCopilotModelConfig = (
  apiKey: string,
  prompt: PromptData,
) => {
  /**
   * The URL endpoint for the custom model's API.
   */
  endpoint: string;
  /**
   * Additional HTTP headers to include with the API request.
   * Use this to add any necessary authentication or custom headers.
   */
  headers?: Record<string, string>;
  /**
   * The data to be sent in the request body to the custom model API.
   */
  body?: Record<string, unknown>;
};

/**
 * Function type for transforming the response from a custom model.
 */
export type CustomCopilotModelTransformResponse = (response: unknown) => {
  /**
   * The text generated by the custom model.
   */
  text: string | null;
  /**
   * @deprecated Use `text` instead. This property will be removed in a future version.
   */
  completion?: string | null;
};

/**
 * Definition of a custom Copilot model.
 */
export interface CustomCopilotModel {
  /**
   * Function to configure the custom model.
   */
  config: CustomCopilotModelConfig;
  /**
   * Function to transform the response from the custom model.
   */
  transformResponse: CustomCopilotModelTransformResponse;
}

/**
 * Configuration options for initializing a Copilot instance.
 * The `model` property is type-safe and varies based on the specified `provider`.
 */
export type CopilotOptions =
  | {
      /**
       * Specifies the provider for the Copilot instance.
       * Supported providers include 'openai', 'anthropic', 'groq', and 'google'.
       */
      provider: 'openai';
      /**
       * Defines the model to be used for Copilot LLM (Language Model) requests.
       * This must be a model from the 'openai' provider.
       */
      model?: OpenAIModel;
    }
  | {
      /**
       * Specifies the 'groq' provider for the Copilot instance.
       */
      provider: 'groq';
      /**
       * Defines the model to be used for Copilot LLM requests.
       * This must be a model from the 'groq' provider.
       */
      model?: GroqModel;
    }
  | {
      /**
       * Specifies the 'anthropic' provider for the Copilot instance.
       */
      provider: 'anthropic';
      /**
       * Defines the model to be used for Copilot LLM requests.
       * This must be a model from the 'anthropic' provider.
       */
      model?: AnthropicModel;
    }
  | {
      /**
       * Specifies the 'google' provider for the Copilot instance.
       */
      provider: 'google';
      /**
       * Defines the model to be used for Copilot LLM requests.
       * This must be a model from the 'google' provider.
       */
      model?: GoogleModel;
    }
  | {
      /**
       * When no provider is specified, only custom models are allowed.
       */
      provider?: undefined;
      /**
       * Defines the model to be used for Copilot LLM requests.
       * Must be a custom model when no provider is specified.
       * For more information, refer to the documentation:
       * @see https://github.com/arshad-yaseen/monacopilot?tab=readme-ov-file#custom-model
       */
      model?: CustomCopilotModel;
    };

import axios, { AxiosResponse, AxiosError } from "axios";
import { AIProviderResponse, AICodeContextConfig } from "./types";

export abstract class AIProvider {
  protected config: AICodeContextConfig;

  constructor(config: AICodeContextConfig) {
    this.config = config;
  }

  abstract analyzeCode(
    prompt: string,
    code: string
  ): Promise<AIProviderResponse>;
  abstract generateDocumentation(
    prompt: string,
    code: string
  ): Promise<AIProviderResponse>;
  abstract summarizeChanges(
    prompt: string,
    changes: string
  ): Promise<AIProviderResponse>;
}

export class OpenAIProvider extends AIProvider {
  private apiUrl = "https://api.openai.com/v1/chat/completions";

  async analyzeCode(prompt: string, code: string): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, code);
  }

  async generateDocumentation(
    prompt: string,
    code: string
  ): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, code);
  }

  async summarizeChanges(
    prompt: string,
    changes: string
  ): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, changes);
  }

  private async makeRequest(
    prompt: string,
    content: string
  ): Promise<AIProviderResponse> {
    const apiKey = this.config.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OpenAI API key is required. Set it in .aicontext.json or OPENAI_API_KEY environment variable."
      );
    }

    try {
      const response: AxiosResponse = await axios.post(
        this.apiUrl,
        {
          model: this.config.model || "gpt-4",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: content,
            },
          ],
          max_tokens: this.config.maxTokens || 2000,
          temperature: this.config.temperature || 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 60000, // 60 second timeout
        }
      );

      return {
        content: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: { message?: string } }>;
      
      // Handle rate limiting
      if (axiosError.response?.status === 429) {
        throw new Error(
          "OpenAI API rate limit exceeded. Please wait before retrying."
        );
      }
      
      // Handle authentication errors
      if (axiosError.response?.status === 401) {
        throw new Error(
          "OpenAI API authentication failed. Please check your API key."
        );
      }
      
      // Handle timeout
      if (axiosError.code === "ECONNABORTED" || (axiosError.message && axiosError.message.includes("timeout"))) {
        throw new Error(
          "OpenAI API request timed out. Please try again or increase timeout."
        );
      }
      
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Unknown error";
      throw new Error(`OpenAI API request failed: ${errorMessage}`);
    }
  }
}

export class AnthropicProvider extends AIProvider {
  private apiUrl = "https://api.anthropic.com/v1/messages";

  async analyzeCode(prompt: string, code: string): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, code);
  }

  async generateDocumentation(
    prompt: string,
    code: string
  ): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, code);
  }

  async summarizeChanges(
    prompt: string,
    changes: string
  ): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, changes);
  }

  private async makeRequest(
    prompt: string,
    content: string
  ): Promise<AIProviderResponse> {
    const apiKey = this.config.apiKey || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Anthropic API key is required. Set it in .aicontext.json or ANTHROPIC_API_KEY environment variable."
      );
    }

    try {
      const response: AxiosResponse = await axios.post(
        this.apiUrl,
        {
          model: this.config.model || "claude-3-sonnet-20240229",
          max_tokens: this.config.maxTokens || 2000,
          messages: [
            {
              role: "user",
              content: `${prompt}\n\n${content}`,
            },
          ],
        },
        {
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
            "anthropic-version": "2023-06-01",
          },
          timeout: 60000, // 60 second timeout
        }
      );

      return {
        content: response.data.content[0].text,
        usage: {
          promptTokens: response.data.usage.input_tokens,
          completionTokens: response.data.usage.output_tokens,
          totalTokens:
            response.data.usage.input_tokens +
            response.data.usage.output_tokens,
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: { message?: string } }>;
      
      // Handle rate limiting
      if (axiosError.response?.status === 429) {
        throw new Error(
          "Anthropic API rate limit exceeded. Please wait before retrying."
        );
      }
      
      // Handle authentication errors
      if (axiosError.response?.status === 401) {
        throw new Error(
          "Anthropic API authentication failed. Please check your API key."
        );
      }
      
      // Handle timeout
      if (axiosError.code === "ECONNABORTED" || (axiosError.message && axiosError.message.includes("timeout"))) {
        throw new Error(
          "Anthropic API request timed out. Please try again or increase timeout."
        );
      }
      
      const errorMessage =
        axiosError.response?.data?.error?.message ||
        axiosError.message ||
        "Unknown error";
      throw new Error(`Anthropic API request failed: ${errorMessage}`);
    }
  }
}

export class LocalProvider extends AIProvider {
  private apiUrl: string;

  constructor(config: AICodeContextConfig) {
    super(config);
    this.apiUrl = config.apiUrl || "http://localhost:11434/api/chat";
  }

  async analyzeCode(prompt: string, code: string): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, code);
  }

  async generateDocumentation(
    prompt: string,
    code: string
  ): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, code);
  }

  async summarizeChanges(
    prompt: string,
    changes: string
  ): Promise<AIProviderResponse> {
    return this.makeRequest(prompt, changes);
  }

  private async makeRequest(
    prompt: string,
    content: string
  ): Promise<AIProviderResponse> {
    if (!this.apiUrl) {
      throw new Error(
        "Local API URL is required. Set it in .aicontext.json as apiUrl."
      );
    }

    try {
      const response: AxiosResponse = await axios.post(
        this.apiUrl,
        {
          model: this.config.model || "llama2",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: content,
            },
          ],
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000, // 120 second timeout for local models
        }
      );

      return {
        content: response.data.message.content,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      
      // Handle connection errors
      if (axiosError.code === "ECONNREFUSED" || axiosError.code === "ENOTFOUND") {
        throw new Error(
          `Cannot connect to local AI API at ${this.apiUrl}. Please ensure the service is running.`
        );
      }
      
      // Handle timeout
      if (axiosError.code === "ECONNABORTED" || (axiosError.message && axiosError.message.includes("timeout"))) {
        throw new Error(
          "Local AI API request timed out. The model may be processing a large request."
        );
      }
      
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Unknown error";
      throw new Error(`Local API request failed: ${errorMessage}`);
    }
  }
}

export function createAIProvider(config: AICodeContextConfig): AIProvider {
  switch (config.aiProvider) {
    case "openai":
      return new OpenAIProvider(config);
    case "anthropic":
      return new AnthropicProvider(config);
    case "local":
      return new LocalProvider(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
  }
}

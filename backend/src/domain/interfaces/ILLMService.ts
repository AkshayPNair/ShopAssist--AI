export interface ILLMService {
    generateReply(
      history: { role: "user" | "assistant"; content: string }[],
      userMessage: string
    ): Promise<string>;
  }
  
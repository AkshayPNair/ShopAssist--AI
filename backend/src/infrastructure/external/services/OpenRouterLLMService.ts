import axios from "axios";
import { ILLMService } from "../../../domain/interfaces/ILLMService";
import { STORE_FAQ } from "../../../application/constants/faq";

type Role = "user" | "assistant";

export class OpenRouterLLMService implements ILLMService {
  async generateReply(history: { role: Role; content: string }[],userMessage: string): Promise<string> {
    try {
      // history short for speed + cost control
      const trimmedHistory = history.slice(-4);

      const messages = [
        {
          role: "system",
          content: `
    You are a helpful support agent for a small e-commerce store.

    Knowledge Base (USE ONLY WHEN RELEVANT):
    ${STORE_FAQ}

    Rules:
    - You are ONLY a support agent for this store.
    - Be clear, concise, and polite.
    - If the message is unclear or random, politely ask the user to clarify.
    - If the message is unrelated, politely explain your scope.
    - Only answer store-related questions (orders, shipping, returns, support hours).
    - Answer clearly, concisely, and politely.
    - ALWAYS respond in plain paragraph form.
    - DO NOT use bullet points, lists, numbering, or markdown.
    - DO NOT use symbols like "-", "*", or "**".
    - Responses must look like natural human sentences.
    - Even when explaining policies, write them as a single paragraph.  

          `.trim(),
        },
        ...trimmedHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: userMessage,
        },
      ];

      const response = await axios.post(
        `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: "mistralai/mistral-small-3.1-24b-instruct:free",
          messages,
          temperature: 0.2,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 60_000, // 60s timeout
        }
      );

      return (
        response.data.choices?.[0]?.message?.content ??
        "Sorry, I couldn’t generate a response right now."
      );
    } catch (error) {
      console.error("OpenRouter error:", error);
      return "Our support assistant is temporarily unavailable. Please try again in a moment.";
    }
  }
}

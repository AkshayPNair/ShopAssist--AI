import axios from "axios";
import { ILLMService } from "../../../domain/interfaces/ILLMService";
import { AppError } from "../../../application/error/AppError";
import { ErrorCode } from "../../../application/error/ErrorCode";
import { HttpStatusCode } from "../../../utils/httpStatusCode";

type Role = "user" | "assistant"

export class OllamaService implements ILLMService {
    async generateReply(history: { role: Role; content: string }[], userMessage: string): Promise<string> {
        try {
            const trimmedHistory = history.slice(-4)
            const prompt = `You are a helpful support agent for a small e-commerce store. 
                
           Rules (IMPORTANT):
            - You are ONLY a support agent for this store.
            - If the user's message is unclear or random, politely ask them to clarify.
            - If the user's message is unrelated to the store (e.g. general knowledge, personal questions),
            politely explain that you can only help with store-related queries
            such as orders, shipping, returns, and support hours.
            - Do NOT answer unrelated questions.
            - Only use the FAQ when the question clearly relates to the store.
            - Answer clearly, concisely, and politely.

            

            Conversation history:
            ${trimmedHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n")} 
                
            USER: ${userMessage}
            ASSISTANT:`
                .trim()

            const response = await axios.post(
                `${process.env.OLLAMA_BASE_URL}/api/generate`,
                {
                    model: "phi3:mini",
                    prompt,
                    stream: false,
                    options: {
                        num_predict: 150,
                        temperature: 0.3
                    }
                },
                {
                    timeout: 60_000, //60s hard timeout
                }
            )

            return response.data.response;
        } catch (error) {
            console.error("Ollama error:", error);

            return "Our support assistant is temporarily unavailable. Please try again in a moment."
        }
    }
}

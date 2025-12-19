export interface ChatMessage {
    sender: "user" | "ai";
    text: string;
    createdAt?: string;
}

export interface SendMessageRequest {
    message: string;
    sessionId?: string;
}

export interface SendMessageResponse {
    reply: string;
    sessionId: string;
}
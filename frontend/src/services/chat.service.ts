import axios from "axios";
import type { SendMessageRequest, SendMessageResponse } from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"

export const sendChatMessage = async (payload: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, payload)
    return response.data.data
}

export const fetchChatHistory = async (sessionId: string) => {
    const res = await axios.get(`${API_BASE_URL}/chat/history/${sessionId}`);
    return res.data.data;
}


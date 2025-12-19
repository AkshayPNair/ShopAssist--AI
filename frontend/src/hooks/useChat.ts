import { useEffect, useState } from "react";
import { sendChatMessage } from "../services/chat.service";
import type { ChatMessage } from "../types/chat";
import { fetchChatHistory } from "../services/chat.service";


export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | undefined>(() => {
        return localStorage.getItem("chat_session_id") || undefined;
    })

    useEffect(() => {
        if (!sessionId) return;

        fetchChatHistory(sessionId)
            .then((history) => {
                setMessages(
                    history.sort(
                        (a: any, b: any) =>
                            new Date(a.created_at).getTime() -
                            new Date(b.created_at).getTime()
                    )
                );
            })
            .catch(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "ai",
                        text: "Our support assistant is temporarily unavailable."
                    },
                ])
            });
    }, [sessionId]);

    const sendMessage = async (text: string) => {
        setLoading(true)

        setMessages((prev) => [...prev, { sender: "user", text }]);

        try {
            const response = await sendChatMessage({
                message: text,
                sessionId,
            })

            setSessionId(response.sessionId)
            localStorage.setItem("chat_session_id", response.sessionId)

            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: response.reply },
            ])
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        sendMessage,
    };
};

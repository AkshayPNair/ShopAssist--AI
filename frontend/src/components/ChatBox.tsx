import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

export const ChatBox = () => {
    const { messages, sendMessage, loading } = useChat();
    const [input, setInput] = useState("");
    const MAX_LEN = 500;
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const isOverLimit = input.length > MAX_LEN;

    const handleSend = () => {
        if (!input.trim() || loading || isOverLimit) return;
        sendMessage(input);
        setInput("");
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Support Chat</h2>
            </div>

            <div className="messages-area">
                {messages.map((msg, idx) => {
                    const isUser = msg.sender === "user";
                    return (
                        <div
                            key={idx}
                            className={`message-row ${isUser ? "user" : "support"}`}
                        >
                            <div className="message-bubble">
                                {/* Name is now INSIDE the bubble at the top */}
                                <span className="sender-name">
                                    {isUser ? "You" : "Support"}
                                </span>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}

                {loading && <div className="loading-indicator">Support is typing...</div>}
                <div ref={bottomRef} />
            </div>

            <div className="input-container">
                <div className="input-wrapper">
                    <input
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={loading ? "Waiting for response..." : "Type your message..."}
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!input.trim() || loading || isOverLimit}
                    >
                        Send ➤
                    </button>
                </div>
                <div className="char-count-container">
                    <div className="char-count" style={{ color: isOverLimit ? "red" : "#999" }}>
                        {input.length}/{MAX_LEN}
                    </div>
                    {isOverLimit && <div className="error-message" style={{color:"red"}}>Max {MAX_LEN} characters allowed</div>}
                </div>
            </div>
        </div>
    );
};
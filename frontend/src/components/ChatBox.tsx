import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

// Simple SVG Icons for UI
const BotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
);

export const ChatBox = () => {
    const { messages, sendMessage, loading } = useChat();
    const [input, setInput] = useState("");
    const MAX_LEN = 500;
    const bottomRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll logic
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const isOverLimit = input.length > MAX_LEN;

    const handleSend = (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim() || loading || (input.length > MAX_LEN && !textOverride)) return;
        
        sendMessage(textToSend);
        setInput("");
    };

    return (
        <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
                <div className="header-branding">
                    <div className="avatar-circle bot-avatar">
                        <BotIcon />
                    </div>
                    <div>
                        <h2>ShopAssist AI</h2>
                        <span className="status-indicator">
                            <span className="status-dot"></span> Online
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="messages-area">
                {messages.length === 0 ? (
                    // WELCOME STATE (Empty State)
                    <div className="welcome-state">
                        <div className="welcome-icon">
                            <BotIcon />
                        </div>
                        <h3>Welcome to ShopAssist!</h3>
                        <p>I can help you track orders, find products, or answer support questions.</p>
                    </div>
                ) : (
                    // MESSAGE LIST
                    messages.map((msg, idx) => {
                        const isUser = msg.sender === "user";
                        return (
                            <div
                                key={idx}
                                className={`message-row ${isUser ? "user" : "support"}`}
                            >
                                <div className="message-bubble">
                                    <span className="sender-name">
                                        {isUser ? "You" : (
                                            <span className="bot-label">
                                                <SparkleIcon /> ShopAssist
                                            </span>
                                        )}
                                    </span>
                                    <div className="message-text">{msg.text}</div>
                                </div>
                            </div>
                        );
                    })
                )}

                {loading && (
                    <div className="message-row support">
                         <div className="message-bubble typing-bubble">
                            <span className="typing-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </span>
                         </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="input-container">
                <div className={`input-wrapper ${isOverLimit ? "error-border" : ""}`}>
                    <input
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={loading ? "ShopAssist is thinking..." : "Ask me anything about our store..."}
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
                        onClick={() => handleSend()}
                        disabled={!input.trim() || loading || isOverLimit}
                    >
                        <SendIcon />
                    </button>
                </div>
                
                <div className="input-footer">
                    <span className={`char-count ${isOverLimit ? "text-red" : ""}`}>
                        {input.length}/{MAX_LEN}
                    </span>
                    {isOverLimit && <span className="limit-warning">Character limit exceeded</span>}
                </div>
            </div>
        </div>
    );
};
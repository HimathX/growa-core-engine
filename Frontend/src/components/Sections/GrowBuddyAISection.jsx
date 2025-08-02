import React, { useState, useEffect, useRef } from 'react';
import '../../styles/gemini-chat.css';


const BACKEND_BASE_URL = 'http://127.0.0.1:8081';

const GrowBuddyAISection = ({ onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };


    useEffect(() => {
        let storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);
    }, []);


    useEffect(() => {
        if (userId) {
            loadChatHistory();

            setMessages([{
                id: 1,
                text: "Hello! I'm GrowBuddy, your AI farming assistant. How can I help you with your farming needs today?",
                sender: "ai"
            }]);
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const cleanMarkdownText = (text) => {
        if (!text) return text;

        return text

            .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
            .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*


            .replace(/^\* /gm, '• ')          // Convert * to bullet points
            .replace(/^- /gm, '• ')           // Convert - to bullet points


            .replace(/\n\s*\n/g, '\n\n')      // Remove extra blank lines
            .trim();
    };

    const loadChatHistory = async () => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/chatbot/chat-history/${userId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.history && data.history.length > 0) {
                    // Store history for sidebar display
                    setChatHistory(data.history);
                } else {
                    setChatHistory([]);
                }
            } else {
                setChatHistory([]);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setChatHistory([]);
        }
    };


    const callBackendAPI = async (userMessage) => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/chatbot/ask-question/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: userMessage,
                    user_id: userId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.answer) {
                return cleanMarkdownText(data.answer);
            } else {
                throw new Error('Invalid response format from backend');
            }
        } catch (error) {
            console.error('Error calling backend API:', error);
            return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;
        if (isLoading) return;

        const newId = messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;
        const currentMessage = newMessage;


        setMessages(prev => [...prev, { id: newId, text: currentMessage, sender: "user" }]);
        setNewMessage("");
        setIsLoading(true);

        console.log(`User message sent: ${currentMessage}`);

        try {
            const aiResponse = await callBackendAPI(currentMessage);
            const aiResponseId = newId + 1;

            setMessages(prev => [
                ...prev,
                { id: aiResponseId, text: aiResponse, sender: "ai" },
            ]);

            // Reload chat history to update sidebar
            loadChatHistory();

            console.log(`AI responded to: ${currentMessage}`);
        } catch (error) {
            console.error('Error getting AI response:', error);
            // Add error message
            const aiResponseId = newId + 1;
            setMessages(prev => [
                ...prev,
                {
                    id: aiResponseId,
                    text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                    sender: "ai"
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewChat = () => {
        console.log("New Chat button clicked.");
        setMessages([{
            id: 1,
            text: "Hello! I'm GrowBuddy, your AI farming assistant. How can I help you with your farming needs today?",
            sender: "ai"
        }]);
        // Note: This creates a new local chat. Backend will handle new conversations automatically.
    };

    return (
        <>
            <style>{`
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 8px;
                }
                
                .history-item {
                    padding: 12px 14px;
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    border: 1px solid #e9ecef;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .history-item:hover {
                    background-color: #e9ecef;
                    border-color: #4CAF50;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .history-question {
                    font-size: 13px;
                    color: #333;
                    font-weight: 600;
                    margin-bottom: 6px;
                    line-height: 1.4;
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                }
                
                .history-question::before {
                    content: "Q:";
                    color: #4CAF50;
                    font-weight: 700;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                
                .history-answer {
                    font-size: 12px;
                    color: #555;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                }
                
                .history-answer::before {
                    content: "A:";
                    color: #2196F3;
                    font-weight: 700;
                    flex-shrink: 0;
                    margin-top: 1px;
                }
                
                .history-timestamp {
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #e9ecef;
                    padding-top: 6px;
                    text-align: right;
                }
                
                .history-list::-webkit-scrollbar {
                    width: 6px;
                }
                
                .history-list::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .history-list::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                .history-list::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
            <div className="grow-buddy-ai-section-container">
                <div className="chat-main-panel">
                    <div className="chat-header-ai">
                        <button onClick={onBack} className="chat-back-button">
                            <span className="icon">←</span> GrowBuddy AI Assistant
                        </button>
                    </div>
                    <div className="chat-messages-area">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-bubble ${msg.sender === "user" ? "user" : "ai"}`}
                            >
                                <div style={{ whiteSpace: 'pre-line' }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-bubble ai loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input-container-ai">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder={isLoading ? "Processing your question..." : "Ask about farming, crops, soil, pests, irrigation..."}
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="send-button-ai"
                            disabled={isLoading || newMessage.trim() === ""}
                        >
                            {isLoading ? "..." : "➤"}
                        </button>
                    </div>
                </div>
                <div className="chat-history-panel">
                    <h4>History</h4>
                    <div className="history-content">
                        {chatHistory.length > 0 ? (
                            <div className="history-list">
                                {chatHistory.map((chat, index) => (
                                    <div key={index} className="history-item">
                                        <div className="history-question">
                                            <span>
                                                {chat.question.length > 60
                                                    ? chat.question.substring(0, 60) + '...'
                                                    : chat.question}
                                            </span>
                                        </div>
                                        <div className="history-answer">
                                            <span>
                                                {cleanMarkdownText(chat.answer).length > 80
                                                    ? cleanMarkdownText(chat.answer).substring(0, 80) + '...'
                                                    : cleanMarkdownText(chat.answer)}
                                            </span>
                                        </div>
                                        <div className="history-timestamp">
                                            {new Date(chat.timestamp).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-chats-placeholder">
                                <svg
                                    width="60"
                                    height="60"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ color: "#ccc" }}
                                >
                                    <path
                                        d="M4.41391 19.5861C4.80443 19.9766 5.4376 19.9766 5.82812 19.5861L12.0483 13.3659C12.4035 13.0107 12.4035 12.4462 12.0483 12.091L5.82812 5.87078C5.4376 5.48025 4.80443 5.48025 4.41391 5.87078C4.02338 6.2613 4.02338 6.89447 4.41391 7.285L9.90303 12.7334L4.41391 18.2225C4.02338 18.613 4.02338 19.1955 4.41391 19.5861Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M12.0001 19.5861C12.3906 19.9766 13.0238 19.9766 13.4143 19.5861L19.6345 13.3659C19.9897 13.0107 19.9897 12.4462 19.6345 12.091L13.4143 5.87078C13.0238 5.48025 12.3906 5.48025 12.0001 5.87078C11.6096 6.2613 11.6096 6.89447 12.0001 7.285L17.4892 12.7334L12.0001 18.2225C11.6096 18.613 11.6096 19.1955 12.0001 19.5861Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <p>No chats here yet</p>
                            </div>
                        )}
                    </div>
                    <button className="new-chat-button" onClick={handleNewChat}>
                        New Chat
                    </button>
                </div>
            </div>
        </>
    );
};

export default GrowBuddyAISection;
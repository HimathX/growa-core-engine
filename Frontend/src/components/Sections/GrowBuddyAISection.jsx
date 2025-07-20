import React, { useState, useEffect, useRef } from 'react';

const GrowBuddyAISection = ({ onBack }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm GrowBuddy, your AI farming assistant. How can I help you with your farming needs today?",
            sender: "ai"
        },
        {
            id: 2,
            text: "What's the best time to plant tomatoes in tropical climate?",
            sender: "user",
        },
        {
            id: 3,
            text: "For tropical climates, the best time to plant tomatoes is during the dry season, typically from November to February. This avoids the heavy rains that can cause fungal diseases. Make sure soil temperature is between 60-70°F and provide adequate drainage.",
            sender: "ai",
        },
        {
            id: 4,
            text: "My soil pH is 8.2. Is this suitable for growing vegetables? What can I do to improve it?",
            sender: "user",
        },
        {
            id: 5,
            text: "A pH of 8.2 is quite alkaline for most vegetables, which prefer 6.0-7.0. To lower pH: add organic matter like compost, use sulfur amendments, or grow acid-loving cover crops. For immediate planting, consider crops that tolerate alkaline soil like asparagus, cabbage, or beets.",
            sender: "ai",
        },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        const newId = messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;


        setMessages(prev => [...prev, { id: newId, text: newMessage, sender: "user" }]);
        const currentMessage = newMessage;
        setNewMessage(""); // Clear input
        console.log(`User message sent: ${currentMessage}`);


        setTimeout(() => {
            const aiResponseId = newId + 1;
            const aiResponse = generateFarmingResponse(currentMessage);
            setMessages(prev => [
                ...prev,
                { id: aiResponseId, text: aiResponse, sender: "ai" },
            ]);
            console.log(`AI responded to: ${currentMessage}`);
        }, 1000);
    };


    const generateFarmingResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        if (message.includes('water') || message.includes('irrigation')) {
            return "For optimal watering, most vegetables need 1-2 inches per week. Water deeply but less frequently to encourage deep root growth. Morning watering is best to reduce evaporation and disease risk.";
        } else if (message.includes('pest') || message.includes('insect') || message.includes('bug')) {
            return "For pest management, try integrated pest management (IPM): encourage beneficial insects, use companion planting, apply neem oil for organic control, and rotate crops annually to break pest cycles.";
        } else if (message.includes('fertilizer') || message.includes('nutrient')) {
            return "A balanced 10-10-10 NPK fertilizer works for most vegetables. Organic options include compost, aged manure, and fish emulsion. Test your soil first to determine specific nutrient needs.";
        } else if (message.includes('soil') || message.includes('ph')) {
            return "Healthy soil is the foundation of good farming. Most crops prefer pH 6.0-7.0. Add organic matter regularly, test pH annually, and ensure good drainage for optimal plant health.";
        } else if (message.includes('plant') || message.includes('seed') || message.includes('grow')) {
            return "Successful planting depends on timing, soil temperature, and variety selection. Check your local growing zone, start with easy crops like lettuce or beans, and follow seed packet instructions for spacing and depth.";
        } else if (message.includes('disease') || message.includes('fungus') || message.includes('rot')) {
            return "Disease prevention is key: ensure good air circulation, avoid overhead watering, practice crop rotation, and remove affected plants promptly. Copper-based fungicides can help with fungal issues.";
        } else if (message.includes('harvest') || message.includes('when') || message.includes('ready')) {
            return "Harvest timing varies by crop. Look for visual cues: tomatoes should be firm and colored, lettuce before it bolts, and root vegetables when they're sized appropriately. Harvest in the morning when possible.";
        } else if (message.includes('organic') || message.includes('natural')) {
            return "Organic farming focuses on soil health and natural processes. Use compost, cover crops, beneficial insects, and avoid synthetic chemicals. It takes time to build healthy soil ecosystems.";
        } else if (message.includes('climate') || message.includes('weather') || message.includes('temperature')) {
            return "Climate considerations are crucial for farming success. Know your hardiness zone, track frost dates, choose appropriate varieties, and use season extension techniques like row covers when needed.";
        } else {
            // Generic helpful responses for other topics
            const genericResponses = [
                "That's an interesting question! Could you provide more specific details about your farming situation so I can give you better advice?",
                "Based on general farming principles, I'd recommend researching your local growing conditions and consulting with nearby farmers or extension services for region-specific advice.",
                "Every farm is unique! Consider factors like your soil type, climate zone, available resources, and crop goals when making farming decisions.",
                "For the best results, I'd suggest starting small, keeping detailed records, and learning from both successes and challenges in your farming journey.",
                "Agriculture is both an art and a science. Combining traditional knowledge with modern techniques often yields the best results for sustainable farming."
            ];
            return genericResponses[Math.floor(Math.random() * genericResponses.length)];
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
        setMessages([]);
    };

    return (
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
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-container-ai">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about farming, crops, soil, pests, irrigation..."
                    />
                    <button onClick={handleSendMessage} className="send-button-ai">
                        ➤
                    </button>
                </div>
            </div>
            <div className="chat-history-panel">
                <h4>History</h4>
                <div className="history-content">
                    {/* Placeholder for actual chat history list */}
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
                </div>
                <button className="new-chat-button" onClick={handleNewChat}>
                    New Chat
                </button>
            </div>
        </div>
    );
};

export default GrowBuddyAISection;
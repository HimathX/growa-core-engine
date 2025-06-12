import React, { useState, useEffect, useRef } from "react";
// import '../../App.css'; // Styles are in App.css

const GrowBuddyAISection = ({ onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Nisi ut aliquid ex ea commodi consequatur?", sender: "ai" },
    {
      id: 2,
      text: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur",
      sender: "user",
    },
    {
      id: 3,
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit?",
      sender: "ai",
    },
    {
      id: 4,
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      sender: "user",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newId =
      messages.length > 0 ? messages[messages.length - 1].id + 1 : 1;
    setMessages([...messages, { id: newId, text: newMessage, sender: "user" }]);
    setNewMessage("");
    console.log(`User message sent: ${newMessage}`);
    // Simulate AI response
    setTimeout(() => {
      const aiResponseId = newId + 1;
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: aiResponseId, text: `AI Echo: ${newMessage}`, sender: "ai" },
      ]);
      console.log(`AI responded to: ${newMessage}`);
    }, 1000);
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
    setMessages([]); // Clear current chat for a new one
  };

  return (
    <div className="grow-buddy-ai-section-container">
      <div className="chat-main-panel">
        <div className="chat-header-ai">
          <button onClick={onBack} className="chat-back-button">
            <span className="icon">←</span> Lores ipsum loertap
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
            placeholder="Your message..."
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

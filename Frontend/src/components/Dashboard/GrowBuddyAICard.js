import React from "react";

const GrowBuddyAICard = ({ onClick }) => {
  const handleChipClick = (chipText) => {
    console.log(`Grow Buddy AI chip clicked: ${chipText}`);
  };

  const handleSendClick = () => {
    const messageInput = document.getElementById("growBuddyMessage");
    if (messageInput && messageInput.value) {
      console.log(`Grow Buddy AI message sent: ${messageInput.value}`);
      messageInput.value = ""; // Clear input
    } else {
      console.log("Grow Buddy AI send clicked (no message).");
    }
  };

  const handleCopyClick = () => {
    console.log("Copy icon clicked for 'I wanna be a politician, man!'.");
  };

  return (
    <div className="card grow-buddy-ai-card">
      <div className="card-header">
        <h3 className="card-title">
          Grow Buddy <span className="ai-tag">AI</span>
        </h3>
        <span className="card-arrow" onClick={onClick}>
          >
        </span>
      </div>
      <p className="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor
      </p>
      <div className="suggestion-chips">
        {[
          "Lores ipsum dolor?",
          "What's fertilizer?",
          "Best place to buy moonshine",
          "Goats",
        ].map((chip) => (
          <button
            key={chip}
            className="chip"
            onClick={() => handleChipClick(chip)}
          >
            {chip}
          </button>
        ))}
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <button
            className="chip"
            style={{ flexGrow: 1, textAlign: "left" }}
            onClick={() => handleChipClick("I wanna be a politician, man!")}
          >
            I wanna be a politician, man!
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2em",
              cursor: "pointer",
              color: "#555",
              marginLeft: "5px",
            }}
            onClick={handleCopyClick}
            title="Copy suggestion"
          >
            ❐
          </button>
        </div>
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          id="growBuddyMessage"
          placeholder="Type your message"
        />
        <button onClick={handleSendClick}>➤</button>
      </div>
    </div>
  );
};

export default GrowBuddyAICard;

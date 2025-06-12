import React, { useState } from "react";
// import '../../App.css'; // Styles are in App.css

// REVISED DATA STRUCTURE:
// - 'time' property (0.0 to 1.0) dictates position on the timeline.
// - 'date' is now just for display.
// - 'gridArea' is removed.
const initialCropStages = [
  {
    id: "seedGermination",
    time: 0.05,
    title: "Seed Germination",
    date: "1/11/25",
    description: "Carrot seeds typically germinate within 14 to 21 days...",
    type: "completed",
  },
  {
    id: "seedlingDev",
    time: 0.2,
    title: "Seedling Development",
    date: "14/1/26",
    description: "Seedlings develop their first true leaves. Proper care...",
    type: "completed",
  },
  {
    id: "missedWeedicide",
    time: 0.35,
    title: "Missed Weedicide!",
    date: "7/2/26",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "missed",
  },
  {
    id: "vegetativeGrowth",
    time: 0.55,
    title: "Vegetative Growth",
    date: "15/4/26",
    description: "During this phase, the carrot plant continues to grow...",
    type: "completed",
  },
  {
    id: "preHarvest",
    time: 0.75,
    title: "Pre Harvest Checks",
    date: "18/7/26",
    description:
      "Carrots reach maturity when they have developed a sufficient size...",
    type: "completed",
  },
  {
    id: "harvestTime",
    time: 0.95,
    title: "Harvest Time",
    date: "27/9/26",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    type: "future",
  },
];

const YieldProgressSection = ({ onBack }) => {
  const [selectedCrop, setSelectedCrop] = useState("Carrots");
  // eslint-disable-next-line no-unused-vars
  const [cropStages, setCropStages] = useState(
    initialCropStages.sort((a, b) => a.time - b.time)
  );

  // Determine progress based on the last non-future event's time
  const lastCompletedTime = Math.max(
    0,
    ...cropStages.filter((s) => s.type !== "future").map((s) => s.time)
  );
  const progressPercentage = lastCompletedTime * 100;

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
    console.log(`Crop changed to: ${event.target.value}`);
  };

  const handleEditCrops = () => {
    window.alert(
      "Dummy Dialog: Edit Crops\n\nFunctionality to edit existing crops would appear here."
    );
    console.log("Edit crops button clicked.");
  };

  const handleNewCrop = () => {
    window.alert(
      "Dummy Dialog: New Crop\n\nForm to add a new crop would appear here."
    );
    console.log("New crop button clicked.");
  };

  return (
    <div className="yield-progress-section-container">
      {/* Header is unchanged and remains as is */}
      <div className="yield-progress-header">
        <div className="yield-header-left">
          <button onClick={onBack} className="yield-back-button">
            <span className="icon">←</span> Yield Progress
          </button>
          <h1 className="yield-status-text">Going great!</h1>
          <div className="yield-crop-selector-container">
            <span className="yield-crop-icon">🌱</span>
            <select
              value={selectedCrop}
              onChange={handleCropChange}
              className="yield-crop-selector"
            >
              <option value="Carrots">Carrots</option>
              <option value="Chic Peas">Chic Peas</option>
              <option value="Tomatoes">Tomatoes</option>
            </select>
          </div>
        </div>
        <div className="yield-header-right">
          <button className="yield-edit-button" onClick={handleEditCrops}>
            Edit crops
          </button>
          <button className="yield-new-crop-button" onClick={handleNewCrop}>
            New crop
          </button>
        </div>
      </div>

      {/* NEW RENDERER: A single wrapper for the timeline and all cards */}
      <div className="yield-timeline-wrapper">
        <div className="yield-timeline-bar">
          <div
            className="yield-timeline-progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {cropStages.map((stage, index) => {
          const isCompleted = stage.time <= lastCompletedTime;
          // Alternate card placement: odd index above, even index below
          const positionClass =
            index % 2 !== 0 ? "position-top" : "position-bottom";

          return (
            <div
              key={stage.id}
              className="timeline-node-container"
              style={{ left: `${stage.time * 100}%` }}
            >
              <div
                className={`yield-timeline-marker ${
                  isCompleted ? "completed" : ""
                }`}
              ></div>
              <div className={`yield-stage-card-wrapper ${positionClass}`}>
                <div className="dashed-connector-line"></div>
                <div
                  className={`yield-stage-card ${
                    stage.type === "missed" ? "missed" : ""
                  } ${stage.type === "future" ? "future" : ""}`}
                >
                  <div className="yield-stage-card-header">
                    <h4>{stage.title}</h4>
                    <span>{stage.date}</span>
                  </div>
                  <p>{stage.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YieldProgressSection;

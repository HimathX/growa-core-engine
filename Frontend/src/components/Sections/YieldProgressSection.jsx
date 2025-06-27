import React, { useState, useCallback } from "react";

// Initial crop stages data
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
        description: "Carrots reach maturity when they have developed a sufficient size...",
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

const YieldProgressSection = ({ onBack = () => console.log("Back button clicked") }) => {
    const [selectedCrop, setSelectedCrop] = useState("Carrots");
    const [cropStages] = useState(
        [...initialCropStages].sort((a, b) => a.time - b.time)
    );

    // Calculate progress based on the last non-future event's time
    const getProgressPercentage = useCallback(() => {
        const lastCompletedTime = Math.max(
            0,
            ...cropStages.filter((s) => s.type !== "future").map((s) => s.time)
        );
        return lastCompletedTime * 100;
    }, [cropStages]);

    const handleCropChange = useCallback((event) => {
        setSelectedCrop(event.target.value);
        console.log(`Crop changed to: ${event.target.value}`);
    }, []);

    const handleEditCrops = useCallback(() => {
        alert("Dummy Dialog: Edit Crops\n\nFunctionality to edit existing crops would appear here.");
        console.log("Edit crops button clicked.");
    }, []);

    const handleNewCrop = useCallback(() => {
        alert("Dummy Dialog: New Crop\n\nForm to add a new crop would appear here.");
        console.log("New crop button clicked.");
    }, []);

    const progressPercentage = getProgressPercentage();
    const lastCompletedTime = Math.max(
        0,
        ...cropStages.filter((s) => s.type !== "future").map((s) => s.time)
    );

    return (
        <>
            <style>
                {`
                    .container {
                        min-height: 100vh;
                        background-color: #f9fafb;
                        padding: 20px;
                    }
                    
                    .main-card {
                        max-width: 1152px;
                        margin: 0 auto;
                        background-color: white;
                        border-radius: 12px;
                        padding: 24px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    }
                    
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 40px;
                        flex-wrap: wrap;
                        gap: 16px;
                    }
                    
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        flex-wrap: wrap;
                    }
                    
                    .back-button {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #4b5563;
                        background: none;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 6px;
                        transition: background-color 0.15s;
                        cursor: pointer;
                    }
                    
                    .back-button:hover {
                        background-color: #f3f4f6;
                    }
                    
                    .back-button-icon {
                        font-size: 18px;
                    }
                    
                    .back-button-text {
                        font-size: 16px;
                    }
                    
                    .title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0;
                    }
                    
                    .crop-selector {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        background-color: #f9fafb;
                        padding: 8px 12px;
                        border-radius: 8px;
                    }
                    
                    .crop-emoji {
                        font-size: 18px;
                    }
                    
                    .crop-select {
                        background: transparent;
                        border: none;
                        font-size: 16px;
                        cursor: pointer;
                        outline: none;
                    }
                    
                    .header-buttons {
                        display: flex;
                        gap: 12px;
                    }
                    
                    .edit-button {
                        padding: 8px 16px;
                        font-size: 14px;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        background: white;
                        color: #374151;
                        cursor: pointer;
                        transition: background-color 0.15s;
                    }
                    
                    .edit-button:hover {
                        background-color: #f9fafb;
                    }
                    
                    .new-button {
                        padding: 8px 16px;
                        font-size: 14px;
                        background-color: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: background-color 0.15s;
                    }
                    
                    .new-button:hover {
                        background-color: #2563eb;
                    }
                    
                    .timeline-container {
                        position: relative;
                        min-height: 384px;
                        margin: 64px 0;
                    }
                    
                    .timeline-bar {
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background-color: #d1d5db;
                        border-radius: 2px;
                        transform: translateY(-50%);
                    }
                    
                    .timeline-progress {
                        height: 100%;
                        background: linear-gradient(to right, #4ade80, #22c55e);
                        border-radius: 2px;
                        transition: width 0.5s;
                    }
                    
                    .timeline-node {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    
                    .timeline-marker {
                        position: absolute;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 3px solid white;
                        transform: translate(-50%, -50%);
                        transition: all 0.3s;
                        z-index: 10;
                    }
                    
                    .timeline-marker.completed {
                        background-color: #4ade80;
                    }
                    
                    .timeline-marker.incomplete {
                        background-color: #d1d5db;
                    }
                    
                    .card-wrapper {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                    
                    .card-wrapper.top {
                        bottom: 32px;
                    }
                    
                    .card-wrapper.bottom {
                        top: 32px;
                    }
                    
                    .connector-line {
                        position: absolute;
                        left: 50%;
                        width: 2px;
                        height: 20px;
                        transform: translateX(-50%);
                        background-image: repeating-linear-gradient(to bottom, #cbd5e0 0px, #cbd5e0 4px, transparent 4px, transparent 8px);
                    }
                    
                    .connector-line.top {
                        top: 100%;
                    }
                    
                    .connector-line.bottom {
                        bottom: 100%;
                    }
                    
                    .stage-card {
                        width: 280px;
                        background-color: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 16px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        transition: all 0.3s;
                    }
                    
                    .stage-card:hover {
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        transform: translateY(-4px);
                    }
                    
                    .stage-card.missed {
                        border-color: #f87171;
                        background-color: #fef3c7;
                    }
                    
                    .stage-card.future {
                        border-color: #d1d5db;
                        background-color: #f9fafb;
                        opacity: 0.8;
                    }
                    
                    .card-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    }
                    
                    .card-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0;
                    }
                    
                    .card-date {
                        font-size: 12px;
                        color: #6b7280;
                        background-color: #e5e7eb;
                        padding: 4px 8px;
                        border-radius: 12px;
                    }
                    
                    .card-description {
                        font-size: 14px;
                        color: #4b5563;
                        line-height: 1.5;
                        margin: 0;
                    }
                `}
            </style>

            <div className="container">
                <div className="main-card">
                    {/* Header */}
                    <div className="header">
                        <div className="header-left">
                            <button onClick={onBack} className="back-button">
                                <span className="back-button-icon">←</span>
                                <span className="back-button-text">Yield Progress</span>
                            </button>

                            <h1 className="title">Going great!</h1>

                            <div className="crop-selector">
                                <span className="crop-emoji">🌱</span>
                                <select
                                    value={selectedCrop}
                                    onChange={handleCropChange}
                                    className="crop-select"
                                >
                                    <option value="Carrots">Carrots</option>
                                    <option value="Chic Peas">Chic Peas</option>
                                    <option value="Tomatoes">Tomatoes</option>
                                </select>
                            </div>
                        </div>

                        <div className="header-buttons">
                            <button onClick={handleEditCrops} className="edit-button">
                                Edit crops
                            </button>
                            <button onClick={handleNewCrop} className="new-button">
                                New crop
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="timeline-container">
                        {/* Timeline bar */}
                        <div className="timeline-bar">
                            <div
                                className="timeline-progress"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        {/* Timeline nodes and cards */}
                        {cropStages.map((stage, index) => {
                            const isCompleted = stage.time <= lastCompletedTime;
                            const isTop = index % 2 !== 0;

                            return (
                                <div
                                    key={stage.id}
                                    className="timeline-node"
                                    style={{ left: `${stage.time * 100}%` }}
                                >
                                    {/* Timeline marker */}
                                    <div
                                        className={`timeline-marker ${isCompleted ? 'completed' : 'incomplete'}`}
                                    />

                                    {/* Card wrapper */}
                                    <div className={`card-wrapper ${isTop ? 'top' : 'bottom'}`}>
                                        {/* Dashed connector line */}
                                        <div className={`connector-line ${isTop ? 'top' : 'bottom'}`} />

                                        {/* Stage card */}
                                        <div className={`stage-card ${stage.type}`}>
                                            <div className="card-header">
                                                <h4 className="card-title">{stage.title}</h4>
                                                <span className="card-date">{stage.date}</span>
                                            </div>
                                            <p className="card-description">{stage.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default YieldProgressSection;
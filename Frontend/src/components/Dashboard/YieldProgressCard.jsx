import { useState } from "react";

// A summarized version of the main data, focusing on key milestones.
// 'time' property (0.0 to 1.0) dictates progress.
const keyMilestones = [
    {
        id: "missedWeedicide",
        time: 0.35,
        title: "Missed Weedicide!",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: "missed",
    },
    {
        id: "preHarvest",
        time: 0.75,
        title: "Pre Harvest Checks",
        description: "Lorem ipsum dolor sit amet",
        type: "completed",
    },
    {
        id: "harvestTime",
        time: 0.95,
        title: "Harvest Time",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        type: "future",
    },
];

const YieldProgressCard = ({ onClick }) => {
    const vegetables = ["Carrots", "Potatoes", "Tomatoes", "Spinach"];

    const [selectedVegetable, setSelectedVegetable] = useState(vegetables[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownClick = () => {
        setDropdownOpen((open) => !open);
    };

    const handleVegetableSelect = (veg) => {
        setSelectedVegetable(veg);
        setDropdownOpen(false);
    };

    // Calculate progress based on the last non-future event's time
    const lastCompletedTime = Math.max(
        0,
        ...keyMilestones.filter((s) => s.type !== "future").map((s) => s.time)
    );
    const progressPercentage = lastCompletedTime * 100;

    return (
        <div className="card yield-progress-card">
            <div className="card-header">
                <h3 className="card-title" onClick={onClick}>
                    Yield Progress
                </h3>
                <span className="card-arrow" onClick={onClick}></span>
            </div>
            <div className="crop-selector" onClick={handleDropdownClick} style={{ position: "relative", cursor: "pointer" }}>
                <span className="icon">🌱</span> {selectedVegetable}{" "}
                <span style={{ marginLeft: "5px" }}>▼</span>
                {dropdownOpen && (
                    <div className="dropdown-list" style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        background: "#fff",
                        border: "1px solid #ccc",
                        zIndex: 10,
                        width: "100%"
                    }}>
                        {vegetables.map((veg) => (
                            <div
                                key={veg}
                                className="dropdown-item"
                                style={{
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    background: veg === selectedVegetable ? "#f0f0f0" : "#fff"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleVegetableSelect(veg);
                                }}
                            >
                                {veg}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <p className="status-text">Going great!</p>
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <div className="yield-milestones-container">
                {keyMilestones.map((milestone) => (
                    <div
                        key={milestone.id}
                        className={`milestone-item ${milestone.type}`}
                    >
                        <h4>{milestone.title}</h4>
                        <p>{milestone.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YieldProgressCard;
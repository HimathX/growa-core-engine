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
    const handleDropdownClick = () => {
        console.log("Carrots dropdown clicked.");
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
            <div className="crop-selector" onClick={handleDropdownClick}>
                <span className="icon">🌱</span> Carrots{" "}
                <span style={{ marginLeft: "5px" }}>▼</span>
            </div>
            <p className="status-text">Going great!</p>
            <div className="progress-bar-container">
                {/* The progress bar is now driven by the same logic as the full section */}
                <div
                    className="progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            {/* REVISED: This now uses a data-driven flexbox layout */}
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
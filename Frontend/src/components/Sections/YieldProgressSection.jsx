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
        <div className="min-h-screen bg-gray-50 p-5">
            <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                    <div className="flex items-center gap-5 flex-wrap">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                        >
                            <span className="text-lg">←</span>
                            <span className="text-base">Yield Progress</span>
                        </button>

                        <h1 className="text-2xl font-semibold text-gray-800">Going great!</h1>

                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="text-lg">🌱</span>
                            <select
                                value={selectedCrop}
                                onChange={handleCropChange}
                                className="bg-transparent border-none text-base cursor-pointer outline-none"
                            >
                                <option value="Carrots">Carrots</option>
                                <option value="Chic Peas">Chic Peas</option>
                                <option value="Tomatoes">Tomatoes</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleEditCrops}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Edit crops
                        </button>
                        <button
                            onClick={handleNewCrop}
                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            New crop
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative min-h-96 my-16">
                    {/* Timeline bar */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 rounded transform -translate-y-1/2">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded transition-all duration-500"
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
                                className="absolute top-1/2 transform -translate-y-1/2"
                                style={{ left: `${stage.time * 100}%` }}
                            >
                                {/* Timeline marker */}
                                <div
                                    className={`absolute w-4 h-4 rounded-full border-3 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'
                                        }`}
                                />

                                {/* Card wrapper */}
                                <div
                                    className={`absolute left-1/2 transform -translate-x-1/2 ${isTop ? 'bottom-8' : 'top-8'
                                        }`}
                                >
                                    {/* Dashed connector line */}
                                    <div
                                        className={`absolute left-1/2 w-0.5 h-5 transform -translate-x-1/2 ${isTop ? 'top-full' : 'bottom-full'
                                            }`}
                                        style={{
                                            backgroundImage: 'repeating-linear-gradient(to bottom, #cbd5e0 0px, #cbd5e0 4px, transparent 4px, transparent 8px)'
                                        }}
                                    />

                                    {/* Stage card */}
                                    <div
                                        className={`w-70 bg-white border rounded-lg p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${stage.type === "missed"
                                            ? 'border-red-400 bg-orange-50'
                                            : stage.type === "future"
                                                ? 'border-gray-300 bg-gray-50 opacity-80'
                                                : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-base font-semibold text-gray-800">{stage.title}</h4>
                                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                                {stage.date}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{stage.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default YieldProgressSection;
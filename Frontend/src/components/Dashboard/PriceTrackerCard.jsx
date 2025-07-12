import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const dummyData = [
    { month: "Jan", Tomato: 120, Potato: 80, Carrot: 60 },
    { month: "Feb", Tomato: 140, Potato: 85, Carrot: 70 },
    { month: "Mar", Tomato: 130, Potato: 90, Carrot: 75 },
    { month: "Apr", Tomato: 150, Potato: 100, Carrot: 80 }
]



const PriceTrackerCard = ({ onClick }) => {
    const handlePredictedPricesClick = () => {
        console.log("Predicted prices button clicked.");
    };

    return (
        <div className="card price-tracker-card " onClick={() => onClick("priceTracker")}>
            <div className="card-header">
                <h3 className="card-title">Vegetable Price (Rs/kg)</h3>
                <span className="card-arrow" onClick={onClick}>
                </span>
            </div>
            <div className="legend">
                <div className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: "#5cb85c" }}
                    ></span>{" "}
                    Tomato
                </div>
                <div className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: "#a0d911" }}
                    ></span>{" "}
                    Potato
                </div>
                <div className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: "#87CEEB" }}
                    ></span>{" "}
                    Carrot
                </div>
            </div>
            <div className="graph-placeholder">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyData}>
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Tomato" stroke="#5cb85c" />
                        <Line type="monotone" dataKey="Potato" stroke="#a0d911" />
                        <Line type="monotone" dataKey="Carrot" stroke="#87CEEB" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <button
                className="predicted-prices-btn"
                onClick={handlePredictedPricesClick}
            >
                <span className="icon">🕒</span> Predicted prices
            </button>
        </div>
    );
};

export default PriceTrackerCard;
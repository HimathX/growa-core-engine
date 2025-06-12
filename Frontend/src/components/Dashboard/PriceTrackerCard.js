import React from "react";

const PriceTrackerCard = ({ onClick }) => {
  const handlePredictedPricesClick = () => {
    console.log("Predicted prices button clicked.");
  };

  return (
    <div className="card price-tracker-card">
      <div className="card-header">
        <h3 className="card-title">Vegetable Price (Rs/kg)</h3>
        <span className="card-arrow" onClick={onClick}>
          >
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
        Graph showing price trends for January, February, March, April
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

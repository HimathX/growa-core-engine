import React from "react";
// import '../../App.css'; // Styles are in App.css

const marketData = [
  {
    id: "potato",
    name: "Potato",
    color: "#4DBFBF",
    priceToday: "Rs. 150/=",
    peakSeason: "May-June",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  },
  {
    id: "tomato",
    name: "Tomato",
    color: "#9CCC65",
    priceToday: "Rs. 350/=",
    peakSeason: "Jan-April",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  },
  {
    id: "lettuce",
    name: "Lettuce",
    color: "#5CB85C",
    priceToday: "Rs. 400/=",
    peakSeason: "Year round",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  },
  {
    id: "carrot",
    name: "Carrot",
    color: "#f0f0f0",
    priceToday: "Rs. 510/=",
    peakSeason: "March",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  }, // Table color
  {
    id: "brinjal",
    name: "Brinjal",
    color: "#D4AC0D",
    priceToday: "Rs. 80/=",
    peakSeason: "August",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  }, // Table color
  {
    id: "beans",
    name: "Beans",
    color: "#f0f0f0",
    priceToday: "Rs. 2100/=",
    peakSeason: "Dec-May",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  },
  {
    id: "pineapple",
    name: "Pineapple",
    color: "#f0f0f0",
    priceToday: "Rs. 500/=",
    peakSeason: "Nov-Dec",
    maxYearly: "Rs. 8888/=",
    minYearly: "Rs. 88/=",
    notes: "Lores ipsum",
  },
];

const graphCropsData = [
  {
    // Corresponds to Lettuce in table (Dark Green)
    name: "Lettuce",
    color: "#5CB85C",
    points: [500, 450, 420, 430, 440, 400, 380], // Prices for Jan-Jul
  },
  {
    // Corresponds to Tomato in table (Lime Green)
    name: "Tomato",
    color: "#9CCC65",
    points: [300, 350, 400, 420, 380, 430, 450],
  },
  {
    // Corresponds to Potato in table (Teal)
    name: "Potato",
    color: "#4DBFBF",
    points: [380, 280, 300, 320, 280, 350, 280],
  },
  {
    // "Predicted" - Yellowish (like Carrot if it were colored)
    name: "Predicted A",
    color: "#FFEE58", // Yellowish
    points: [220, 320, 380, 480, 420, 450, 400].map((p) => p + 20), // Adjusting baseline slightly
    isPredicted: true,
  },
  {
    // "Predicted" - Light Blue/Cyan
    name: "Predicted B",
    color: "#7DD3FC", // Light Blue/Cyan
    points: [350, 330, 310, 290, 340, 300, 320].map((p) => p - 20), // Adjusting baseline slightly
    isPredicted: true,
  },
];

const PriceTrackerSection = ({ onBack }) => {
  // SVG Graph constants
  const graphWidth = 800;
  const graphHeight = 300;
  const padding = 50;
  const yAxisLabels = [250, 350, 450, 550];
  const xAxisLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const yMin = 200; // Data min slightly lower than label min
  const yMax = 600; // Data max slightly higher than label max

  const getX = (index) =>
    padding + (index / (xAxisLabels.length - 1)) * (graphWidth - 2 * padding);
  const getY = (value) =>
    graphHeight -
    padding -
    ((value - yMin) / (yMax - yMin)) * (graphHeight - 2 * padding);

  const handlePredictedPricesClick = () => {
    console.log("Predicted prices button/label clicked.");
  };

  // Top legend items from the first 3 entries in marketData (Potato, Tomato, Lettuce)
  const topLegendItems = marketData.slice(0, 3);

  return (
    <div className="price-tracker-section-container">
      <h2 className="price-tracker-title">Vegetable Price (Rs/kg)</h2>

      <div className="price-graph-container">
        <div className="price-graph-top-legend">
          {topLegendItems.map((item) => (
            <div key={item.id} className="top-legend-item">
              <span
                className="legend-color-dot"
                style={{ backgroundColor: item.color }}
              ></span>
              {item.priceToday}
            </div>
          ))}
        </div>

        <svg
          width="100%"
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="price-graph-svg"
        >
          {/* Y-axis Labels and Grid Lines */}
          {yAxisLabels.map((label) => (
            <g key={`y-axis-${label}`}>
              <text
                x={padding - 10}
                y={getY(label) + 5}
                textAnchor="end"
                className="graph-axis-label"
              >
                {label}
              </text>
              <line
                x1={padding}
                y1={getY(label)}
                x2={graphWidth - padding}
                y2={getY(label)}
                className="graph-grid-line"
              />
            </g>
          ))}

          {/* X-axis Labels */}
          {xAxisLabels.map((label, index) => (
            <text
              key={`x-axis-${label}`}
              x={getX(index)}
              y={graphHeight - padding + 20}
              textAnchor="middle"
              className="graph-axis-label"
            >
              {label}
            </text>
          ))}

          {/* Data Lines */}
          {graphCropsData.map((crop) => (
            <polyline
              key={crop.name}
              fill="none"
              stroke={crop.color}
              strokeWidth="3"
              strokeDasharray={crop.isPredicted ? "4 4" : "none"} // Dashed for predicted
              points={crop.points
                .map((point, index) => `${getX(index)},${getY(point)}`)
                .join(" ")}
            />
          ))}

          {/* Vertical Dashed Line (approx between Feb and Mar) */}
          <line
            x1={getX(1) + (getX(2) - getX(1)) * 0.7}
            y1={padding}
            x2={getX(1) + (getX(2) - getX(1)) * 0.7}
            y2={graphHeight - padding}
            className="graph-vertical-dashed-line"
          />
        </svg>

        <button
          className="predicted-prices-button-graph"
          onClick={handlePredictedPricesClick}
        >
          <span className="icon">ⓘ</span> Predicted prices
        </button>
      </div>

      <div className="price-table-container">
        <table className="price-table">
          <thead>
            <tr>
              <th>LEGEND</th>
              <th>VEGETABLE</th>
              <th>PRICE TODAY</th>
              <th>PEAK SEASON</th>
              <th>MAX YEARLY</th>
              <th>MIN YEARLY</th>
              <th>NOTES</th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((item) => (
              <tr key={item.id}>
                <td>
                  <span
                    className="legend-color-dot"
                    style={{ backgroundColor: item.color }}
                  ></span>
                </td>
                <td>{item.name}</td>
                <td>{item.priceToday}</td>
                <td>{item.peakSeason}</td>
                <td>{item.maxYearly}</td>
                <td>{item.minYearly}</td>
                <td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* The onBack prop is not used here as "Market" is a main navigation item,
           but if it were a sub-section, a back button would be appropriate.
           Example: <button className="back-button" onClick={onBack}>Back</button>
        */}
    </div>
  );
};

export default PriceTrackerSection;

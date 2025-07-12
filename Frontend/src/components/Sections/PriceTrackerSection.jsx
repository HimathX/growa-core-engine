import React, { useCallback, useMemo } from "react";

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        padding: "1.5rem",
    },
    wrapper: {
        maxWidth: "1120px",
        margin: "0 auto",
    },
    title: {
        fontSize: "1.875rem",
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: "2rem",
        textAlign: "center",
    },
    graphCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        padding: "1.5rem",
        marginBottom: "2rem",
    },
    legendContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "2rem",
        marginBottom: "1.5rem",
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    priceText: {
        fontSize: "1.125rem",
        fontWeight: "600",
        color: "#374151",
    },
    svgWrapper: {
        position: "relative",
    },
    predictedButton: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "#EFF6FF",
        border: "1px solid #BFDBFE",
        color: "#1D4ED8",
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
    tableWrapper: {
        backgroundColor: "#FFFFFF",
        borderRadius: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        padding: "1rem 1.5rem",
        textAlign: "left",
        fontSize: "0.75rem",
        fontWeight: "500",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        backgroundColor: "#F9FAFB",
    },
    td: {
        padding: "1rem 1.5rem",
        fontSize: "0.875rem",
        whiteSpace: "nowrap",
    },
    tdGray: {
        color: "#6B7280",
    },
    tdGreen: {
        color: "#16A34A",
        fontWeight: "500",
    },
    tdRed: {
        color: "#DC2626",
        fontWeight: "500",
    },
    tdNote: {
        color: "#6B7280",
    },
    backButtonWrapper: {
        marginTop: "1.5rem",
        textAlign: "center",
    },
    backButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#F3F4F6",
        color: "#374151",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#4b5563",
        background: "none",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        transition: "background-color 0.15s",
        cursor: "pointer",
    },

    backButtonHover: {
        backgroundColor: "#f3f4f6",
    },

    backButtonIcon: {
        fontSize: "18px",
    },

    backButtonText: {
        fontSize: "16px",
    },
};

// Dummy data for demonstration; replace with real data or import as needed
const marketData = [
    {
        id: 1,
        name: "Tomato",
        color: "#EF4444",
        priceToday: "Rs320",
        peakSeason: "May - July",
        maxYearly: "Rs400",
        minYearly: "Rs250",
        notes: "High demand in summer.",
    },
    {
        id: 2,
        name: "Potato",
        color: "#F59E42",
        priceToday: "Rs280",
        peakSeason: "November - January",
        maxYearly: "Rs350",
        minYearly: "Rs220",
        notes: "Stable price.",
    },
    {
        id: 3,
        name: "Onion",
        color: "#6366F1",
        priceToday: "Rs360",
        peakSeason: "September - November",
        maxYearly: "Rs420",
        minYearly: "Rs300",
        notes: "Volatile market.",
    },
];

const graphCropsData = [
    {
        name: "Tomato",
        color: "#EF4444",
        isPredicted: false,
        points: [320, 340, 360, 380, 400, 390, 370],
    },
    {
        name: "Potato",
        color: "#F59E42",
        isPredicted: false,
        points: [280, 290, 300, 310, 320, 315, 310],
    },
    {
        name: "Onion",
        color: "#6366F1",
        isPredicted: true,
        points: [360, 370, 380, 390, 400, 410, 420],
    },
];

const PriceTrackerSection = ({ onBack }) => {
    const graphConfig = useMemo(() => ({
        width: 800,
        height: 300,
        padding: 50,
        yAxisLabels: [250, 350, 450, 550],
        xAxisLabels: ["January", "February", "March", "April", "May", "June", "July"],
        yMin: 200,
        yMax: 600,
    }), []);

    const { width: graphWidth, height: graphHeight, padding, yAxisLabels, xAxisLabels, yMin, yMax } = graphConfig;

    const getX = useCallback(
        (index) => padding + (index / (xAxisLabels.length - 1)) * (graphWidth - 2 * padding),
        [padding, xAxisLabels.length, graphWidth]
    );

    const getY = useCallback(
        (value) => graphHeight - padding - ((value - yMin) / (yMax - yMin)) * (graphHeight - 2 * padding),
        [graphHeight, padding, yMin, yMax]
    );

    const handlePredictedPricesClick = useCallback(() => {
        console.log("Predicted prices button/label clicked.");
    }, []);

    const topLegendItems = useMemo(() => marketData.slice(0, 3), []);

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Header Row with Back Button and Title */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}>
                    {onBack && (
                        <button onClick={onBack} style={styles.backButton}>
                            <span style={styles.backButtonIcon}>←</span>
                            <span style={styles.backButtonText}>Prices</span>
                        </button>
                    )}
                    <h2 style={{ ...styles.title, marginBottom: 0, textAlign: "center", flex: 1 }}>
                        Vegetable Price (Rs/kg)
                    </h2>
                </div>
                {/* Graph Container */}
                <div style={styles.graphCard}>
                    <div style={styles.legendContainer}>
                        {topLegendItems.map((item) => (
                            <div key={item.id} style={styles.legendItem}>
                                <span style={{
                                    width: "1rem",
                                    height: "1rem",
                                    borderRadius: "9999px",
                                    backgroundColor: item.color,
                                    display: "inline-block",
                                }} />
                                <span style={styles.priceText}>{item.priceToday}</span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.svgWrapper}>
                        <svg
                            width="100%"
                            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                            style={{ border: "1px solid #E5E7EB", borderRadius: "0.5rem" }}
                        >
                            {yAxisLabels.map((label) => (
                                <g key={`y-axis-${label}`}>
                                    <text
                                        x={padding - 10}
                                        y={getY(label) + 5}
                                        textAnchor="end"
                                        fill="#4B5563"
                                        fontSize="12"
                                    >
                                        {label}
                                    </text>
                                    <line
                                        x1={padding}
                                        y1={getY(label)}
                                        x2={graphWidth - padding}
                                        y2={getY(label)}
                                        stroke="#E5E7EB"
                                        strokeWidth="1"
                                    />
                                </g>
                            ))}

                            {xAxisLabels.map((label, index) => (
                                <text
                                    key={`x-axis-${label}`}
                                    x={getX(index)}
                                    y={graphHeight - padding + 20}
                                    textAnchor="middle"
                                    fill="#4B5563"
                                    fontSize="12"
                                >
                                    {label}
                                </text>
                            ))}

                            {graphCropsData.map((crop) => (
                                <g key={crop.name}>
                                    <polyline
                                        fill="none"
                                        stroke={crop.color}
                                        strokeWidth="3"
                                        strokeDasharray={crop.isPredicted ? "8 4" : undefined}
                                        points={crop.points
                                            .map((point, index) => `${getX(index)},${getY(point)}`)
                                            .join(" ")}
                                    />
                                    {crop.points.map((point, index) => (
                                        <circle
                                            key={`${crop.name}-point-${index}`}
                                            cx={getX(index)}
                                            cy={getY(point)}
                                            r="4"
                                            fill={crop.color}
                                            style={{ cursor: "pointer", transition: "all 0.2s" }}
                                        />
                                    ))}
                                </g>
                            ))}

                            <line
                                x1={getX(1) + (getX(2) - getX(1)) * 0.7}
                                y1={padding}
                                x2={getX(1) + (getX(2) - getX(1)) * 0.7}
                                y2={graphHeight - padding}
                                stroke="#9CA3AF"
                                strokeWidth="2"
                                strokeDasharray="6 4"
                            />
                        </svg>

                        <button onClick={handlePredictedPricesClick} style={styles.predictedButton}>
                            <span style={{ fontSize: "0.875rem" }}>ⓘ</span>
                            <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Predicted prices</span>
                        </button>
                    </div>
                </div>

                {/* Price Table */}
                <div style={styles.tableWrapper}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {["Legend", "Vegetable", "Price Today", "Peak Season", "Max Yearly", "Min Yearly", "Notes"].map((head) => (
                                        <th key={head} style={styles.th}>{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {marketData.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        style={{ backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA", transition: "background-color 0.3s" }}
                                    >
                                        <td style={styles.td}>
                                            <span style={{
                                                width: "1rem",
                                                height: "1rem",
                                                borderRadius: "9999px",
                                                display: "inline-block",
                                                backgroundColor: item.color,
                                            }} />
                                        </td>
                                        <td style={{ ...styles.td, color: "#111827", fontWeight: "500" }}>{item.name}</td>
                                        <td style={{ ...styles.td, ...styles.tdGray, fontWeight: "600" }}>{item.priceToday}</td>
                                        <td style={{ ...styles.td, ...styles.tdGray }}>{item.peakSeason}</td>
                                        <td style={{ ...styles.td, ...styles.tdGreen }}>{item.maxYearly}</td>
                                        <td style={{ ...styles.td, ...styles.tdRed }}>{item.minYearly}</td>
                                        <td style={{ ...styles.td, ...styles.tdNote }}>{item.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceTrackerSection;

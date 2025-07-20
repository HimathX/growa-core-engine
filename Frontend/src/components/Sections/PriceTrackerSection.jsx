import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartLine, faInfoCircle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f7fdf9",
        padding: "2rem",
    },
    wrapper: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        marginBottom: "2rem",
        gap: "1rem",
    },
    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        color: "#374151",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: "500",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#1a202c",
        margin: 0,
        fontFamily: "'Poppins', sans-serif",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem",
    },
    statCard: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f0f0f0",
        transition: "all 0.2s ease",
    },
    statHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.75rem",
    },
    statIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.125rem",
    },
    statValue: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#1a202c",
        marginBottom: "0.25rem",
    },
    statLabel: {
        fontSize: "0.875rem",
        color: "#64748b",
        fontWeight: "500",
    },
    chartCard: {
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "2rem",
        marginBottom: "2rem",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f0f0f0",
    },
    chartHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem",
    },
    chartTitle: {
        fontSize: "1.375rem",
        fontWeight: "600",
        color: "#1a202c",
        margin: 0,
    },
    predictedBadge: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "#f0f9ff",
        color: "#0284c7",
        padding: "0.5rem 1rem",
        borderRadius: "12px",
        fontSize: "0.875rem",
        fontWeight: "500",
        border: "1px solid #e0f2fe",
    },
    legendContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "2rem",
        marginBottom: "2rem",
    },
    legendItem: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
    },
    legendColor: {
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    legendText: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    legendName: {
        fontSize: "0.875rem",
        fontWeight: "600",
        color: "#334155",
    },
    legendPrice: {
        fontSize: "1rem",
        fontWeight: "700",
        color: "#059669",
    },
    svgContainer: {
        backgroundColor: "#fafbfc",
        borderRadius: "12px",
        padding: "1rem",
        border: "2px solid #f1f5f9",
    },
    tableCard: {
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f0f0f0",
    },
    tableHeader: {
        backgroundColor: "#f8fafc",
        padding: "1.5rem",
        borderBottom: "1px solid #e2e8f0",
    },
    tableTitle: {
        fontSize: "1.25rem",
        fontWeight: "600",
        color: "#1a202c",
        margin: 0,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        padding: "1rem 1.5rem",
        textAlign: "left",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
    },
    td: {
        padding: "1rem 1.5rem",
        fontSize: "0.875rem",
        borderBottom: "1px solid #f1f5f9",
    },
    priceCell: {
        fontWeight: "600",
        color: "#1a202c",
    },
    trendUp: {
        color: "#059669",
        fontWeight: "600",
    },
    trendDown: {
        color: "#dc2626",
        fontWeight: "600",
    },
    seasonCell: {
        color: "#64748b",
        fontWeight: "500",
    },
    notesCell: {
        color: "#64748b",
        fontSize: "0.8rem",
        maxWidth: "200px",
    },
};

// Enhanced market data with more realistic information
const marketData = [
    {
        id: 1,
        name: "Tomato",
        color: "#ef4444",
        priceToday: "Rs 320",
        peakSeason: "May - July",
        maxYearly: "Rs 400",
        minYearly: "Rs 250",
        trend: "up",
        change: "+15%",
        notes: "High demand during summer season",
    },
    {
        id: 2,
        name: "Potato",
        color: "#f59e0b",
        priceToday: "Rs 280",
        peakSeason: "Nov - Jan",
        maxYearly: "Rs 350",
        minYearly: "Rs 220",
        trend: "stable",
        change: "+2%",
        notes: "Consistent pricing throughout year",
    },
    {
        id: 3,
        name: "Onion",
        color: "#8b5cf6",
        priceToday: "Rs 360",
        peakSeason: "Sep - Nov",
        maxYearly: "Rs 420",
        minYearly: "Rs 300",
        trend: "down",
        change: "-8%",
        notes: "Volatile market, weather dependent",
    },
    {
        id: 4,
        name: "Carrot",
        color: "#06b6d4",
        priceToday: "Rs 240",
        peakSeason: "Dec - Feb",
        maxYearly: "Rs 290",
        minYearly: "Rs 180",
        trend: "up",
        change: "+12%",
        notes: "Growing export demand",
    },
];

// Quick stats for overview cards
const quickStats = [
    {
        label: "Average Market Price",
        value: "Rs 300",
        trend: "up",
        change: "+5.2%",
        icon: faChartLine,
        color: "#059669",
        bgColor: "#ecfdf5",
    },
    {
        label: "Weekly Growth",
        value: "+12%",
        trend: "up",
        change: "vs last week",
        icon: faArrowUp,
        color: "#0284c7",
        bgColor: "#f0f9ff",
    },
    {
        label: "Market Volatility",
        value: "Medium",
        trend: "down",
        change: "-3% this month",
        icon: faArrowDown,
        color: "#ea580c",
        bgColor: "#fff7ed",
    },
];

const graphCropsData = [
    {
        name: "Tomato",
        color: "#ef4444",
        isPredicted: false,
        points: [320, 340, 360, 380, 400, 390, 370, 350],
    },
    {
        name: "Potato",
        color: "#f59e0b",
        isPredicted: false,
        points: [280, 290, 300, 310, 320, 315, 310, 305],
    },
    {
        name: "Onion",
        color: "#8b5cf6",
        isPredicted: true,
        points: [360, 370, 380, 390, 400, 410, 420, 430],
    },
    {
        name: "Carrot",
        color: "#06b6d4",
        isPredicted: false,
        points: [240, 250, 245, 260, 270, 265, 275, 280],
    },
];

const PriceTrackerSection = ({ onBack }) => {
    const { t } = useTranslation();

    const graphConfig = useMemo(() => ({
        width: 900,
        height: 350,
        padding: 60,
        yAxisLabels: [200, 300, 400, 500],
        xAxisLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        yMin: 150,
        yMax: 550,
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
        console.log("Predicted prices info clicked");
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                {/* Header Section */}
                <div style={styles.header}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            style={styles.backButton}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f3f4f6"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#ffffff"}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <span>Back to Dashboard</span>
                        </button>
                    )}
                    <h1 style={styles.title}>Market Price Tracker</h1>
                </div>

                {/* Quick Stats Grid */}
                <div style={styles.statsGrid}>
                    {quickStats.map((stat, index) => (
                        <div key={index} style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <div
                                    style={{
                                        ...styles.statIcon,
                                        backgroundColor: stat.bgColor,
                                        color: stat.color,
                                    }}
                                >
                                    <FontAwesomeIcon icon={stat.icon} />
                                </div>
                                <span style={{
                                    fontSize: "0.75rem",
                                    color: stat.trend === "up" ? "#059669" : "#dc2626",
                                    fontWeight: "600",
                                }}>
                                    {stat.change}
                                </span>
                            </div>
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Price Chart */}
                <div style={styles.chartCard}>
                    <div style={styles.chartHeader}>
                        <h2 style={styles.chartTitle}>Price Trends (Rs/kg)</h2>
                        <div style={styles.predictedBadge} onClick={handlePredictedPricesClick}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>Predicted Prices</span>
                        </div>
                    </div>

                    <div style={styles.legendContainer}>
                        {marketData.map((item) => (
                            <div key={item.id} style={styles.legendItem}>
                                <div
                                    style={{
                                        ...styles.legendColor,
                                        backgroundColor: item.color,
                                    }}
                                />
                                <div style={styles.legendText}>
                                    <span style={styles.legendName}>{item.name}</span>
                                    <span style={styles.legendPrice}>{item.priceToday}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.svgContainer}>
                        <svg
                            width="100%"
                            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                            style={{
                                background: "linear-gradient(to bottom, #ffffff, #fafbfc)",
                                borderRadius: "8px"
                            }}
                        >
                            {/* Grid Lines */}
                            {yAxisLabels.map((label) => (
                                <g key={`y-axis-${label}`}>
                                    <text
                                        x={padding - 15}
                                        y={getY(label) + 5}
                                        textAnchor="end"
                                        fill="#64748b"
                                        fontSize="12"
                                        fontWeight="500"
                                    >
                                        Rs {label}
                                    </text>
                                    <line
                                        x1={padding}
                                        y1={getY(label)}
                                        x2={graphWidth - padding}
                                        y2={getY(label)}
                                        stroke="#e2e8f0"
                                        strokeWidth="1"
                                        strokeDasharray="3 3"
                                    />
                                </g>
                            ))}

                            {xAxisLabels.map((label, index) => (
                                <text
                                    key={`x-axis-${label}`}
                                    x={getX(index)}
                                    y={graphHeight - padding + 25}
                                    textAnchor="middle"
                                    fill="#64748b"
                                    fontSize="12"
                                    fontWeight="500"
                                >
                                    {label}
                                </text>
                            ))}

                            {/* Price Lines */}
                            {graphCropsData.map((crop) => (
                                <g key={crop.name}>
                                    {/* Line Path */}
                                    <polyline
                                        fill="none"
                                        stroke={crop.color}
                                        strokeWidth="3"
                                        strokeDasharray={crop.isPredicted ? "8 4" : undefined}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={crop.points
                                            .map((point, index) => `${getX(index)},${getY(point)}`)
                                            .join(" ")}
                                        style={{
                                            filter: `drop-shadow(0 2px 4px ${crop.color}40)`,
                                        }}
                                    />
                                    {/* Data Points */}
                                    {crop.points.map((point, index) => (
                                        <circle
                                            key={`${crop.name}-point-${index}`}
                                            cx={getX(index)}
                                            cy={getY(point)}
                                            r="5"
                                            fill="#ffffff"
                                            stroke={crop.color}
                                            strokeWidth="3"
                                            style={{
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                                filter: `drop-shadow(0 2px 4px ${crop.color}30)`,
                                            }}
                                        />
                                    ))}
                                </g>
                            ))}

                            {/* Prediction Line */}
                            <line
                                x1={getX(5)}
                                y1={padding}
                                x2={getX(5)}
                                y2={graphHeight - padding}
                                stroke="#94a3b8"
                                strokeWidth="2"
                                strokeDasharray="6 4"
                                opacity="0.7"
                            />
                            <text
                                x={getX(5) + 10}
                                y={padding + 20}
                                fill="#64748b"
                                fontSize="11"
                                fontWeight="500"
                            >
                                Prediction
                            </text>
                        </svg>
                    </div>
                </div>

                {/* Market Data Table */}
                <div style={styles.tableCard}>
                    <div style={styles.tableHeader}>
                        <h3 style={styles.tableTitle}>Detailed Market Information</h3>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {["Vegetable", "Current Price", "Trend", "Peak Season", "Yearly High", "Yearly Low", "Market Notes"].map((header) => (
                                        <th key={header} style={styles.th}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {marketData.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        style={{
                                            backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                                            transition: "background-color 0.2s ease",
                                        }}
                                    >
                                        <td style={{ ...styles.td, ...styles.priceCell }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <div
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        borderRadius: "50%",
                                                        backgroundColor: item.color,
                                                    }}
                                                />
                                                <span style={{ fontWeight: "600" }}>{item.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.priceCell }}>{item.priceToday}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                ...(item.trend === "up" ? styles.trendUp : item.trend === "down" ? styles.trendDown : {}),
                                            }}>
                                                <FontAwesomeIcon
                                                    icon={item.trend === "up" ? faArrowUp : faArrowDown}
                                                    style={{ fontSize: "0.75rem" }}
                                                />
                                                {item.change}
                                            </span>
                                        </td>
                                        <td style={{ ...styles.td, ...styles.seasonCell }}>{item.peakSeason}</td>
                                        <td style={{ ...styles.td, ...styles.trendUp }}>{item.maxYearly}</td>
                                        <td style={{ ...styles.td, ...styles.trendDown }}>{item.minYearly}</td>
                                        <td style={{ ...styles.td, ...styles.notesCell }}>{item.notes}</td>
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

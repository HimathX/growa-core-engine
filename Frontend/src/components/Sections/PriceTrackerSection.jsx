import React, { useCallback, useMemo } from "react";

const marketData = [
    {
        id: "potato",
        name: "Potato",
        color: "#4DBFBF",
        priceToday: "Rs. 150/=",
        peakSeason: "May-June",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
    {
        id: "tomato",
        name: "Tomato",
        color: "#9CCC65",
        priceToday: "Rs. 350/=",
        peakSeason: "Jan-April",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
    {
        id: "lettuce",
        name: "Lettuce",
        color: "#5CB85C",
        priceToday: "Rs. 400/=",
        peakSeason: "Year round",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
    {
        id: "carrot",
        name: "Carrot",
        color: "#f0f0f0",
        priceToday: "Rs. 510/=",
        peakSeason: "March",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
    {
        id: "brinjal",
        name: "Brinjal",
        color: "#D4AC0D",
        priceToday: "Rs. 80/=",
        peakSeason: "August",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
    {
        id: "beans",
        name: "Beans",
        color: "#f0f0f0",
        priceToday: "Rs. 2100/=",
        peakSeason: "Dec-May",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
    {
        id: "pineapple",
        name: "Pineapple",
        color: "#f0f0f0",
        priceToday: "Rs. 500/=",
        peakSeason: "Nov-Dec",
        maxYearly: "Rs. 8888/=",
        minYearly: "Rs. 88/=",
        notes: "Lorem ipsum",
    },
];

const graphCropsData = [
    {
        name: "Lettuce",
        color: "#5CB85C",
        points: [500, 450, 420, 430, 440, 400, 380],
    },
    {
        name: "Tomato",
        color: "#9CCC65",
        points: [300, 350, 400, 420, 380, 430, 450],
    },
    {
        name: "Potato",
        color: "#4DBFBF",
        points: [380, 280, 300, 320, 280, 350, 280],
    },
    {
        name: "Predicted A",
        color: "#FFEE58",
        points: [220, 320, 380, 480, 420, 450, 400].map((p) => p + 20),
        isPredicted: true,
    },
    {
        name: "Predicted B",
        color: "#7DD3FC",
        points: [350, 330, 310, 290, 340, 300, 320].map((p) => p - 20),
        isPredicted: true,
    },
];

const PriceTrackerSection = ({ onBack }) => {
    // SVG Graph constants
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

    const getX = useCallback((index) =>
        padding + (index / (xAxisLabels.length - 1)) * (graphWidth - 2 * padding),
        [padding, xAxisLabels.length, graphWidth]
    );

    const getY = useCallback((value) =>
        graphHeight - padding - ((value - yMin) / (yMax - yMin)) * (graphHeight - 2 * padding),
        [graphHeight, padding, yMin, yMax]
    );

    const handlePredictedPricesClick = useCallback(() => {
        console.log("Predicted prices button/label clicked.");
    }, []);

    const topLegendItems = useMemo(() => marketData.slice(0, 3), []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Vegetable Price (Rs/kg)
                </h2>

                {/* Graph Container */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    {/* Top Legend */}
                    <div className="flex justify-center gap-8 mb-6 flex-wrap">
                        {topLegendItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <span
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-lg font-semibold text-gray-700">
                                    {item.priceToday}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* SVG Graph */}
                    <div className="relative">
                        <svg
                            width="100%"
                            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                            className="border border-gray-200 rounded-lg"
                        >
                            {/* Y-axis Labels and Grid Lines */}
                            {yAxisLabels.map((label) => (
                                <g key={`y-axis-${label}`}>
                                    <text
                                        x={padding - 10}
                                        y={getY(label) + 5}
                                        textAnchor="end"
                                        className="fill-gray-600 text-sm"
                                    >
                                        {label}
                                    </text>
                                    <line
                                        x1={padding}
                                        y1={getY(label)}
                                        x2={graphWidth - padding}
                                        y2={getY(label)}
                                        className="stroke-gray-200"
                                        strokeWidth="1"
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
                                    className="fill-gray-600 text-sm"
                                >
                                    {label}
                                </text>
                            ))}

                            {/* Data Lines */}
                            {graphCropsData.map((crop) => (
                                <g key={crop.name}>
                                    <polyline
                                        fill="none"
                                        stroke={crop.color}
                                        strokeWidth="3"
                                        strokeDasharray={crop.isPredicted ? "8 4" : "none"}
                                        points={crop.points
                                            .map((point, index) => `${getX(index)},${getY(point)}`)
                                            .join(" ")}
                                        className="drop-shadow-sm"
                                    />
                                    {/* Data points */}
                                    {crop.points.map((point, index) => (
                                        <circle
                                            key={`${crop.name}-point-${index}`}
                                            cx={getX(index)}
                                            cy={getY(point)}
                                            r="4"
                                            fill={crop.color}
                                            className="drop-shadow-sm hover:r-6 transition-all cursor-pointer"
                                        />
                                    ))}
                                </g>
                            ))}

                            {/* Vertical Dashed Line */}
                            <line
                                x1={getX(1) + (getX(2) - getX(1)) * 0.7}
                                y1={padding}
                                x2={getX(1) + (getX(2) - getX(1)) * 0.7}
                                y2={graphHeight - padding}
                                className="stroke-gray-400"
                                strokeWidth="2"
                                strokeDasharray="6 4"
                            />
                        </svg>

                        {/* Predicted Prices Button */}
                        <button
                            onClick={handlePredictedPricesClick}
                            className="absolute top-4 right-4 flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors border border-blue-200"
                        >
                            <span className="text-sm">ⓘ</span>
                            <span className="text-sm font-medium">Predicted prices</span>
                        </button>
                    </div>
                </div>

                {/* Price Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Legend
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vegetable
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price Today
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Peak Season
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Max Yearly
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Min Yearly
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {marketData.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                                            }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className="w-4 h-4 rounded-full inline-block"
                                                style={{ backgroundColor: item.color }}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                            {item.priceToday}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.peakSeason}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                            {item.maxYearly}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                                            {item.minYearly}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.notes}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Back Button (if needed) */}
                {onBack && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={onBack}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            <span>←</span>
                            <span>Back</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceTrackerSection;
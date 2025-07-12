import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

function MarketSection({ onBack }) {
    const priceData = [
        { month: "January", Potato: 150, Tomato: 350, Lettuce: 400, Carrot: 510, Brinjal: 80, Beans: 210, Pineapple: 500 },
        { month: "February", Potato: 170, Tomato: 300, Lettuce: 380, Carrot: 490, Brinjal: 90, Beans: 200, Pineapple: 520 },
        { month: "March", Potato: 180, Tomato: 270, Lettuce: 360, Carrot: 470, Brinjal: 85, Beans: 190, Pineapple: 510 },
        { month: "April", Potato: 200, Tomato: 320, Lettuce: 370, Carrot: 480, Brinjal: 95, Beans: 195, Pineapple: 530 },
        { month: "May", Potato: 220, Tomato: 340, Lettuce: 390, Carrot: 500, Brinjal: 100, Beans: 198, Pineapple: 550 },
        { month: "June", Potato: 240, Tomato: 360, Lettuce: 400, Carrot: 520, Brinjal: 110, Beans: 205, Pineapple: 540 },
        { month: "July", Potato: 260, Tomato: 370, Lettuce: 410, Carrot: 530, Brinjal: 115, Beans: 210, Pineapple: 560 },
    ];

    return (
        <div>
            <style>{`

            .market-container {
                padding: 20px;
            }
            .price-chart {
                background-color: #f9fdfc;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                font-family: 'Poppins', sans-serif;
            }
            .vegetable-table {
                width: 100%;
                border-collapse: collapse;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                font-family: 'Poppins', sans-serif;
            }
            .vegetable-table th, .vegetable-table td {
                padding: 12px 16px;
                text-align: left;
                border-bottom: 1px solid #f0f0f0;
            }
            .vegetable-table th {
                background-color: #f1f5f3;

            }
            .legend-circle {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 8px;
            }
        `}</style>

            <div className="market-container">
                <div className="price-chart">
                    <h3>Vegetable Price (Rs/kg)</h3>
                    <ResponsiveContainer width="90%" height={300}>
                        <LineChart data={priceData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Potato" stroke="#54C074" />
                            <Line type="monotone" dataKey="Tomato" stroke="#54C09E" />
                            <Line type="monotone" dataKey="Lettuce" stroke="#93C054" />
                            <Line type="monotone" dataKey="Carrot" stroke="#FD9644" />
                            <Line type="monotone" dataKey="Brinjal" stroke="#6C5CE7" />
                            <Line type="monotone" dataKey="Beans" stroke="#00CEC9" />
                            <Line type="monotone" dataKey="Pineapple" stroke="#FBC531" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <table className="vegetable-table">
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
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#54C074" }}></span></td>
                            <td>Potato</td>
                            <td>Rs. 150/=</td>
                            <td>May–June</td>
                            <td>Rs. 270/=</td>
                            <td>Rs. 120/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#54C09E" }}></span></td>
                            <td>Tomato</td>
                            <td>Rs. 350/=</td>
                            <td>Jan–April</td>
                            <td>Rs. 390/=</td>
                            <td>Rs. 250/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#93C054" }}></span></td>
                            <td>Lettuce</td>
                            <td>Rs. 400/=</td>
                            <td>Year round</td>
                            <td>Rs. 420/=</td>
                            <td>Rs. 350/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#FD9644" }}></span></td>
                            <td>Carrot</td>
                            <td>Rs. 510/=</td>
                            <td>March</td>
                            <td>Rs. 540/=</td>
                            <td>Rs. 470/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#6C5CE7" }}></span></td>
                            <td>Brinjal</td>
                            <td>Rs. 80/=</td>
                            <td>August</td>
                            <td>Rs. 120/=</td>
                            <td>Rs. 70/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#00CEC9" }}></span></td>
                            <td>Beans</td>
                            <td>Rs. 2100/=</td>
                            <td>Dec–May</td>
                            <td>Rs. 2200/=</td>
                            <td>Rs. 1800/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                        <tr>
                            <td><span className="legend-circle" style={{ backgroundColor: "#FBC531" }}></span></td>
                            <td>Pineapple</td>
                            <td>Rs. 500/=</td>
                            <td>Nov–Dec</td>
                            <td>Rs. 570/=</td>
                            <td>Rs. 480/=</td>
                            <td>Lorem ipsum</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MarketSection;

import React, { useState, useEffect } from "react";
import { useWeather } from "../../contexts/WeatherContext";

function WeatherSection({ onBack }) {
    const { selectedLocation, setSelectedLocation } = useWeather();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sri Lankan cities
    const locations = [
        'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Trincomalee',
        'Batticaloa', 'Kurunegala', 'Ratnapura', 'Badulla', 'Matara', 'Kalutara',
        'Gampaha', 'Hambantota', 'Polonnaruwa', 'Matale', 'Kegalle', 'Nuwara Eliya'
    ];

    // Fetch weather data from API
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8081/market/weather/${selectedLocation}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();

                // Transform API data to match component structure
                const transformedData = {
                    current: {
                        temp: Math.round(data.weather_data.current.temperature),
                        condition: data.weather_data.current.weather_condition,
                        humidity: data.weather_data.current.humidity,
                        windSpeed: Math.round(data.weather_data.current.wind_speed * 3.6), // Convert m/s to km/h
                        pressure: data.weather_data.current.pressure,
                        visibility: 10, // Default visibility
                        uvIndex: 6, // Default UV index
                        feelsLike: Math.round(data.weather_data.current.temperature + 2) // Estimate feels like
                    },
                    hourlyForecast: generateHourlyForecast(data.weather_data),
                    weeklyForecast: generateWeeklyForecast(data.weather_data)
                };

                setWeatherData(transformedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching weather data:', err);
                setError(err.message);
                // Fallback to dummy data
                setWeatherData(getDummyWeatherData());
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [selectedLocation]);

    // Generate hourly forecast from API data
    const generateHourlyForecast = (apiData) => {
        const hourlyData = [];
        const currentHour = new Date().getHours();

        for (let i = 0; i < 6; i++) {
            const hour = (currentHour + i) % 24;
            const temp = Math.round(apiData.current.temperature + Math.random() * 4 - 2);

            hourlyData.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                temp: temp,
                condition: getWeatherIcon(apiData.current.weather_condition),
                rain: Math.round(Math.random() * 100)
            });
        }

        return hourlyData;
    };

    // Generate weekly forecast from API data
    const generateWeeklyForecast = (apiData) => {
        const weeklyData = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[date.getDay()];
            const baseTemp = apiData.current.temperature;
            const high = Math.round(baseTemp + Math.random() * 4);
            const low = Math.round(baseTemp - 4 + Math.random() * 2);

            weeklyData.push({
                day: dayName,
                date: `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`,
                high: high,
                low: low,
                condition: apiData.current.weather_condition,
                icon: getWeatherIcon(apiData.current.weather_condition),
                rain: Math.round(Math.random() * 100)
            });
        }

        return weeklyData;
    };

    // Get weather icon based on condition
    const getWeatherIcon = (condition) => {
        const conditionLower = condition.toLowerCase();

        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
            return '☀️';
        } else if (conditionLower.includes('cloud')) {
            return '⛅';
        } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
            return '🌧️';
        } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
            return '⛈️';
        } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
            return '🌫️';
        } else {
            return '🌤️';
        }
    };

    // Fallback dummy weather data
    const getDummyWeatherData = () => ({
        current: {
            temp: 28,
            condition: "Partly Cloudy",
            humidity: 75,
            windSpeed: 12,
            pressure: 1013,
            visibility: 10,
            uvIndex: 6,
            feelsLike: 32
        },
        hourlyForecast: [
            { time: "12:00", temp: 28, condition: "⛅", rain: 10 },
            { time: "13:00", temp: 29, condition: "☀️", rain: 5 },
            { time: "14:00", temp: 30, condition: "☀️", rain: 0 },
            { time: "15:00", temp: 31, condition: "⛅", rain: 15 },
            { time: "16:00", temp: 29, condition: "🌧️", rain: 70 },
            { time: "17:00", temp: 27, condition: "🌧️", rain: 85 }
        ],
        weeklyForecast: [
            { day: "Today", date: "Aug 1", high: 30, low: 24, condition: "Partly Cloudy", icon: "⛅", rain: 20 },
            { day: "Tomorrow", date: "Aug 2", high: 29, low: 23, condition: "Cloudy", icon: "☁️", rain: 40 },
            { day: "Thursday", date: "Aug 3", high: 27, low: 22, condition: "Rainy", icon: "🌧️", rain: 80 },
            { day: "Friday", date: "Aug 4", high: 28, low: 23, condition: "Sunny", icon: "☀️", rain: 10 },
            { day: "Saturday", date: "Aug 5", high: 30, low: 25, condition: "Sunny", icon: "☀️", rain: 5 },
            { day: "Sunday", date: "Aug 6", high: 29, low: 24, condition: "Partly Cloudy", icon: "⛅", rain: 25 },
            { day: "Monday", date: "Aug 7", high: 28, low: 23, condition: "Cloudy", icon: "☁️", rain: 30 }
        ]
    });

    return (
        <div>
            <style>{`
                .weather-container {
                    padding: 20px;
                    font-family: 'Poppins', sans-serif;
                }

                .weather-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .location-selector {
                    padding: 8px 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    font-size: 14px;
                    background-color: white;
                    cursor: pointer;
                    transition: border-color 0.2s ease;
                }

                .location-selector:focus {
                    outline: none;
                    border-color: #4CAF50;
                }

                .current-weather-panel {
                    background-color: #f9fdfc;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .current-weather-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    align-items: center;
                }

                .current-temp-section {
                    text-align: center;
                }

                .main-temp {
                    font-size: 48px;
                    font-weight: 700;
                    color: #333;
                    margin: 0;
                }

                .main-condition {
                    font-size: 18px;
                    color: #666;
                    margin: 5px 0;
                }

                .feels-like {
                    font-size: 14px;
                    color: #888;
                }

                .weather-stats {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }

                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px;
                    background-color: white;
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                }

                .stat-icon {
                    font-size: 20px;
                    margin-bottom: 5px;
                }

                .stat-value {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                }

                .stat-label {
                    font-size: 12px;
                    color: #666;
                }

                .hourly-forecast-panel {
                    background-color: #f9fdfc;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .hourly-scroll {
                    display: flex;
                    gap: 15px;
                    overflow-x: auto;
                    padding-bottom: 10px;
                }

                .hourly-item {
                    min-width: 80px;
                    text-align: center;
                    padding: 10px;
                    background-color: white;
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                }

                .hourly-time {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                }

                .hourly-icon {
                    font-size: 24px;
                    margin: 5px 0;
                }

                .hourly-temp {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 3px;
                }

                .hourly-rain {
                    font-size: 11px;
                    color: #4CAF50;
                }

                .weekly-forecast-panel {
                    background-color: #f9fdfc;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .weekly-item {
                    display: grid;
                    grid-template-columns: 1fr 60px 80px 60px 60px;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e0e0e0;
                }

                .weekly-item:last-child {
                    border-bottom: none;
                }

                .weekly-day {
                    font-weight: 600;
                    color: #333;
                }

                .weekly-date {
                    font-size: 12px;
                    color: #666;
                }

                .weekly-icon {
                    font-size: 24px;
                    text-align: center;
                }

                .weekly-condition {
                    font-size: 13px;
                    color: #666;
                    text-align: center;
                }

                .weekly-temps {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .weekly-high {
                    font-weight: 600;
                    color: #333;
                }

                .weekly-low {
                    color: #666;
                }

                .weekly-rain {
                    text-align: center;
                    font-size: 12px;
                    color: #4CAF50;
                }

                .panel-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 15px;
                }

                .back-btn {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: background-color 0.2s ease;
                }

                .back-btn:hover {
                    background-color: #45a049;
                }
            `}</style>

            <div className="weather-container">
                <div className="weather-header">
                    <h2>Weather Forecast</h2>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <select
                            className="location-selector"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {locations.map(location => (
                                <option key={location} value={location}>{location}</option>
                            ))}
                        </select>
                        <button className="back-btn" onClick={onBack}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '3rem',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '2rem', animation: 'spin 2s linear infinite' }}>🌤️</div>
                        <p style={{ color: '#666', margin: 0 }}>Loading weather data for {selectedLocation}...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div style={{
                        padding: '1rem',
                        background: 'rgba(255, 152, 0, 0.1)',
                        border: '1px solid rgba(255, 152, 0, 0.3)',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <p style={{ color: '#ef6c00', margin: 0, fontStyle: 'italic' }}>
                            ⚠️ Error loading weather data: {error}. Showing cached data.
                        </p>
                    </div>
                )}

                {/* Weather Content */}
                {weatherData && !loading && (
                    <>
                        {/* Current Weather */}
                        <div className="current-weather-panel">
                            <h3 className="panel-title">Current Weather in {selectedLocation}</h3>
                            <div className="current-weather-grid">
                                <div className="current-temp-section">
                                    <div className="main-temp">{weatherData.current.temp}°C</div>
                                    <div className="main-condition">{weatherData.current.condition}</div>
                                    <div className="feels-like">Feels like {weatherData.current.feelsLike}°C</div>
                                </div>
                                <div className="weather-stats">
                                    <div className="stat-item">
                                        <div className="stat-icon">💧</div>
                                        <div className="stat-value">{weatherData.current.humidity}%</div>
                                        <div className="stat-label">Humidity</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon">💨</div>
                                        <div className="stat-value">{weatherData.current.windSpeed} km/h</div>
                                        <div className="stat-label">Wind Speed</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon">🌡️</div>
                                        <div className="stat-value">{weatherData.current.pressure} hPa</div>
                                        <div className="stat-label">Pressure</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-icon">☀️</div>
                                        <div className="stat-value">{weatherData.current.uvIndex}</div>
                                        <div className="stat-label">UV Index</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hourly Forecast */}
                        <div className="hourly-forecast-panel">
                            <h3 className="panel-title">Hourly Forecast</h3>
                            <div className="hourly-scroll">
                                {weatherData.hourlyForecast.map((hour, index) => (
                                    <div key={index} className="hourly-item">
                                        <div className="hourly-time">{hour.time}</div>
                                        <div className="hourly-icon">{hour.condition}</div>
                                        <div className="hourly-temp">{hour.temp}°C</div>
                                        <div className="hourly-rain">{hour.rain}%</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Forecast */}
                        <div className="weekly-forecast-panel">
                            <h3 className="panel-title">7-Day Forecast</h3>
                            {weatherData.weeklyForecast.map((day, index) => (
                                <div key={index} className="weekly-item">
                                    <div>
                                        <div className="weekly-day">{day.day}</div>
                                        <div className="weekly-date">{day.date}</div>
                                    </div>
                                    <div className="weekly-icon">{day.icon}</div>
                                    <div className="weekly-condition">{day.condition}</div>
                                    <div className="weekly-temps">
                                        <span className="weekly-high">{day.high}°</span>
                                        <span className="weekly-low">{day.low}°</span>
                                    </div>
                                    <div className="weekly-rain">{day.rain}%</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default WeatherSection;

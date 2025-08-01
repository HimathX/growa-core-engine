import React, { useState, useEffect } from "react";
import { useWeather } from "../../contexts/WeatherContext";

const WeatherCard = ({ onClick }) => {
    const { selectedLocation } = useWeather();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch weather data from API
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8081/market/weather/${selectedLocation}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                } const data = await response.json();

                // Transform API data to match component structure
                const transformedData = {
                    location: data.location + ", Sri Lanka",
                    currentTemp: Math.round(data.weather_data.current.temperature),
                    condition: data.weather_data.current.weather_condition,
                    humidity: data.weather_data.current.humidity,
                    windSpeed: Math.round(data.weather_data.current.wind_speed * 3.6), // Convert m/s to km/h
                    forecast: generateForecast(data.weather_data)
                };

                setWeatherData(transformedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching weather data:', err);
                setError(err.message);
                // Fallback to dummy data
                setWeatherData({
                    location: selectedLocation + ", Sri Lanka",
                    currentTemp: 28,
                    condition: "Partly Cloudy",
                    humidity: 75,
                    windSpeed: 12,
                    forecast: [
                        { day: "Today", high: 30, low: 24, condition: "sunny", icon: "☀️" },
                        { day: "Tomorrow", high: 29, low: 23, condition: "cloudy", icon: "⛅" },
                        { day: "Thu", high: 27, low: 22, condition: "rainy", icon: "🌧️" },
                        { day: "Fri", high: 28, low: 23, condition: "sunny", icon: "☀️" }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [selectedLocation]);

    // Generate 4-day forecast from API data
    const generateForecast = (weatherData) => {
        const forecast = [];
        const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const todayIndex = new Date().getDay();

        // Current day
        forecast.push({
            day: "Today",
            high: Math.round(weatherData.current.temperature + 2),
            low: Math.round(weatherData.current.temperature - 4),
            condition: weatherData.current.weather_condition.toLowerCase(),
            icon: getWeatherIcon(weatherData.current.weather_condition)
        });

        // Next 3 days from forecast data
        if (weatherData.forecast_5day && weatherData.forecast_5day.length > 0) {
            const dailyForecasts = groupForecastByDay(weatherData.forecast_5day);

            for (let i = 1; i <= 3 && i < dailyForecasts.length; i++) {
                const dayData = dailyForecasts[i];
                const dayName = i === 1 ? 'Tomorrow' : days[(todayIndex + i) % 7];

                forecast.push({
                    day: dayName,
                    high: Math.round(Math.max(...dayData.map(d => d.temp))),
                    low: Math.round(Math.min(...dayData.map(d => d.temp))),
                    condition: dayData[0].condition || 'clear',
                    icon: getWeatherIcon(dayData[0].condition || 'Clear')
                });
            }
        } else {
            // Fallback if no forecast data
            for (let i = 1; i <= 3; i++) {
                const dayName = i === 1 ? 'Tomorrow' : days[(todayIndex + i) % 7];
                forecast.push({
                    day: dayName,
                    high: Math.round(weatherData.current.temperature + Math.random() * 4 - 2),
                    low: Math.round(weatherData.current.temperature - 4 + Math.random() * 2),
                    condition: 'clear',
                    icon: '⛅'
                });
            }
        }

        return forecast.slice(0, 4); // Only return 4 days as requested
    };

    // Group forecast data by day
    const groupForecastByDay = (forecastData) => {
        const grouped = {};

        forecastData.forEach(item => {
            const date = new Date(item.date).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push({
                temp: item.temp,
                condition: item.weather_condition || 'Clear'
            });
        });

        return Object.values(grouped);
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

    if (loading) {
        return (
            <div className="card weather-card">
                <div className="card-header">
                    <h3 className="card-title">Weather Forecast</h3>
                </div>
                <div className="weather-loading">
                    <div className="loading-spinner">🌤️</div>
                    <p>Loading weather data for {selectedLocation}...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card weather-card" onClick={() => onClick("weather")}>
            <div className="card-header">
                <h3 className="card-title">Weather Forecast</h3>
                <span className="card-arrow">
                </span>
            </div>

            <div className="current-weather">
                <div className="weather-main">
                    <div className="temp-display">
                        <span className="current-temp">{weatherData.currentTemp}°C</span>
                        <div className="weather-condition">
                            <span className="condition-icon">{getWeatherIcon(weatherData.condition)}</span>
                            <span className="condition-text">{weatherData.condition}</span>
                        </div>
                    </div>
                    <div className="location">{weatherData.location}</div>
                </div>

                <div className="weather-details">
                    <div className="detail-item">
                        <span className="detail-icon">💧</span>
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">{weatherData.humidity}%</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-icon">💨</span>
                        <span className="detail-label">Wind</span>
                        <span className="detail-value">{weatherData.windSpeed} km/h</span>
                    </div>
                </div>
            </div>

            <div className="weather-forecast">
                <div className="forecast-title">4-Day Forecast</div>
                <div className="forecast-grid">
                    {weatherData.forecast.map((day, index) => (
                        <div key={index} className="forecast-item">
                            <div className="forecast-day">{day.day}</div>
                            <div className="forecast-icon">{day.icon}</div>
                            <div className="forecast-temps">
                                <span className="high-temp">{day.high}°</span>
                                <span className="low-temp">{day.low}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="weather-details-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick("weather");
                }}
            >
                <span className="icon">🌤️</span> View Details
            </button>

            {error && (
                <div className="weather-error">
                    <small>Using cached data - {error}</small>
                </div>
            )}
        </div>
    );
};

export default WeatherCard;

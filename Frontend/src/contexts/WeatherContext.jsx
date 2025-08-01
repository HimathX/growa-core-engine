import React, { createContext, useContext, useState } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};

export const WeatherProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState('Colombo');

    return (
        <WeatherContext.Provider value={{
            selectedLocation,
            setSelectedLocation
        }}>
            {children}
        </WeatherContext.Provider>
    );
};
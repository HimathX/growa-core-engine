import React from "react";
import { useTranslation } from "react-i18next";
import YieldProgressCard from "./YieldProgressCard";
import WeatherCard from "./WeatherCard";
import PointOfInterestMapCard from "./PointOfInterestMapCard";
import GrowBuddyAICard from "./GrowBuddyAICard";

const Dashboard = ({ onCardClick }) => {
    const { t } = useTranslation();

    return (
        <main className="dashboard">
            <div className="dashboard-grid">
                <YieldProgressCard onClick={() => onCardClick("yieldProgress")} />
                <PointOfInterestMapCard />
                <WeatherCard onClick={() => onCardClick("weather")} />
                <GrowBuddyAICard onClick={() => onCardClick("growBuddyAI")} />
            </div>
        </main>
    );
};

export default Dashboard;
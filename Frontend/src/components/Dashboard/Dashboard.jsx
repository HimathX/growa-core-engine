import React from "react";
import { useTranslation } from "react-i18next";
import YieldProgressCard from "./YieldProgressCard";
import PriceTrackerCard from "./PriceTrackerCard";
import PointOfInterestMapCard from "./PointOfInterestMapCard";
import GrowBuddyAICard from "./GrowBuddyAICard";

const Dashboard = ({ onCardClick }) => {
    const { t } = useTranslation();

    return (
        <main className="dashboard">
            <div className="dashboard-grid">
                <YieldProgressCard onClick={() => onCardClick("yieldProgress")} />
                <PointOfInterestMapCard onClick={() => onCardClick("poiMap")} />
                <PriceTrackerCard onClick={() => onCardClick("priceTracker")} />
                <GrowBuddyAICard onClick={() => onCardClick("growBuddyAI")} />
            </div>
        </main>
    );
};

export default Dashboard;
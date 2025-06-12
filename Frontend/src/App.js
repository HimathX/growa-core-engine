import React, { useState } from "react";
import "./App.css";

// Import components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import YieldProgressSection from "./components/Sections/YieldProgressSection";
import PriceTrackerSection from "./components/Sections/PriceTrackerSection";
import PointOfInterestMapSection from "./components/Sections/PointOfInterestMapSection";
import GrowBuddyAISection from "./components/Sections/GrowBuddyAISection";
// Dummy sections for Market, Diagnose, Plan
import MarketSection from "./components/Sections/MarketSection";
import DiagnoseSection from "./components/Sections/DiagnoseSection";
import PlanSection from "./components/Sections/PlanSection";

function App() {
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard', 'yieldProgress', etc.
  const [activeNavItem, setActiveNavItem] = useState("Home");

  const handleCardClick = (sectionName) => {
    console.log(`Card clicked, navigating to ${sectionName} section.`);
    setCurrentView(sectionName);
  };

  const handleNavClick = (viewName, navItemName) => {
    console.log(
      `Sidebar item ${navItemName} clicked, navigating to ${viewName}.`
    );
    setCurrentView(viewName);
    setActiveNavItem(navItemName);
  };

  const renderView = () => {
    switch (currentView) {
      case "yieldProgress":
        return (
          <YieldProgressSection
            onBack={() => handleNavClick("dashboard", "Home")}
          />
        );
      case "priceTracker":
        return (
          <PriceTrackerSection
            onBack={() => handleNavClick("dashboard", "Home")}
          />
        );
      case "poiMap":
        return (
          <PointOfInterestMapSection
            onBack={() => handleNavClick("dashboard", "Home")}
          />
        );
      case "growBuddyAI":
        return (
          <GrowBuddyAISection
            onBack={() => handleNavClick("dashboard", "Home")}
          />
        );
      case "market":
        return (
          <MarketSection onBack={() => handleNavClick("dashboard", "Home")} />
        );
      case "diagnose":
        return (
          <DiagnoseSection onBack={() => handleNavClick("dashboard", "Home")} />
        );
      case "plan":
        return (
          <PlanSection onBack={() => handleNavClick("dashboard", "Home")} />
        );
      case "dashboard":
      default:
        return <Dashboard onCardClick={handleCardClick} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar onNavClick={handleNavClick} activeItem={activeNavItem} />
      <div className="main-content-area">
        <Header />
        {renderView()}
      </div>
    </div>
  );
}

export default App;

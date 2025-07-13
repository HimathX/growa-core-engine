import React, { useState } from "react";
import "./App.css";
// Import components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import YieldProgressSection from "./components/Sections/YieldProgressSection.jsx";
import PriceTrackerSection from "./components/Sections/PriceTrackerSection.jsx";
import PointOfInterestMapSection from "./components/Sections/PointOfInterestMapSection.jsx";
import GrowBuddyAISection from "./components/Sections/GrowBuddyAISection.jsx";
// Dummy sections for Market, Diagnose, Plan
import MarketSection from "./components/Sections/MarketSection.jsx";
import DiagnoseSection from "./components/Sections/DiagnoseSection.jsx";
import PlanSection from "./components/Sections/PlanSection.jsx";
import './i18n';

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
        return React.createElement(YieldProgressSection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "priceTracker":
        return React.createElement(PriceTrackerSection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "poiMap":
        return React.createElement(PointOfInterestMapSection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "growBuddyAI":
        return React.createElement(GrowBuddyAISection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "market":
        return React.createElement(MarketSection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "diagnose":
        return React.createElement(DiagnoseSection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "plan":
        return React.createElement(PlanSection, {
          onBack: () => handleNavClick("dashboard", "Home")
        });
      case "dashboard":
      default:
        return React.createElement(Dashboard, {
          onCardClick: handleCardClick
        });
    }
  };

  return React.createElement(
    "div",
    { className: "app-container" },
    React.createElement(Sidebar, {
      onNavClick: handleNavClick,
      activeItem: activeNavItem
    }),
    React.createElement(
      "div",
      { className: "main-content-area" },
      React.createElement(Header),
      renderView()
    )
  );
}

export default App;
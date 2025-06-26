import React from "react";
// import '../App.css'; // Styles are in App.css

const Sidebar = ({ onNavClick, activeItem }) => {
    const handleItemClick = (viewName, navItemName) => {
        onNavClick(viewName, navItemName);
    };

    const handleLanguageClick = () => {
        console.log("Language selector clicked.");
    };

    return (
        <aside className="sidebar">
            <div className="logo">growa</div>
            <nav className="nav-menu">
                <ul>
                    <li
                        className={activeItem === "Home" ? "active" : ""}
                        onClick={() => handleItemClick("dashboard", "Home")}
                    >
                        <span className="icon">🏠</span> Home
                    </li>
                    <li
                        className={activeItem === "Market" ? "active" : ""}
                        onClick={() => handleItemClick("market", "Market")}
                    >
                        <span className="icon">💰</span> Market
                    </li>
                    <li
                        className={activeItem === "Diagnose" ? "active" : ""}
                        onClick={() => handleItemClick("diagnose", "Diagnose")}
                    >
                        <span className="icon">🩺</span> Diagnose
                    </li>
                    <li
                        className={activeItem === "Plan" ? "active" : ""}
                        onClick={() => handleItemClick("plan", "Plan")}
                    >
                        <span className="icon">📊</span> Plan
                    </li>
                </ul>
            </nav>
            <div className="language-selector" onClick={handleLanguageClick}>
                <span className="icon">🌍</span> English{" "}
                <span style={{ marginLeft: "5px" }}>▼</span>
            </div>
        </aside>
    );
};

export default Sidebar;
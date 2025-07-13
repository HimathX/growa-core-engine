import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Sidebar = ({ onNavClick, activeItem }) => {
    const { i18n, t } = useTranslation();

    const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

    const handleItemClick = (viewName, navItemName) => {
        onNavClick(viewName, navItemName);
    };

    const toggleLanguageDropdown = () => {
        setLanguageDropdownVisible((prev) => !prev);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguageDropdownVisible(false);
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
                        <span className="icon">🏠</span> {t("home")}
                    </li>
                    <li
                        className={activeItem === "Market" ? "active" : ""}
                        onClick={() => handleItemClick("market", "Market")}
                    >
                        <span className="icon">💰</span> {t("market")}
                    </li>
                    <li
                        className={activeItem === "Diagnose" ? "active" : ""}
                        onClick={() => handleItemClick("diagnose", "Diagnose")}
                    >
                        <span className="icon">🩺</span> {t("diagnose")}
                    </li>
                    <li
                        className={activeItem === "Plan" ? "active" : ""}
                        onClick={() => handleItemClick("plan", "Plan")}
                    >
                        <span className="icon">📊</span> {t("plan")}
                    </li>
                </ul>
            </nav>

            <div
                className="language-selector"
                onClick={toggleLanguageDropdown}
                style={{ cursor: "pointer", position: "relative" }}
            >
                <span className="icon">🌍</span> Language{" "}
                <span style={{ marginLeft: "5px" }}>▼</span>
                <div
                    className="language-dropdown"
                    style={{
                        display: languageDropdownVisible ? "block" : "none",
                        position: "absolute",
                        left: 0,
                        bottom: "100%",
                        background: "#fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 10,
                        minWidth: "120px"
                    }}
                >
                    <div style={{ padding: "8px 16px", cursor: "pointer" }} onClick={() => changeLanguage("en")}>English</div>
                    <div style={{ padding: "8px 16px", cursor: "pointer" }} onClick={() => changeLanguage("si")}>සිංහල</div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

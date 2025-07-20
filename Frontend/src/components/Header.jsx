import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const menuRef = useRef(null);
    const languageRef = useRef(null);

    // Close menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const notificationsRef = useRef(null);

    const handleIconClick = (iconName) => {
        if (iconName === "Profile") {
            setMenuOpen((prev) => !prev);
            setNotificationsOpen(false);
            setLanguageOpen(false);
        } else if (iconName === "Notifications") {
            setNotificationsOpen((prev) => !prev);
            setMenuOpen(false);
            setLanguageOpen(false);
        } else if (iconName === "Language") {
            setLanguageOpen((prev) => !prev);
            setMenuOpen(false);
            setNotificationsOpen(false);
        } else {
            console.log(`${iconName} icon clicked.`);
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguageOpen(false);
    };

    // Close menus if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                notificationsRef.current && !notificationsRef.current.contains(event.target) &&
                languageRef.current && !languageRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
                setNotificationsOpen(false);
                setLanguageOpen(false);
            }
            // If only one menu is open, close it if clicked outside
            if (
                menuRef.current && !menuRef.current.contains(event.target) &&
                menuOpen
            ) {
                setMenuOpen(false);
            }
            if (
                notificationsRef.current && !notificationsRef.current.contains(event.target) &&
                notificationsOpen
            ) {
                setNotificationsOpen(false);
            }
            if (
                languageRef.current && !languageRef.current.contains(event.target) &&
                languageOpen
            ) {
                setLanguageOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen, notificationsOpen, languageOpen]);

    return (
        <header className="header" style={{ position: "relative" }}>
            <div className="header-icons" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span className="icon" onClick={() => handleIconClick("Help")}>❓</span>
                <span className="icon" onClick={() => handleIconClick("Notifications")}>🔔</span>
                <span className="icon" onClick={() => handleIconClick("Language")}>🌐</span>
                <span className="icon" onClick={() => handleIconClick("Settings")}>⚙️</span>
                <div
                    className="profile-icon"
                    onClick={() => handleIconClick("Profile")}
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                    }}
                >
                    <span role="img" aria-label="profile">👤</span>
                </div>
                {notificationsOpen && (
                    <div
                        ref={notificationsRef}
                        style={{
                            position: "absolute",
                            top: 50,
                            right: 50,
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            borderRadius: 8,
                            minWidth: 220,
                            zIndex: 100,
                            padding: "0.5rem 0",
                        }}
                    >
                        <div style={{ padding: "0.75rem 1rem", fontWeight: 500, borderBottom: "1px solid #eee" }}>
                            {t('notifications')}
                        </div>
                        <div style={{ padding: "1rem", color: "#888", textAlign: "center" }}>
                            {t('noNotifications')}
                        </div>
                    </div>
                )}
                {languageOpen && (
                    <div
                        ref={languageRef}
                        style={{
                            position: "absolute",
                            top: 50,
                            right: 80,
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            borderRadius: 8,
                            minWidth: 150,
                            zIndex: 100,
                            padding: "0.5rem 0",
                        }}
                    >
                        <div style={{ padding: "0.75rem 1rem", fontWeight: 500, borderBottom: "1px solid #eee" }}>
                            {t('language')}
                        </div>
                        <div
                            style={{
                                padding: "0.75rem 1rem",
                                cursor: "pointer",
                                backgroundColor: i18n.language === 'en' ? '#f0f0f0' : 'transparent'
                            }}
                            onClick={() => changeLanguage('en')}
                        >
                            🇺🇸 English
                        </div>
                        <div
                            style={{
                                padding: "0.75rem 1rem",
                                cursor: "pointer",
                                backgroundColor: i18n.language === 'si' ? '#f0f0f0' : 'transparent'
                            }}
                            onClick={() => changeLanguage('si')}
                        >
                            🇱🇰 සිංහල
                        </div>
                    </div>
                )}
                {menuOpen && (
                    <div
                        ref={menuRef}
                        style={{
                            position: "absolute",
                            top: 50,
                            right: 0,
                            background: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            borderRadius: 8,
                            minWidth: 180,
                            zIndex: 100,
                            padding: "0.5rem 0",
                        }}
                    >
                        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #eee", fontWeight: 500 }}>
                            {t('greeting')}
                        </div>
                        <div style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => alert("Settings")}>
                            {t('settings')}
                        </div>
                        <div style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => alert("Premium Account")}>
                            {t('premiumAccount')}
                        </div>
                        <div style={{ padding: "0.75rem 1rem", cursor: "pointer", color: "#dc2626" }} onClick={() => alert("Logout")}>
                            {t('logout')}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
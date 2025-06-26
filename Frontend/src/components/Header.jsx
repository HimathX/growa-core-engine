const Header = () => {
    const handleIconClick = (iconName) => {
        console.log(`${iconName} icon clicked.`);
    };

    return (
        <header className="header">
            <div className="header-icons">
                <span className="icon" onClick={() => handleIconClick("Help")}>
                    ❓
                </span>
                <span className="icon" onClick={() => handleIconClick("Notifications")}>
                    🔔
                </span>
                <span className="icon" onClick={() => handleIconClick("Settings")}>
                    ⚙️
                </span>
                <div
                    className="profile-icon"
                    onClick={() => handleIconClick("Profile")}
                ></div>
            </div>
        </header>
    );
};

export default Header;
import React from "react";
// import '../../App.css'; // Styles are in App.css

const SectionBase = ({ title, children, onBack }) => {
  return (
    <div className="section-placeholder">
      <h1>{title}</h1>
      {children}
      <p>
        This is a placeholder for the {title} section. More content will be
        added later.
      </p>
      <button className="back-button" onClick={onBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default SectionBase;

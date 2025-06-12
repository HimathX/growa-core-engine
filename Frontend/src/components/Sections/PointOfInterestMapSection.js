import React from "react";
import SectionBase from "./SectionBase";

const PointOfInterestMapSection = ({ onBack }) => {
  return (
    <SectionBase title="Point of Interest Map Details" onBack={onBack}>
      <p>
        Interactive map with layers, search functionality, and details for
        points of interest.
      </p>
    </SectionBase>
  );
};

export default PointOfInterestMapSection;

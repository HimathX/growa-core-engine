import React from "react";
import SectionBase from "./SectionBase";

const PlanSection = ({ onBack }) => {
  return (
    <SectionBase title="Farming Plan" onBack={onBack}>
      <p>
        Features for planning farming activities, crop rotation, resource
        management, etc.
      </p>
    </SectionBase>
  );
};
export default PlanSection;

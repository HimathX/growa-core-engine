import React from "react";
import SectionBase from "./SectionBase";

const MarketSection = ({ onBack }) => {
  return (
    <SectionBase title="Market Information" onBack={onBack}>
      <p>Details about current market trends, prices, and analysis.</p>
    </SectionBase>
  );
};
export default MarketSection;

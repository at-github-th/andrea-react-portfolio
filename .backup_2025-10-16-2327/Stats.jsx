import React from "react";
import SunburstChart from "./SunburstChart";

export default function Stats({ sunburstData }) {
  return (
    <div className="mt-2">
      <SunburstChart
        title="Stats"
        subtitle="Click slices to drill; Reset to return"
        data={sunburstData}
      />
    </div>
  );
}

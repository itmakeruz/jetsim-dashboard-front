import React from "react";

const TopProductItem = ({ title, percentage, color }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: color }}
          className={`w-6 h-6 rounded shrink-0 opacity-[10%]`}
        ></div>
        <span className="text-main-grey text-sm font-normal">{title}</span>
      </div>
      <span className="font-medium text-sm">{percentage}%</span>
    </div>
  );
};

export default TopProductItem;

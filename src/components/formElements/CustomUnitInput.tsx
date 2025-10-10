import React from "react";

export default function CustomUnitInput({ value, onChange, unit = "ШТ" }) {
  return (
    <div className="flex items-center border border-[rgb(116,120,141,35%)] min-h-[38px] rounded-[4px] overflow-hidden w-32">
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-full text-sm text-main-black px-2  outline-none"
        placeholder="0"
      />
      <div className="bg-[#F5F6F8] self-stretch flex items-center px-2 text-sm text-main-black">
        {unit}
      </div>
    </div>
  );
}

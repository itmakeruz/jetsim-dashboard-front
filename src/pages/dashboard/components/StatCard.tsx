import PercentChange from "@/components/PercentChange";
import formatNumber from "@/utils/formatNumber";
import { Info } from "lucide-react";

const StatCard = ({ percent, currency, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-sm main-shadow flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-main-gray text-[18px] font-bold">
          {formatNumber(+value || 0)} {currency ? currency : ""}
        </p>
        {percent && <PercentChange percent={percent} />}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-main-grey">{title}</span>
        <Info className="w-4 h-4 shrink-0 text-[#3873D3]" />
      </div>
    </div>
  );
};

export default StatCard;

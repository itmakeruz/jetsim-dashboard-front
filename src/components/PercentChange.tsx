import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const PercentChange = ({ percent }) => {
  const isPositive = parseFloat(percent) >= 0;

  return (
    <div className="flex items-center gap-1">
      {isPositive ? (
        <ArrowUpRight className="w-5 h-5 text-green-500" />
      ) : (
        <ArrowDownRight className="w-5 h-5 text-red-500" />
      )}
      <span
        className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
      >
        {percent}%
      </span>
    </div>
  );
};

export default PercentChange;

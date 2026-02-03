import React from "react";

interface UniversalTableProps {
  children: React.ReactNode;
  tableHeadItems: string[];
  className?: string;
}

function UniversalTable({
  children,
  tableHeadItems,
  className = "",
}: UniversalTableProps) {
  return (
    <div className="overflow-hidden min-w-[1200px]">
      <div className="text-left w-full">
        <div
          className={`grid w-full min-h-[36px] text-main-blackish place-items-start text-sm items-center gap-4 font-medium ${className}`}
        >
          {tableHeadItems.map((item, i) => {
            return (
              <span
                className={`whitespace-nowrap ${
                  i === tableHeadItems.length - 1
                    ? "place-self-end-safe self-center"
                    : ""
                }`}
                key={i}
              >
                {item}
              </span>
            );
          })}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default UniversalTable;

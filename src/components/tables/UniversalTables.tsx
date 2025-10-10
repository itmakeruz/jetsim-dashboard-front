function UniversalTable({ children, tableHeadItems, className }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1000px] text-left w-full">
        <div
          className={`grid w-full min-h-[36px] gap-3 text-main-blackish text-sm font-medium ${className}`}
        >
          {tableHeadItems?.map((item, i) => {
            return (
              <span className="whitespace-nowrap flex items-center" key={i}>
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

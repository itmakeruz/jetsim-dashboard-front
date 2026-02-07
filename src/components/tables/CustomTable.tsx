import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomPagination from "../paginations/CustomPagination";
import { emptyTable } from "./images";
import SkeletonRow from "./SkeletonRow";
import { Eye, FileDown, Maximize2, Minimize2 } from "lucide-react";
import TableHead from "./TableHead";
import { CustomTableProps } from "./tableType";

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

function CustomTable({
  columns,
  data,
  isLoading,
  skeletonCount = 5,
  hasPagination = false,
  pagination,
  defaultPageSize = 20,
  viewPath,
  onRowClick,
  showExcelButton = false,
  onExcelExport,
  showFullscreenButton = false,
}: CustomTableProps) {
  const hasActions = !!viewPath || !!onRowClick;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!tableWrapperRef.current) return;
    if (!document.fullscreenElement) {
      tableWrapperRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const showToolbar = showExcelButton || showFullscreenButton;

  const tableContent = (
    <div className="flex flex-col h-full gap-2 px-2 whitespace-nowrap">
      {showToolbar && (
        <div className="flex items-center justify-end gap-2 py-1 border-b border-gray-100">
          {showExcelButton && (
            <button
              type="button"
              onClick={onExcelExport}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              <FileDown className="w-4 h-4" />
              Excel
            </button>
          )}
          {showFullscreenButton && (
            <button
              type="button"
              onClick={handleFullscreen}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  Kichiklashtirish
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  To‘liq ekran
                </>
              )}
            </button>
          )}
        </div>
      )}
      <div className="grow overflow-auto scroll-bar-gutter">
        <table className="w-full border-collapse">
          <TableHead columns={columns} hasActions={hasActions} />

          <tbody>
            {isLoading
              ? [...Array(skeletonCount)].map((_, index) => (
                  <SkeletonRow key={index} skeletonCount={columns.length} />
                ))
              : data?.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b last:border-none hover:bg-gray-50 transition ${
                      onRowClick ? "cursor-pointer" : ""
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => {
                      const value = getNestedValue(row, column.id);
                      return (
                        <td
                          key={column.id}
                          className="px-4 py-3 font-medium text-sm text-gray-800"
                        >
                          {column.render
                            ? column.render(value, row)
                            : value ?? "-"}
                        </td>
                      );
                    })}
                    {viewPath && (
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <Link
                          to={`${viewPath}/${row.id}`}
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    )}
                    {onRowClick && !viewPath && (
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <Eye className="w-4 h-4 text-blue-500" />
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
        {!isLoading && data.length === 0 && (
          <div className="grow flex flex-col items-center justify-center gap-4 p-6 text-gray-500">
            <img className="w-[20%]" src={emptyTable} alt="" />
            <h2 className="font-bold text-3xl">No Data</h2>
            <p className="text-base">There is no data to show you right now</p>
          </div>
        )}
      </div>
      {hasPagination && !isLoading && (
        <CustomPagination
          totalPage={pagination?.totalPage ?? 1}
          disabled={isLoading}
          defaultPageSize={defaultPageSize}
        />
      )}
    </div>
  );

  return (
    <div ref={tableWrapperRef} className="flex flex-col h-full min-h-0 bg-white">
      {tableContent}
    </div>
  );
}

export default CustomTable;

import { useSearchParams } from "react-router-dom";
import { arrowLeft, arrowRight } from "./images";
import { useMemo } from "react";

type CustomPaginationProps = {
  totalPage: number;
  jumpSize?: number;
  siblingCount?: number;
  disabled?: boolean;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
};

function CustomPagination({
  totalPage,
  jumpSize = 5,
  siblingCount = 2,
  disabled = false,
  pageSizeOptions = [5, 10, 15, 20, 50, 100],
  defaultPageSize,
}: CustomPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);
  const currentLimit = Number(searchParams.get("size") ?? defaultPageSize);

  const onPageChange = (page: number) => {
    const params = Object.fromEntries(searchParams.entries());

    if (page === 1) delete params.page;
    else params.page = String(page);

    setSearchParams(params);
  };

  const onLimitChange = (limit: number) => {
    const params = Object.fromEntries(searchParams.entries());

    if (limit === defaultPageSize) {
      delete params.size;
    } else {
      params.size = String(limit);
    }
    params.page = "1";

    setSearchParams(params);
  };

  // useMemo DOIM chaqirilishi kerak - early return dan OLDIN
  const pages = useMemo(() => {
    const result: (number | "left-dots" | "right-dots")[] = [];
    const left = currentPage - siblingCount;
    const right = currentPage + siblingCount;

    result.push(1);

    if (left > 2) result.push("left-dots");

    for (let i = Math.max(2, left); i <= Math.min(totalPage - 1, right); i++) {
      result.push(i);
    }

    if (right < totalPage - 1) result.push("right-dots");

    if (totalPage > 1) result.push(totalPage);
    return result;
  }, [currentPage, totalPage, siblingCount]);

  // Early return hooklar dan KEYIN bo'lishi kerak
  if (totalPage <= 0) return null;

  return (
    <div className="flex justify-end items-center gap-4 pb-4 pr-4 text-sm">
      <select
        value={currentLimit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border cursor-pointer rounded px-2 py-1 text-sm"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1 || disabled}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-9 h-9 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={arrowLeft} className="w-5 mx-auto" />
        </button>

        {pages.map((p, i) =>
          p === "left-dots" ? (
            <button
              key={`l-${i}`}
              onClick={() => onPageChange(Math.max(1, currentPage - jumpSize))}
              className="w-9 h-9 grid place-content-center text-gray-500 hover:bg-gray-100 rounded"
            >
              ...
            </button>
          ) : p === "right-dots" ? (
            <button
              key={`r-${i}`}
              onClick={() =>
                onPageChange(Math.min(totalPage, currentPage + jumpSize))
              }
              className="w-9 h-9 grid place-content-center text-gray-500 hover:bg-gray-100 rounded"
            >
              ...
            </button>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 border rounded font-bold transition
                ${
                  p === currentPage
                    ? "bg-main-orange text-white border-main-orange"
                    : "border-[#E9E9E9] hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPage || disabled}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-9 h-9 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={arrowRight} className="w-5 mx-auto" />
        </button>
      </div>
    </div>
  );
}

export default CustomPagination;

import { size } from "@/constants/paginationStuffs";
import { Pagination } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PaginationComp({ total, current, totalPages, limit }) {
  const navigate = useNavigate();
  const { page } = useParams();
  const onChange = (page) => {
    const currentQueryString = window.location.search;
    const urlSearchParams = new URLSearchParams(currentQueryString);
    if (page !== 1) {
      urlSearchParams.set("page", page.toString());
    } else {
      urlSearchParams.delete("page");
    }
    const newQueryString = urlSearchParams.toString();

    navigate(`?${newQueryString}`);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [page]);
  return (
    <div className="flex items-center shrink-0 mt-5 justify-center gap-2">
      <Pagination
        className="gap-x-6 rounded-[6px] items-center bg-white"
        current={current}
        showQuickJumper={false}
        defaultPageSize={limit ?? size}
        showSizeChanger={false}
        onChange={(page) => onChange(page)}
        total={total}
        hideOnSinglePage
        responsive={true}
        itemRender={(pageNumber, type, originalElement) => {
          if (type === "prev") {
            return (
              <button
                style={{
                  opacity: current == 1 ? 0.4 : 1,
                  pointerEvents: current == 1 ? "none" : "auto",
                }}
                className="hover:bg-gray-200 flex items-center text-[12px] font-medium capitalize  md:text-sm px-3 py-1 rounded"
              >
                <ChevronLeft className="w-5" />
                назад
              </button>
            );
          }

          if (type === "next") {
            return (
              <button
                style={{
                  opacity: current == totalPages ? 0.4 : 1,
                  pointerEvents: current == totalPages ? "none" : "auto",
                }}
                className="hover:bg-gray-200 flex items-center text-[12px] font-medium capitalize  md:text-sm px-3 py-1 rounded"
              >
                вперёд
                <ChevronRight className="w-5" />
              </button>
            );
          }

          if (type === "page") {
            const isActive = current === pageNumber;
            return (
              <button
                className={`rounded !border-0 w-[24px] cursor-pointer h-[24px] text-sm font-medium transition ${
                  isActive
                    ? "bg-main-blue text-black"
                    : "bg-white text-gray-700 hover:bg-main-grey"
                }`}
                onClick={() => onChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          }

          return originalElement;
        }}
      />
    </div>
  );
}

export default PaginationComp;

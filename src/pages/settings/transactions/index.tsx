import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { referenceAPI } from "@/lib/api";

import CustomInput from "@/components/formElements/CustomInput";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import { transactionsTableHeadItems } from "@/constants/tableHeadNames";
import TransactionsTbody from "./components/TransactionsTbody";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || ""
  );

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = size;

  // Fetch transactions with TanStack Query
  const { data: transactionsResponse, isLoading } = useQuery({
    queryKey: ["transaction", currentPage, debouncedSearch],
    queryFn: () =>
      referenceAPI.getTransactions(debouncedSearch || null, currentPage),
    staleTime: 30000,
  });

  const datas = transactionsResponse?.data?.data || [];
  const meta = transactionsResponse?.data?.meta || {};
  const totalItems = meta.totalItems || 0;
  const totalPages = meta.totalPage || 1;

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <div className="w-full flex items-center bg-white max-w-[520px]">
          <span className="pl-1">
            <Search className="text-xs text-[#74788D]" />
          </span>
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0"
            placeholder="Поиск по ID, пользователю или типу"
            name="search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={transactionsTableHeadItems}
              className="grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_100px] min-w-[800px]"
            >
              <TransactionsTbody
                className="grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_100px] min-w-[800px]"
                datas={datas}
              />
            </UniversalTable>

            <PaginationComp
              current={currentPage}
              total={totalItems}
              totalPages={totalPages}
              limit={pageSize}
            />
          </div>
        ) : (
          <EmptyDatas />
        )}
      </div>
    </div>
  );
}

export default Transactions;

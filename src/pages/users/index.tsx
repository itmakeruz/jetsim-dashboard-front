import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { referenceAPI } from "@/lib/api";

import CustomInput from "@/components/formElements/CustomInput";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import UsersTbody from "./components/UsersTbody";
import Loader from "@/components/Loader";

const usersTableHeadItems = ["ID", "Email", "Верифицирован", "Дата создания"];

function Users() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = 20;

  // Fetch users with TanStack Query
  const { data: response, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => referenceAPI.getUsers(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const allDatas = response?.data || [];

  // Filter data based on search
  const filteredDatas = allDatas.filter((item: any) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      item.email?.toLowerCase().includes(searchLower) ||
      item.id?.toString().includes(searchLower)
    );
  });

  // Paginate filtered data
  const totalPages = Math.ceil(filteredDatas.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const datas = filteredDatas.slice(startIndex, startIndex + pageSize);

  const meta = {
    currentPage,
    totalItems: filteredDatas.length,
    totalPage: totalPages,
    totalSize: pageSize,
  };

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
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-4 items-center">
        <div className="w-full flex items-center bg-white max-w-[520px]">
          <span className="pl-1">
            <Search className="text-xs text-[#74788D]" />
          </span>
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0"
            placeholder="Поиск по email или ID"
            name="search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="relative grow overflow-hidden flex flex-col">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4 h-full overflow-hidden">
            <UniversalTable
              tableHeadItems={usersTableHeadItems}
              className="grid-cols-[80px_1fr_120px_180px]"
            >
              <UsersTbody
                className="grid-cols-[80px_1fr_120px_180px]"
                datas={datas}
              />
            </UniversalTable>
          </div>
        ) : (
          <EmptyDatas />
        )}
        <PaginationComp
          current={meta.currentPage || currentPage}
          total={meta.totalItems || 0}
          totalPages={meta.totalPage || 1}
          limit={meta.totalSize || 20}
        />
      </div>
    </div>
  );
}

export default Users;

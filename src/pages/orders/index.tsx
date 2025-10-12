import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ordersAPI } from "@/lib/api";
import formatNumber from "@/utils/formatNumber";

import CustomInput from "@/components/formElements/CustomInput";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

const ordersTableHeadItems = [
  "№",
  "ID заказа",
  "Дата создания",
  "Количество SIM",
  "Детали",
];

interface Tariff {
  id: number;
  quantity_sms: number;
  quantity_minute: number;
  quantity_internet: number;
  price_sell: number;
}

interface Sim {
  id: number;
  qrcode: string | null;
  tariff: Tariff;
  created_at: string;
}

interface Order {
  id: number;
  sims: Sim[];
  created_at: string;
}

function Orders() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = size;

  // Fetch orders
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["orders", currentPage, debouncedSearch],
    queryFn: () =>
      ordersAPI.getOrders({
        page: currentPage,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    staleTime: 30000,
  });

  const datas: Order[] = ordersResponse?.data?.data || [];
  const meta = ordersResponse?.data?.meta || {};
  const totalItems = meta.totalItems || 0;
  const totalPages = meta.totalPage || 1;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU")
    );
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <div className="w-full flex items-center bg-white max-w-[520px]">
          <span className="pl-1">
            <Search className="text-xs text-[#74788D]" />
          </span>
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0"
            placeholder="Поиск по ID заказа"
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
              tableHeadItems={ordersTableHeadItems}
              className="grid-cols-[50px_120px_200px_150px_1fr]"
            >
              <div>
                {datas.map((order, index) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-[50px_120px_200px_150px_1fr] gap-4 items-center border-b border-gray-200 py-3 hover:bg-gray-50"
                  >
                    <div className="text-sm text-gray-700">
                      {(currentPage - 1) * pageSize + index + 1}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id}
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(order.created_at)}
                    </div>
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {order.sims.length} SIM
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.sims.map((sim, simIndex) => (
                        <div
                          key={sim.id}
                          className="flex items-center gap-2 text-xs text-gray-700"
                        >
                          <span className="text-gray-500 font-medium">
                            SIM {simIndex + 1}:
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {formatNumber(sim.tariff.price_sell)} сум{" "}
                            {sim.tariff.quantity_internet} GB{" "}
                            1 день
                          </span>
                          {sim.qrcode && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              QR активирован
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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

export default Orders;

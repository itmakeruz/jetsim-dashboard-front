import {
  Search,
  Calendar,
  Package,
  CheckCircle2,
  Wifi,
  Phone,
  MessageSquare,
} from "lucide-react";
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
import UniversalModal from "@/components/modals/UniversalModal";
import { size } from "@/constants/paginationStuffs";

const ordersTableHeadItems = [
  "ID заказа",
  "Дата создания",
  "Количество SIM",
  "",
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex flex-col gap-6 h-full">
      {/* Search Section */}
      <div className="flex gap-4 items-center">
        <div className="w-full flex items-center bg-white rounded-lg shadow-sm border border-gray-200 max-w-[520px] px-4 py-2 transition-all hover:shadow-md">
          <Search className="w-4 h-4 text-[#74788D] mr-2 flex-shrink-0" />
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0 focus:ring-0"
            placeholder="Поиск по ID заказа"
            name="search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="relative grow overflow-hidden flex flex-col">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex p-4 flex-col h-full">
            <UniversalTable
              tableHeadItems={ordersTableHeadItems}
              className="grid-cols-[1fr_1fr_2fr]"
            >
              <div className="divide-y divide-gray-100">
                {datas.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1fr_1fr_2fr] gap-4 items-center py-2 px-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group"
                  >
                    {/* ID заказа */}
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          #{order.id}
                        </span>
                      </div>
                    </div>
                    {/* Дата создания */}
                    <div className="flex items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    {/* Количество SIM */}
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 active:scale-95 cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                        {order.sims.length} SIM
                      </button>
                    </div>
                    <div></div>
                  </div>
                ))}
              </div>
            </UniversalTable>

            <div className="border-t border-gray-200 p-0">
              <PaginationComp
                current={currentPage}
                total={totalItems}
                totalPages={totalPages}
                limit={pageSize}
              />
            </div>
          </div>
        ) : (
          <EmptyDatas />
        )}
      </div>

      {/* SIM Cards Modal */}
      {isModalOpen && selectedOrder && (
        <UniversalModal
          isShow={isModalOpen}
          title={`SIM карты заказа #${selectedOrder.id}`}
          btnText="Закрыть"
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          loading={false}
          width="min-w-[800px]"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {selectedOrder.sims.length > 0 ? (
              selectedOrder.sims.map((sim, simIndex) => (
                <div
                  key={sim.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* SIM Card Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-lg">
                          SIM {simIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SIM Card Content */}
                  <div className="p-4 space-y-4">
                    {/* SIM Info */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Информация о SIM карте
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ID SIM карты
                          </label>
                          <p className="text-sm font-semibold text-gray-900">
                            #{sim.id}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Дата создания
                          </label>
                          <p className="text-sm text-gray-900">
                            {formatDate(sim.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tariff Info */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Тарифный план
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <span className="text-base font-bold text-blue-600">
                                ₽
                              </span>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">
                                Цена
                              </label>
                              <p className="text-base font-bold text-gray-900">
                                {formatNumber(sim.tariff.price_sell)} ₽
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Wifi className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">
                                Интернет
                              </label>
                              <p className="text-base font-bold text-gray-900">
                                {sim.tariff.quantity_internet} GB
                              </p>
                            </div>
                          </div>
                        </div>

                        {sim.tariff.quantity_minute > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Phone className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500">
                                  Минуты
                                </label>
                                <p className="text-base font-bold text-gray-900">
                                  {sim.tariff.quantity_minute} мин
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {sim.tariff.quantity_sms > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-500">
                                  SMS
                                </label>
                                <p className="text-base font-bold text-gray-900">
                                  {sim.tariff.quantity_sms} SMS
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="col-span-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">
                                Срок действия
                              </label>
                              <p className="text-sm font-semibold text-gray-900">
                                1 день
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                SIM карты не найдены
              </div>
            )}
          </div>
        </UniversalModal>
      )}
    </div>
  );
}

export default Orders;

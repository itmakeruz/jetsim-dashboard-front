import { Calendar, Wifi, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { ordersAPI } from "@/lib/api";
import formatNumber from "@/utils/formatNumber";
import { formatDate } from "@/utils/dateFormatter";

import CustomTable from "@/components/tables/CustomTable";
import UniversalModal from "@/components/modals/UniversalModal";
import { orderColumns } from "@/constants/tableColumns";
import { size } from "@/constants/paginationStuffs";

interface Tariff {
  id: number;
  name_ru: string;
  name_en: string;
  quantity_sms: number;
  quantity_minute: number;
  quantity_internet: number;
  validity_period: number;
  price_sell: number;
}

interface Sim {
  id: number;
  iccid: string;
  pin_1: string;
  puk_1: string | null;
  qrcode: string | null;
  tariff: Tariff;
  created_at: string;
  day_left: number;
}

interface Order {
  id: number;
  sims: Sim[];
  created_at: string;
}

function Orders() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersAPI.getOrders({ size, ...params }),
    staleTime: 30000,
  });

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          columns={orderColumns}
          data={response?.data?.data ?? []}
          isLoading={isLoading}
          skeletonCount={10}
          hasPagination={true}
          pagination={response?.data?.meta}
          defaultPageSize={response?.data?.meta?.totalSize}
          onRowClick={handleRowClick}
        />
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
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            ICCID
                          </label>
                          <p className="text-sm font-mono text-gray-900 break-all">
                            {sim.iccid || "-"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            PIN-1
                          </label>
                          <p className="text-sm font-mono font-semibold text-gray-900">
                            {sim.pin_1 || "-"}
                          </p>
                        </div>
                        {sim.puk_1 && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              PUK-1
                            </label>
                            <p className="text-sm font-mono font-semibold text-gray-900">
                              {sim.puk_1}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tariff Info */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Тарифный план
                      </h3>
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Название тарифа
                        </label>
                        <p className="text-sm font-semibold text-gray-900">
                          {sim.tariff.name_ru || sim.tariff.name_en || "-"}
                        </p>
                      </div>
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

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Calendar className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500">
                                Срок действия
                              </label>
                              <p className="text-base font-bold text-gray-900">
                                {sim.tariff.validity_period}{" "}
                                {sim.tariff.validity_period === 1
                                  ? "день"
                                  : sim.tariff.validity_period < 5
                                  ? "дня"
                                  : "дней"}
                              </p>
                            </div>
                          </div>
                        </div>

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

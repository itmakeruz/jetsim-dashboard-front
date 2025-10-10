import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import Loader from "@/components/Loader";
import UniversalBtn from "@/components/buttons/UniversalBtn";
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  CreditCard,
  Globe,
  Package,
  FileText,
  MapPin,
  Building,
} from "lucide-react";
import formatNumber from "@/utils/formatNumber";
import { getPaymentMethods, getTotalPayment } from "@/utils/orderUtils";

function OrderViewPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Fetch order details
  const { data: orderData, isLoading: orderLoading } = useApi({
    endpoint: `/order-simcard/${orderId}`,
    method: "GET",
  });

  const order = orderData?.data;

  if (orderLoading) {
    return <Loader />;
  }
  console.log(order);

  if (!order) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Заказ не найден
        </h2>
        <p className="text-gray-600 mb-4">
          Заказ с ID {orderId} не существует или был удален
        </p>
        <UniversalBtn onClick={() => navigate(-1)}>
          Вернуться назад
        </UniversalBtn>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  // Calculate remaining days
  const getRemainingDays = () => {
    if (order.days_remaining !== undefined) {
      return order.days_remaining;
    }
    if (order.date_finish) {
      const finishDate = new Date(order.date_finish);
      const today = new Date();
      const diffTime = finishDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    return "-";
  };

  // Get status color
  const getStatusColor = () => {
    if (order.is_active && !order.is_expired) {
      return "bg-green-100 text-green-800";
    } else if (order.is_expired) {
      return "bg-red-100 text-red-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Просмотр заказа #{order.id}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
            >
              {order.status_name}
            </span>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID заказа:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Тип тарифа:</span>
                  <span
                    className={`font-medium ${
                      order.additional_plan_id
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {order.additional_plan_id ? "Дополнительные" : "Обычные"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Тип SIM:</span>
                  <span className="font-medium">
                    {order.sim_type_name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Дата создания:</span>
                  <span className="font-medium">
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Информация о тарифе
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Название тарифа:</span>
                  <span className="font-medium">{order.plan?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Интернет:</span>
                  <span className="font-medium">
                    {order.plan?.quantity_internet
                      ? `${order.plan.quantity_internet} GB`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Срок действия:</span>
                  <span className="font-medium">
                    {order.plan?.expiry_day
                      ? `${order.plan.expiry_day} дней`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Цена продажи:</span>
                  <span className="font-medium">
                    {order.plan?.price_sell
                      ? `${formatNumber(+order.plan.price_sell)} UZS`
                      : "-"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Поставщик:</span>
                  <span className="font-medium">
                    {order.plan?.provider?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Регион группа:</span>
                  <span className="font-medium">
                    {order.region_group?.name || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Информация о клиенте
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">ФИО:</span>
                  <span className="font-medium">
                    {order.client?.full_name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Телефон:</span>
                  <span className="font-medium">
                    {order.client?.phone || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">
                    {order.client?.email || "-"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Адрес:</span>
                  <span className="font-medium">
                    {order.client?.address || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Агент:</span>
                  <span className="font-medium">
                    {order.agent?.name || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIM Cards Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              SIM карты
            </h2>
            <div className="space-y-3">
              {order.simcards && order.simcards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.simcards.map((simcard, index) => (
                    <div
                      key={index}
                      className="bg-orange-500 text-white px-3 py-2 rounded-lg text-center"
                    >
                      <div className="font-medium">{simcard.ssid}</div>
                      {simcard.iccid && (
                        <div className="text-xs opacity-90 mt-1">
                          ICCID: {simcard.iccid}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">SIM карты не найдены</div>
              )}
            </div>
          </div>

          {/* Dates and Status */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Даты и статус
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Дата начала:</span>
                  <span className="font-medium">
                    {formatDate(order.date_start)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Дата окончания:</span>
                  <span className="font-medium">
                    {formatDate(order.date_finish)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Осталось дней:</span>
                  <span className="font-medium">{getRemainingDays()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Статус:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                  >
                    {order.status_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Активен:</span>
                  <span className="font-medium">
                    {order.is_active ? "Да" : "Нет"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Истек:</span>
                  <span className="font-medium">
                    {order.is_expired ? "Да" : "Нет"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Информация об оплате
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Способ оплаты:</span>
                  <span className="font-medium">
                    {getPaymentMethods(order.payments) || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Сумма оплаты:</span>
                  <span className="font-medium">
                    {getTotalPayment(order.payments) || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Общая сумма:</span>
                  <span className="font-medium">
                    {order.total_payments_amount
                      ? `${formatNumber(+order.total_payments_amount)} UZS`
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(order.notes || order.description) && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Дополнительная информация
              </h2>
              <div className="space-y-3">
                {order.notes && (
                  <div>
                    <span className="text-gray-500 block mb-1">Заметки:</span>
                    <p className="font-medium bg-gray-50 p-3 rounded-lg">
                      {order.notes}
                    </p>
                  </div>
                )}
                {order.description && (
                  <div>
                    <span className="text-gray-500 block mb-1">Описание:</span>
                    <p className="font-medium bg-gray-50 p-3 rounded-lg">
                      {order.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <UniversalBtn
            type="button"
            onClick={() => navigate(-1)}
            className="border border-gray-300 bg-transparent !text-gray-700"
          >
            Обратно к списку
          </UniversalBtn>
        </div>
      </div>
    </div>
  );
}

export default OrderViewPage;

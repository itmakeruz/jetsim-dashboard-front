import UniversalBtn from "@/components/buttons/UniversalBtn";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockOrders } from "@/data/mockData";
import Loader from "@/components/Loader";
import PaginationComp from "@/components/paginations/PaginationComp";
import formatNumber from "@/utils/formatNumber";
import { getPaymentMethods, getTotalPayment } from "@/utils/orderUtils";
import { size } from "@/constants/paginationStuffs";
import { Checkbox } from "@/components/ui/checkbox";
import UniversalModal from "@/components/modals/UniversalModal";

function ActiveOrders() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = size;

  const {
    data: allData,
    isLoading,
    deleteMultiple,
  } = useMockData({
    initialData: mockOrders,
  });

  // Filter active orders (status_id = 2)
  const activeOrders = allData.filter((order) => order.status_id === 2);

  // Filter by search
  const filteredOrders = debouncedSearch
    ? activeOrders.filter(
        (order) =>
          order.client?.full_name
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          order.id.toString().includes(debouncedSearch)
      )
    : activeOrders;

  // Paginate
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const orders = filteredOrders.slice(startIndex, endIndex);

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(orders.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSingleToggle = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const isAllChecked =
    orders.length > 0 && selectedItems.length === orders.length;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("ru-RU") + " " + date.toLocaleTimeString("ru-RU")
    );
  };

  const handleCancelOrders = async () => {
    if (selectedItems.length === 0) return;
    try {
      await deleteMultiple(selectedItems);
      setSelectedItems([]);
      setShowCancelModal(false);
      showToast.success("Заказы отменены");
    } catch (error) {
      showToast.error("Ошибка при отмене");
    }
  };

  if (isLoading && !searchQuery) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-white border border-gray-300 gap-6 rounded-lg shadow-sm">
        <div className="flex space-x-2">
          <UniversalBtn disabled={selectedItems.length === 0}>
            Подтвердить заявки
          </UniversalBtn>
          <UniversalBtn
            onClick={() => setShowCancelModal(true)}
            disabled={selectedItems.length === 0}
            className="border border-gray-300 bg-transparent !text-gray-700"
          >
            Отменить заявки
          </UniversalBtn>
        </div>

        <div className="flex items-center border px-3 border-gray-300 grow rounded overflow-hidden">
          <Search className="w-5" />
          <input
            type="text"
            placeholder="Поиск по номеру телефона, имени клиента или ID заказа"
            className="py-2 px-3 outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <UniversalBtn onClick={() => navigate("/sim-orders")}>
            + Создать новую
          </UniversalBtn>
        </div>
      </div>

      <div className="p-3 bg-white mt-4 rounded-xl shadow overflow-x-auto">
        {orders.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left whitespace-nowrap">
                <th className="p-2">
                  <Checkbox
                    checked={isAllChecked}
                    onCheckedChange={toggleSelectAll}
                    className="data-[state=checked]:bg-main-orange mt-1 data-[state=checked]:!border-main-orange border-black"
                  />
                </th>
                <th className="p-2">ID</th>
                <th className="p-2">Тип симкарты</th>
                <th className="p-2">Клиент</th>
                <th className="p-2">Дата создания</th>
                <th className="p-2">Регион группа</th>
                <th className="p-2">Тариф</th>
                <th className="p-2">Сим карта</th>
                <th className="p-2">Оплата</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item.id} className="border-t whitespace-nowrap">
                  <td className="p-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSingleToggle(item.id)}
                      className="border-black data-[state=checked]:bg-main-orange data-[state=checked]:!border-main-orange"
                    />
                  </td>
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.sim_type?.name || "-"}</td>
                  <td className="p-2">{item.client?.full_name || "-"}</td>
                  <td className="p-2">{formatDate(item.created_at)}</td>
                  <td className="p-2">{item.region_group?.name || "-"}</td>
                  <td className="p-2">
                    {item.plan?.name
                      ? `${item.plan.name} ${item.plan.quantity_internet} GB ${
                          item.plan.expiry_day
                        } день ${formatNumber(+item.plan.price_sell)}`
                      : "-"}
                  </td>
                  <td className="p-2">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded">
                      {item.simcards.map((simcard) => simcard.ssid).join(", ")}
                    </span>
                  </td>
                  <td className="p-2 text-green-600">
                    {getPaymentMethods(item.payments)} (
                    {getTotalPayment(item.payments)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery
              ? "По вашему запросу ничего не найдено"
              : "Нет данных для отображения"}
          </div>
        )}

        {orders.length > 0 && (
          <PaginationComp
            current={currentPage}
            total={totalItems}
            totalPages={totalPages}
            limit={pageSize}
          />
        )}
      </div>

      <UniversalModal
        isShow={showCancelModal}
        setIsShow={setShowCancelModal}
        title="Отмена заявок"
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleCancelOrders}
      >
        <div className="text-center">
          <p className="mb-4">
            Вы уверены, что хотите отменить выбранные заявки?
          </p>
        </div>
      </UniversalModal>
    </div>
  );
}

export default ActiveOrders;

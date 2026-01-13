import formatNumber from "@/utils/formatNumber";

function TransactionsTbody({ datas, className }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Успешно
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            В ожидании
          </span>
        );
      case "ERROR":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Ошибка
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {datas.map((item, index) => (
        <div
          key={item.id}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span className="px-3 py-2">{item.id}</span>
          <span className="px-3 py-2">
            {item.user
              ? item.user.name || item.user.email || `ID: ${item.user.id}`
              : "-"}
          </span>
          <span className="px-3 py-2">{formatNumber(+item.amount)} ₽</span>
          <span className="px-3 py-2">
            {item.order_id ? "Заказ" : "Транзакция"}
          </span>
          <span className="px-3 py-2 whitespace-nowrap">
            {getStatusBadge(item.status)}
          </span>
          <span className="px-3 py-2">{formatDate(item.created_at)}</span>
          <span></span>
        </div>
      ))}
    </>
  );
}

export default TransactionsTbody;

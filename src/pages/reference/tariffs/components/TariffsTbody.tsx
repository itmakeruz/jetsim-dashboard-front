import formatNumber from "@/utils/formatNumber";
import { Pencil, Trash2 } from "lucide-react";

function TariffsTbody({ datas, onEdit, className, onDelete }) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={item.id || index}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span className="flex items-center justify-center">{index + 1}</span>
          <span className="flex items-center">
            {item.name_ru || item.name_en || "Название не указано"}
          </span>
          <span className="flex items-center">
            {item.regions?.length > 0
              ? `${item.regions.length} регионов`
              : "Регионы не указаны"}
          </span>
          <span className="flex items-center">
            {item.quantity_sms || 0} SMS
          </span>
          <span className="flex items-center">
            {item.quantity_minute || 0} мин
          </span>
          <span className="flex items-center">
            {formatNumber(+item.price_arrival || 0)}
          </span>
          <span className="flex items-center">
            {formatNumber(+item.price_sell || 0)}
          </span>

          <div className="flex items-center justify-start gap-3">
            <Pencil
              onClick={() => onEdit(item)}
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
            />
            <Trash2
              onClick={() => onDelete(item)}
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500"
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default TariffsTbody;

import { formatDate } from "@/utils/dateFormatter";
import formatNumber from "@/utils/formatNumber";
import { Pencil, Trash2 } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import UniversalModal from "@/components/modals/UniversalModal";
import { useState } from "react";
import UniversalBtn from "@/components/buttons/UniversalBtn";

function TariffsTbody({ datas, onEdit, className, onDelete }) {
  const [isRegionsModalOpen, setIsRegionsModalOpen] = useState(null);

  return (
    <>
      {datas.map((item, index) => (
        <div
          key={item.id || index}
          className={`grid w-full py-1 min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span className="flex items-center justify-center">{item.id}</span>
          <span className="flex items-center">
            {item.name_ru || item.name_en || "Название не указано"}
          </span>
          <div className="flex items-center">
            <UniversalBtn
              type="button"
              className={`!bg-[rgb(116,120,141,10%)] !text-main-grey whitespace-nowrap ${
                !item?.regions?.length && "!cursor-not-allowed"
              }`}
              onClick={() => setIsRegionsModalOpen(item.id)}
              disabled={!item?.regions?.length}
            >
              Показать регионы ({item?.regions?.length || 0})
            </UniversalBtn>
          </div>
          <span className="flex items-center">
            {item.quantity_sms || 0} SMS
          </span>
          <span className="flex items-center">
            {item.quantity_minute || 0} мин
          </span>
          <span className="flex items-center">
            {formatNumber(+item.price_arrival || 0)} ₽
          </span>
          <span className="flex items-center">
            {formatNumber(+item.price_sell || 0)} ₽
          </span>
          <span className="flex items-center">
            {formatDate(item.created_at)}
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
          <UniversalModal
            title={
              item?.regions
                ? `Регионы: ${item.name_ru || item.name_en}`
                : "Регионы"
            }
            isShow={isRegionsModalOpen === item.id}
            onClose={() => setIsRegionsModalOpen(false)}
            onSubmit={() => setIsRegionsModalOpen(false)}
            isButtonsDisabled={true}
            width="min-w-[650px]"
          >
            <div className="max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {item?.regions?.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 border border-gray-200 rounded px-3 py-2 text-sm"
                    title={r.name_ru}
                  >
                    {r?.image ? (
                      <img
                        src={getImageUrl(r.image)}
                        alt={r.name_ru}
                        className="w-8 h-8 rounded object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded bg-gray-100 inline-block" />
                    )}
                    <span className="truncate">{r.name_ru}</span>
                  </div>
                ))}
              </div>
            </div>
          </UniversalModal>
        </div>
      ))}
    </>
  );
}

export default TariffsTbody;

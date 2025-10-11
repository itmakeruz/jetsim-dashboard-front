import { Pencil, Trash2 } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";
import UniversalModal from "@/components/modals/UniversalModal";
import { useState } from "react";
import UniversalBtn from "@/components/buttons/UniversalBtn";

function RegionsGroupTbody({ datas, onEdit, onDelete, className }) {
  const [isRegionsModalOpen, setIsRegionsModalOpen] = useState(null);
  return (
    <>
      {datas
        .map((item: any, index: number) => (
          <div
            key={item.id || index}
            className={`grid w-full min-h-[40px] py-1 border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
          >
            <span>{item.id}</span>
            {item.icon && (
              <img
                src={getImageUrl(item.icon)}
                alt={item.name_ru}
                className="w-12 h-8 object-contain rounded-[2px] overflow-hidden border"
              />
            )}
            <span className="uppercase">{item.name_ru}</span>
            <span className="uppercase">{item.name_en}</span>
            <div className="flex items-center">
              <UniversalBtn
                type="button"
                className={`!bg-[rgb(116,120,141,10%)] !text-main-grey whitespace-nowrap ${!item?.regions?.length && "!cursor-not-allowed"
                  }`}
                onClick={() => setIsRegionsModalOpen(item.id)}
                disabled={!item?.regions?.length}
              >
                Показать регионы ({item?.regions?.length || 0})
              </UniversalBtn>
            </div>
            <div className={`flex items-center justify-end gap-3`}>
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
                item?.regions ? `Регионы: ${item.name_ru}` : "Регионы"
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

export default RegionsGroupTbody;

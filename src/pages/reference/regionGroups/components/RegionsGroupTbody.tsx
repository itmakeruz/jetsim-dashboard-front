import { Pencil, Trash2 } from "lucide-react";
import { getImageUrl } from "@/utils/imageUtils";

function RegionsGroupTbody({ datas, onEdit, onDelete, className }) {
  return (
    <>
      {datas
        .sort((a: any, b: any) => a.name_ru?.localeCompare(b.name_ru))
        .map((item: any, index: number) => (
          <div
            key={item.id || index}
            className={`grid w-full min-h-[40px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
          >
            <span>{index + 1}</span>
            <span className="flex items-center gap-2">
              {item.icon && (
                <img
                  src={getImageUrl(item.icon)}
                  alt={item.name_ru}
                  className="w-6 h-6 object-cover rounded"
                />
              )}
              <span className="uppercase">{item.name_ru}</span>
            </span>
            <span className="uppercase">{item.name_en}</span>
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

export default RegionsGroupTbody;

import { Pencil, Trash2 } from "lucide-react";

interface PartnersProps {
  datas: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  className?: string;
}

function PartnersTbody({ datas, onEdit, onDelete, className }: PartnersProps) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={item.id}
          className={`border-b grid items-center py-2 ${className}`}
        >
          <span className="px-3 py-2">{index + 1}</span>
          <span className="px-3 py-2">{item.name_ru}</span>
          <span className="px-3 py-2 truncate" title={item.description_ru}>
            {item.description_ru}
          </span>
          <span className="px-3 py-2">{item.identified_number}</span>
          <span className="px-3 py-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                item.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.status === "ACTIVE" ? "Активный" : "Неактивный"}
            </span>
          </span>
          <div className="flex gap-2 px-3 py-2">
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={() => onEdit(item)}
            />
            <Trash2
              className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => onDelete(item)}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default PartnersTbody;

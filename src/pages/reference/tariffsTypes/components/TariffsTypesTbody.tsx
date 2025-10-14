import { Pencil, Trash2 } from "lucide-react";

interface Item {
  id: number;
  name_ru: string;
  name_en: string;
  status: string;
}

interface TariffsTypesTbodyProps {
  datas: Item[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  className?: string;
}

function TariffsTypesTbody({
  datas,
  onEdit,
  onDelete,
  className,
}: TariffsTypesTbodyProps) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={index}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span>{item?.id}</span>
          <span className="uppercase">{item.name_ru}</span>
          <span className="uppercase">{item.name_en}</span>
          <span
            className={`${
              item.status === "ACTIVE" ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.status}
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

export default TariffsTypesTbody;

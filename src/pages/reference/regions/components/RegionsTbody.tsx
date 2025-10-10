import { Pencil, Trash2 } from "lucide-react";

function RegionsTbody({ datas, onEdit, onDelete, className }) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={index}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span>{item?.id}</span>
          <span className="uppercase">{item.name}</span>
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

export default RegionsTbody;

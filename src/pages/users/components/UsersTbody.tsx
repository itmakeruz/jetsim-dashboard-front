import { Pencil, Trash2 } from "lucide-react";

interface UsersProps {
  datas: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  className?: string;
}

function UsersTbody({ datas, onEdit, onDelete, className }: UsersProps) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={item.id}
          className={`border-b grid items-center py-2 ${className}`}
        >
          <span className="px-3 py-2">{index + 1}</span>
          <span className="px-3 py-2">{item.name}</span>
          <span className="px-3 py-2">{item.email}</span>
          <span className="px-3 py-2">{item.phone}</span>
          <span className="px-3 py-2">
            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
              {item.role}
            </span>
          </span>
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

export default UsersTbody;

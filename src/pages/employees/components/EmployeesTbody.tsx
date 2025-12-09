import { Pencil, Trash2 } from "lucide-react";

interface EmployeesProps {
  datas: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  className?: string;
  currentPage: number;
  pageSize: number;
}

function EmployeesTbody({
  datas,
  onEdit,
  onDelete,
  className,
  currentPage,
  pageSize,
}: EmployeesProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Администратор";
      case "PRE_ACCOUNTANT":
        return "Предварительный бухгалтер";
      default:
        return role;
    }
  };

  return (
    <>
      {datas.map((item, index) => {
        const globalIndex = (currentPage - 1) * pageSize + index + 1;
        return (
          <div
            key={item.id}
            className={`border-b grid items-center py-2 hover:bg-gray-50 ${className}`}
          >
            <span className="px-3 py-2">{globalIndex}</span>
            <span className="px-3 py-2">{item.name}</span>
            <span className="px-3 py-2">{item.login}</span>
            <span className="px-3 py-2">{getRoleLabel(item.role)}</span>
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
        );
      })}
    </>
  );
}

export default EmployeesTbody;

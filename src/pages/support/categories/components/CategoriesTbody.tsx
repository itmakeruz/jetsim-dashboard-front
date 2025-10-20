import { Edit, Trash2 } from "lucide-react";

interface CategoriesTbodyProps {
  className?: string;
  datas: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

function CategoriesTbody({
  className,
  datas,
  onEdit,
  onDelete,
}: CategoriesTbodyProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
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
          className={`grid ${className} py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors`}
        >
          <div className="flex items-center text-sm text-gray-600">
            {index + 1}
          </div>

          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {item.name?.ru || "—"}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              {item.name?.en || "—"}
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: item.color || "#000000" }}
              ></div>
              <span className="text-sm text-gray-600 font-mono">
                {item.color || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {item.status === "ACTIVE" ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Активен
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Неактивен
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(item)}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Изменить"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(item)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default CategoriesTbody;

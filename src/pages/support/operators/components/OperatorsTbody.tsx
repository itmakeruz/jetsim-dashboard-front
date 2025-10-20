import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface OperatorsTbodyProps {
  className?: string;
  datas: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

function OperatorsTbody({
  className,
  datas,
  onEdit,
  onDelete,
}: OperatorsTbodyProps) {
  const [showPasswords, setShowPasswords] = useState<{
    [key: number]: boolean;
  }>({});

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  const maskPassword = (password: string, show: boolean) => {
    if (!password) return "—";
    return show ? password : "••••••••";
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
              {item.first_name || "—"}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-600">{item.login || "—"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-mono">
              {maskPassword(item.password, showPasswords[item.id])}
            </span>
            <button
              onClick={() => togglePasswordVisibility(item.id)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={
                showPasswords[item.id] ? "Скрыть пароль" : "Показать пароль"
              }
            >
              {showPasswords[item.id] ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {item.is_active ? (
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

          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              {formatDate(item.created_at)}
            </span>
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

export default OperatorsTbody;

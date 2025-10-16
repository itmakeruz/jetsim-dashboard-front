import { getImageUrl } from "@/utils/imageUtils";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface UsersProps {
  datas: any[];
  className?: string;
  onView: (user: any) => void;
}
// Ismning bosh harflarini olish
function getInitials(name) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

// Har bir ism uchun barqaror rang generatsiya qilish
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs((Math.sin(hash) * 16777215) % 16777215)
  ).toString(16);
  return "#" + "0".repeat(6 - color.length) + color;
}

function UsersTbody({ datas, className, onView }: UsersProps) {
  return (
    <>
      {datas.map((item) => (
        <div
          key={item.id}
          className={`border-b grid items-center py-2 ${className}`}
        >
          <span className="px-3 py-2 font-medium">{item.id}</span>
          <div className="flex items-center gap-2">
            {item?.image ? (
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-10 h-10 shrink-0 rounded-full object-cover"
              />
            ) : item?.name ? (
              <div
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white font-semibold uppercase"
                style={{
                  backgroundColor: stringToColor(item.name),
                }}
              >
                {getInitials(item.name)}
              </div>
            ) : (
              <img
                src="https://static.vecteezy.com/system/resources/previews/046/010/545/non_2x/user-icon-simple-design-free-vector.jpg"
                alt="Nomsiz foydalanuvchi"
                className="w-10 h-10 shrink-0 rounded-full object-cover"
              />
            )}

            <span className="py-2 text-base text-main-black font-medium">
              {item?.name || "Nomsiz foydalanuvchi"}
            </span>
          </div>
          <span className="px-3 py-2 text-blue-600 font-medium">
            {item.email}
          </span>
          <Link
            to={`tel:${item.phone_number}`}
            className="px-3 py-2 text-gray-600"
          >
            {item.phone_number || "—"}
          </Link>
          <span className="px-3 py-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                item.is_verified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.is_verified ? "Да" : "Нет"}
            </span>
          </span>
          <div className="px-3 py-2 flex items-center justify-center">
            <div
              className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => onView(item)}
              title="Просмотреть детали"
            >
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default UsersTbody;

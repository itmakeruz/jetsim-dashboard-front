import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { referenceAPI } from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import { formatPhoneNumber } from "@/utils/phoneNumberFormatter";
import Loader from "@/components/Loader";

function UserSingle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => referenceAPI.getUserById(id!),
    enabled: !!id,
  });

  const user = response?.data;

  if (isLoading) {
    return <Loader isFullScreen={false} />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Пользователь не найден</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition w-fit"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Назад</span>
      </button>

      <div className="bg-white rounded shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Детали пользователя</h1>

        <div className="flex gap-8">
          {/* Avatar section */}
          <div className="flex-shrink-0">
            {user.image &&
            user.image !== "/uploads/user_profile_image/undefined" ? (
              <img
                src={getImageUrl(user.image)}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://static.vecteezy.com/system/resources/previews/046/010/545/non_2x/user-icon-simple-design-free-vector.jpg";
                }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                ID
              </label>
              <p className="text-gray-900 font-medium">{user.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Имя
              </label>
              <p className="text-gray-900 font-medium">{user.name || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 font-medium hover:underline"
              >
                {user.email}
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Телефон
              </label>
              {user.phone_number ? (
                <a
                  href={`tel:${user.phone_number}`}
                  className="text-gray-900 font-medium hover:underline"
                >
                  {formatPhoneNumber(user.phone_number)}
                </a>
              ) : (
                <p className="text-gray-500">—</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Адрес
              </label>
              <p className="text-gray-900">{user.address || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Верифицирован
              </label>
              <span
                className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${
                  user.is_verified
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.is_verified ? "Да" : "Нет"}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Дата создания
              </label>
              <p className="text-gray-900">
                {new Date(user.created_at).toLocaleDateString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {user.about && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  О себе
                </label>
                <p className="text-gray-900">{user.about}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSingle;

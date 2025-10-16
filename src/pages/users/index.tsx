import { Search, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { referenceAPI } from "@/lib/api";

import CustomInput from "@/components/formElements/CustomInput";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";
import UniversalModal from "@/components/modals/UniversalModal";

import UsersTbody from "./components/UsersTbody";
import Loader from "@/components/Loader";

const usersTableHeadItems = [
  "ID",
  "Имя",
  "Email",
  "Телефон",
  "Верифицирован",
  "Действие",
];

function Users() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = 20;

  // Fetch users with TanStack Query
  const { data: response, isLoading } = useQuery({
    queryKey: ["users", currentPage, debouncedSearch],
    queryFn: () => referenceAPI.getUsers(debouncedSearch || null, currentPage),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const datas = response?.data?.data || [];
  const meta = response?.data?.meta || {};

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set("search", debouncedSearch);
    else params.delete("search");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-4 items-center">
        <div className="w-full flex items-center bg-white max-w-[520px]">
          <span className="pl-1">
            <Search className="text-xs text-[#74788D]" />
          </span>
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0"
            placeholder="Поиск по имени, email, телефону или ID"
            name="search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="relative grow overflow-hidden flex flex-col">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4 h-full overflow-hidden overflow-x-auto">
            <UniversalTable
              tableHeadItems={usersTableHeadItems}
              className="grid-cols-[60px_1fr_1fr_1fr_100px_80px] min-w-[600px]"
            >
              <UsersTbody
                className="grid-cols-[60px_1fr_1fr_1fr_100px_80px] min-w-[600px]"
                datas={datas}
                onView={handleViewUser}
              />
            </UniversalTable>
          </div>
        ) : (
          <EmptyDatas />
        )}
        <PaginationComp
          current={meta.currentPage || currentPage}
          total={meta.totalItems || 0}
          totalPages={meta.totalPage || 1}
          limit={meta.totalSize || 20}
        />
      </div>

      {isModalOpen && selectedUser && (
        <UniversalModal
          isShow={isModalOpen}
          title="Детали пользователя"
          btnText="Закрыть"
          onClose={closeModal}
          onSubmit={closeModal}
          loading={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-gray-900">{selectedUser.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя
                </label>
                <p className="text-gray-900">{selectedUser.name || "—"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <p className="text-gray-900">
                  {selectedUser.phone_number || "—"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Адрес
                </label>
                <p className="text-gray-900">{selectedUser.address || "—"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  О себе
                </label>
                <p className="text-gray-900">{selectedUser.about || "—"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Верифицирован
                </label>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedUser.is_verified
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedUser.is_verified ? "Да" : "Нет"}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата создания
                </label>
                <p className="text-gray-900">
                  {new Date(selectedUser.created_at).toLocaleDateString(
                    "ru-RU",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
            {selectedUser.image &&
              selectedUser.image !==
                "/uploads/user_profile_image/undefined" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Фото профиля
                  </label>
                  <img
                    src={selectedUser.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
          </div>
        </UniversalModal>
      )}
    </div>
  );
}

export default Users;

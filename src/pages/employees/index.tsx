import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/utils/toastHelper";
import { referenceAPI } from "@/lib/api";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import CustomInput from "@/components/formElements/CustomInput";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import EmployeesTbody from "./components/EmployeesTbody";
import EmployeesForm from "./components/EmployeesForm";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

const employeesTableHeadItems = [
  "№",
  "Имя",
  "Логин",
  "Роль",
  "Статус",
  "Действие",
];

function Employees() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    password: "",
    role: "ADMIN",
    status: "ACTIVE",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const isEditMode = modalType === "edit";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = size;

  // Fetch staff
  const { data: staffResponse, isLoading } = useQuery({
    queryKey: ["staff", currentPage, debouncedSearch],
    queryFn: () => referenceAPI.getStaff(),
    staleTime: 30000,
  });

  const datas = staffResponse?.data?.data || [];
  const filteredDatas = debouncedSearch
    ? datas.filter(
        (item: any) =>
          item.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.login?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : datas;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => referenceAPI.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      showToast.success("Сотрудник успешно создан!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при создании сотрудника");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      referenceAPI.updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      showToast.success("Сотрудник успешно обновлен!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при обновлении сотрудника");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      showToast.success("Сотрудник успешно удален!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при удалении сотрудника");
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name: "",
      login: "",
      password: "",
      role: "ADMIN",
      status: "ACTIVE",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isEditMode) {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      updateMutation.mutate({ id: selectedData.id, data: updateData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async () => {
    if (selectedData?.id) {
      deleteMutation.mutate(selectedData.id);
    }
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

  // Calculate pagination
  const totalItems = filteredDatas.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDatas = filteredDatas.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <UniversalBtn
          className="self-start text-sm"
          onClick={() => {
            setIsShow(true);
            setModalType("add");
          }}
          icon={Plus}
        >
          Добавить сотрудника
        </UniversalBtn>

        <div className="w-full flex items-center bg-white max-w-[520px]">
          <span className="pl-1">
            <Search className="text-xs text-[#74788D]" />
          </span>
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0"
            placeholder="Поиск по имени или логину"
            name="search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {isShow && (
        <UniversalModal
          isShow={isShow}
          title={isEditMode ? "Изменить сотрудника" : "Добавить сотрудника"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <EmployeesForm
            editData={selectedData}
            formData={formData}
            setFormData={setFormData}
          />
        </UniversalModal>
      )}

      {modalType === "delete" && (
        <UniversalDeleteModal
          onClose={closeModal}
          handleDelete={handleDelete}
          selectedData={selectedData}
          loading={deleteMutation.isPending}
        />
      )}

      <div className="relative">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : paginatedDatas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={employeesTableHeadItems}
              className="grid-cols-[50px_1fr_1fr_1fr_120px_auto]"
            >
              <EmployeesTbody
                className="grid-cols-[50px_1fr_1fr_1fr_120px_auto]"
                datas={paginatedDatas}
                currentPage={currentPage}
                pageSize={pageSize}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData({
                    name: item.name,
                    login: item.login,
                    password: "",
                    role: item.role,
                    status: item.status,
                  });
                  setModalType("edit");
                  setIsShow(true);
                }}
                onDelete={(item) => {
                  setSelectedData(item);
                  setModalType("delete");
                }}
              />
            </UniversalTable>

            <PaginationComp
              current={currentPage}
              total={totalItems}
              totalPages={totalPages}
              limit={pageSize}
            />
          </div>
        ) : (
          <EmptyDatas />
        )}
      </div>
    </div>
  );
}

export default Employees;

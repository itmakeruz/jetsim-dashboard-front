import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/utils/toastHelper";
import { supportAPI } from "@/lib/api";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import CustomInput from "@/components/formElements/CustomInput";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import Loader from "@/components/Loader";

import OperatorsTbody from "./components/OperatorsTbody";
import OperatorsForm from "./components/OperatorsForm";

const operatorsTableHeadItems = [
  "№",
  "Имя",
  "Логин",
  "Пароль",
  "Статус",
  "Дата создания",
  "Действие",
];

function Operators() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isEditMode = modalType === "edit";

  // Fetch operators
  const { data: operatorsResponse, isLoading } = useQuery({
    queryKey: ["operators"],
    queryFn: () => supportAPI.getOperators(),
    staleTime: 30000,
  });

  const operators = operatorsResponse?.data?.data || [];

  // Filter operators based on search
  const filteredOperators = operators.filter((operator: any) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      operator.first_name?.toLowerCase().includes(searchLower) ||
      operator.login?.toLowerCase().includes(searchLower)
    );
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => supportAPI.createOperator(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
      showToast.success("Оператор успешно создан!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при создании оператора");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      supportAPI.updateOperator(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
      showToast.success("Оператор успешно обновлен!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при обновлении оператора");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => supportAPI.deleteOperator(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
      showToast.success("Оператор успешно удален!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при удалении оператора");
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      login: "",
      password: "",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isEditMode) {
      updateMutation.mutate({ id: selectedData.id, data: formData });
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
          Добавить оператора
        </UniversalBtn>

        <div className="w-full flex items-center bg-white max-w-[520px]">
          <span className="pl-1">
            <Search className="text-xs text-[#74788D]" />
          </span>
          <CustomInput
            divClassname="w-full"
            className="w-full bg-white !border-0"
            placeholder="Поиск"
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
          title={isEditMode ? "Изменить оператора" : "Добавить оператора"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <OperatorsForm
            editData={selectedData}
            formData={formData}
            setFormData={setFormData}
            isEditMode={isEditMode}
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
        ) : filteredOperators?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={operatorsTableHeadItems}
              className="grid-cols-[50px_1fr_1fr_1fr_120px_150px_auto]"
            >
              <OperatorsTbody
                className="grid-cols-[50px_1fr_1fr_1fr_120px_150px_auto]"
                datas={filteredOperators}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData({
                    login: item.login || "",
                    password: "",
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
          </div>
        ) : (
          <EmptyDatas />
        )}
      </div>
    </div>
  );
}

export default Operators;

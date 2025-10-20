import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
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

import CategoriesTbody from "./components/CategoriesTbody";
import CategoriesForm from "./components/CategoriesForm";

const categoriesTableHeadItems = [
  "№",
  "Название (RU)",
  "Название (EN)",
  "Цвет",
  "Статус",
  "Действие",
];

function Categories() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name: {
      ru: "",
      en: "",
    },
    color: "#FF5733",
    status: "ACTIVE",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isEditMode = modalType === "edit";

  // Fetch categories
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => supportAPI.getCategories(),
    staleTime: 30000,
  });

  const categories = categoriesResponse?.data?.data || [];

  // Filter categories based on search
  const filteredCategories = categories.filter((category: any) => {
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      category.name?.ru?.toLowerCase().includes(searchLower) ||
      category.name?.en?.toLowerCase().includes(searchLower)
    );
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => supportAPI.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast.success("Категория успешно создана!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при создании категории");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      supportAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast.success("Категория успешно обновлена!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при обновлении категории");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => supportAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      showToast.success("Категория успешно удалена!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при удалении категории");
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name: {
        ru: "",
        en: "",
      },
      color: "#FF5733",
      status: "ACTIVE",
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
          Добавить категорию
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
          title={isEditMode ? "Изменить категорию" : "Добавить категорию"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <CategoriesForm
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
        ) : filteredCategories?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={categoriesTableHeadItems}
              className="grid-cols-[50px_1fr_1fr_120px_120px_auto]"
            >
              <CategoriesTbody
                className="grid-cols-[50px_1fr_1fr_120px_120px_auto]"
                datas={filteredCategories}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData({
                    name: {
                      ru: item.name?.ru || "",
                      en: item.name?.en || "",
                    },
                    color: item.color || "#FF5733",
                    status: item.status || "ACTIVE",
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

export default Categories;

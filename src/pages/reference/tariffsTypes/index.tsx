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

import { tariffsTypesTableHeadItems } from "@/constants/tableHeadNames";
import TariffsTypesForm from "./components/TariffsTypesForm";
import TariffsTypesTbody from "./components/TariffsTypesTbody";
import Loader from "@/components/Loader";

function TariffsTypes() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name_ru: "",
    name_en: "",
    status: "ACTIVE",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isEditMode = modalType === "edit";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Fetch tariff types with TanStack Query
  const { data: response, isLoading } = useQuery({
    queryKey: ["tariffTypes", currentPage, debouncedSearch],
    queryFn: () =>
      referenceAPI.getTariffTypes({
        page: currentPage,
        search: debouncedSearch || undefined,
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const datas = response?.data?.data || [];
  const meta = response?.data?.meta || {};

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => referenceAPI.createTariffType(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tariffTypes"] });
      showToast.success(
        response?.data?.message || "Тип тарифа успешно создан!"
      );
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message ||
          "Произошла ошибка при создании типа тарифа"
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      referenceAPI.updateTariffType(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tariffTypes"] });
      showToast.success(
        response?.data?.message || "Тип тарифа успешно обновлен!"
      );
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message ||
          "Произошла ошибка при обновлении типа тарифа"
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deleteTariffType(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tariffTypes"] });
      showToast.success(
        response?.data?.message || "Тип тарифа успешно удален!"
      );
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message ||
          "Произошла ошибка при удалении типа тарифа"
      );
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name_ru: "",
      name_en: "",
      status: "ACTIVE",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Prepare data for submission
    const dataToSend = {
      name_ru: formData.name_ru,
      name_en: formData.name_en,
      status: formData.status,
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: selectedData.id,
          data: dataToSend,
        });
      } else {
        await createMutation.mutateAsync(dataToSend);
      }
    } catch (error) {
      // Error handling is done in mutation callbacks
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(selectedData.id);
    } catch (error) {
      // Error handling is done in mutation callbacks
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

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-4 items-center">
        <UniversalBtn
          className="self-start text-sm"
          onClick={() => {
            setIsShow(true);
            setModalType("add");
          }}
          icon={Plus}
        >
          Добавить тип тарифа
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
          title={isEditMode ? "Изменить тип тарифа" : "Добавить тип тарифа"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <TariffsTypesForm
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

      <div className="relative grow overflow-hidden flex flex-col">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4 h-full overflow-hidden">
            <UniversalTable
              tableHeadItems={tariffsTypesTableHeadItems}
              className="grid-cols-[80px_1fr_1fr_120px_auto]"
            >
              <TariffsTypesTbody
                className="grid-cols-[80px_1fr_1fr_120px_auto]"
                datas={datas}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData({
                    name_ru: item.name_ru || "",
                    name_en: item.name_en || "",
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
        <PaginationComp
          current={meta.currentPage || currentPage}
          total={meta.totalItems || 0}
          totalPages={meta.totalPage || 1}
          limit={meta.totalSize || 20}
        />
      </div>
    </div>
  );
}

export default TariffsTypes;

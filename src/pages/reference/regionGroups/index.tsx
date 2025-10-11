import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/utils/toastHelper";
import { referenceAPI } from "@/lib/api";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import { regionGroupsTableHeadItems } from "@/constants/tableHeadNames";
import RegionsGroupForm from "./components/RegionsGroupForm";
import RegionsGroupTbody from "./components/RegionsGroupTbody";
import CustomInput from "@/components/formElements/CustomInput";
import Loader from "@/components/Loader";

function RegionsGroup() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name_ru: "",
    name_en: "",
    icon: null as File | null,
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isEditMode = modalType === "edit";
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Fetch region groups with TanStack Query
  const {
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["regionGroups", currentPage, debouncedSearch],
    queryFn: () => referenceAPI.getRegionGroups({
      page: currentPage,
      search: debouncedSearch || undefined,
    }),
    staleTime: Infinity, // Data never becomes stale
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const datas = response?.data?.data || [];
  const meta = response?.data?.meta || {};

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => referenceAPI.createRegionGroup(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["regionGroups"] });
      showToast.success(response?.data?.message || "Группа регионов успешно создана!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || "Произошла ошибка при создании группы");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      referenceAPI.updateRegionGroup(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["regionGroups"] });
      showToast.success(response?.data?.message || "Группа регионов успешно обновлена!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || "Произошла ошибка при обновлении группы");
    },
  });
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deleteRegionGroup(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["regionGroups"] });
      showToast.success(response?.data?.message || "Группа регионов успешно удалена!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || "Произошла ошибка при удалении группы");
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name_ru: "",
      name_en: "",
      icon: null,
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Prepare FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name_ru", formData.name_ru);
    formDataToSend.append("name_en", formData.name_en);

    if (formData.icon) {
      formDataToSend.append("icon", formData.icon);
    }

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: selectedData.id,
          data: formDataToSend,
        });
      } else {
        await createMutation.mutateAsync(formDataToSend);
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
          Добавить регион группу
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
          title={isEditMode ? "Изменить регион группу" : "Добавить регион группу"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <RegionsGroupForm
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
              tableHeadItems={regionGroupsTableHeadItems}
              className="grid-cols-[50px_100px_1fr_1fr_1fr_.1fr]"
            >
              <RegionsGroupTbody
                className="grid-cols-[50px_100px_1fr_1fr_1fr_.1fr]"
                datas={datas}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData(item);
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

export default RegionsGroup;

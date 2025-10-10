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

import { regionsTableHeadItems } from "@/constants/tableHeadNames";
import RegionsGroupForm from "./components/RegionsGroupForm";
import RegionsGroupTbody from "./components/RegionsGroupTbody";
import CustomInput from "@/components/formElements/CustomInput";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

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
  const pageSize = size;

  // Check if token exists
  const token = localStorage.getItem("token");

  // Fetch region groups with TanStack Query
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["regionGroups"],
    queryFn: referenceAPI.getRegionGroups,
    enabled: !!token, // Only fetch if token exists
    staleTime: Infinity, // Data never becomes stale
    gcTime: Infinity, // Keep data in cache indefinitely
    refetchOnMount: false, // Don't refetch on component mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  const allData = response?.data?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: FormData) => referenceAPI.createRegionGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regionGroups"] });
      showToast.success("Группа регионов успешно создана!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при создании группы");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      referenceAPI.updateRegionGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regionGroups"] });
      showToast.success("Группа регионов успешно обновлена!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при обновлении группы");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deleteRegionGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regionGroups"] });
      showToast.success("Группа регионов успешно удалена!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при удалении группы");
    },
  });

  // Filter data based on search
  const filteredData = debouncedSearch
    ? allData.filter(
        (item: any) =>
          item.name_ru?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.name_en?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allData;

  // Paginate data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const datas = filteredData.slice(startIndex, endIndex);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

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
          Добавить группу
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
          title={isEditMode ? "Изменить группу" : "Добавить группу"}
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

      <div className="relative">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={regionsTableHeadItems}
              className="grid-cols-[50px_1fr_1fr_auto]"
            >
              <RegionsGroupTbody
                className="grid-cols-[50px_1fr_1fr_auto]"
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

export default RegionsGroup;

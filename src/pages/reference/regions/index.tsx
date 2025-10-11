import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { showToast } from "@/utils/toastHelper";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import { regionsTableHeadItems } from "@/constants/tableHeadNames";
import RegionsForm from "./components/RegionsForm";
import RegionsTbody from "./components/RegionsTbody";
import Loader from "@/components/Loader";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { referenceAPI } from "@/lib/api";
import CustomInput from "@/components/formElements/CustomInput";

function Regions() {
  const queryClient = useQueryClient();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name_ru: "",
    name_en: "",
    image: null,
    status: "ACTIVE",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");

  const isEditMode = modalType === "edit";
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Fetch regions with TanStack Query
  const {
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["regions", currentPage, debouncedSearch],
    queryFn: () => referenceAPI.getRegions({
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
    mutationFn: (data: FormData) => referenceAPI.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      showToast.success("Регион успешно создан!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || "Произошла ошибка");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      referenceAPI.updateRegion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      showToast.success("Регион успешно обновлен!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || "Произошла ошибка");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deleteRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      showToast.success("Регион успешно удален!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(error?.response?.data?.message || "Произошла ошибка");
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name_ru: "",
      name_en: "",
      image: null,
      status: "ACTIVE",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name_ru", formData.name_ru);
      formDataToSend.append("name_en", formData.name_en);
      formDataToSend.append("status", formData.status);
      // Only append image if it's a file
      if (formData.image && formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: selectedData.id, data: formDataToSend });
      } else {
        await createMutation.mutateAsync(formDataToSend);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(selectedData.id);
    } catch (error) {
      console.error(error);
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
          Добавить регион
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
          title={isEditMode ? "Изменить регион" : "Добавить регион"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <RegionsForm
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
              className="grid-cols-[50px_1fr_1fr_1fr_auto]"
            >
              <RegionsTbody
                className="grid-cols-[50px_1fr_1fr_1fr_auto]"
                datas={datas}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData({
                    name_ru: item.name_ru || "",
                    name_en: item.name_en || "",
                    image: item.image || null,
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

export default Regions;

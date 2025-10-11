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

import PartnersTbody from "./components/PartnersTbody";
import PartnersForm from "./components/PartnersForm";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

const partnersTableHeadItems = [
  "№",
  "Название",
  "Описание",
  "ID Номер",
  "Статус",
  "Действие",
];

function Partners() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name_ru: "",
    name_en: "",
    description_ru: "",
    description_en: "",
    status: "ACTIVE",
    identified_number: 0,
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const isEditMode = modalType === "edit";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = size;

  // Fetch partners
  const { data: partnersResponse, isLoading } = useQuery({
    queryKey: ["partners", currentPage, debouncedSearch],
    queryFn: () =>
      referenceAPI.getPartners({
        page: currentPage,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    staleTime: 30000,
  });

  const datas = partnersResponse?.data?.data || [];
  const meta = partnersResponse?.data?.meta || {};
  const totalItems = meta.totalItems || 0;
  const totalPages = meta.totalPage || 1;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => referenceAPI.createPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      showToast.success("Партнер успешно создан!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при создании партнера");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      referenceAPI.updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      showToast.success("Партнер успешно обновлен!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при обновлении партнера");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      showToast.success("Партнер успешно удален!");
      closeModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при удалении партнера");
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name_ru: "",
      name_en: "",
      description_ru: "",
      description_en: "",
      status: "ACTIVE",
      identified_number: 0,
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
          Добавить партнера
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
          title={isEditMode ? "Изменить партнера" : "Добавить партнера"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={
            createMutation.isPending || updateMutation.isPending
          }
        >
          <PartnersForm
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
              tableHeadItems={partnersTableHeadItems}
              className="grid-cols-[50px_1fr_2fr_100px_120px_auto]"
            >
              <PartnersTbody
                className="grid-cols-[50px_1fr_2fr_100px_120px_auto]"
                datas={datas}
                currentPage={currentPage}
                pageSize={pageSize}
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

export default Partners;

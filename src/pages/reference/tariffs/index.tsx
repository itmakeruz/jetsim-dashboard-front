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

import { tariffsTableHeadItems } from "@/constants/tableHeadNames";
import TariffsTbody from "./components/TariffsTbody";
import TariffsForm from "./components/TariffsForm";
import Loader from "@/components/Loader";

function Tariffs() {
  const queryClient = useQueryClient();
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name_ru: "",
    name_en: "",
    title_ru: "",
    title_en: "",
    partner_id: null,
    region_ids: [],
    region_group_id: null,
    quantity_sms: 0,
    quantity_minute: 0,
    quantity_internet: 0,
    validity_period: 0,
    price_arrival: 0,
    price_sell: 0,
    sku_id: "",
    cashback_percent: 0,
    status: "ACTIVE",
    is_popular: false,
    is_4g: false,
    is_5g: false,
    is_global: false,
    is_local: false,
    is_regional: false,
    type: null, // Changed to null to store tariff type ID
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const isEditMode = modalType === "edit";
  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Fetch tariffs with TanStack Query
  const { data: response, isLoading } = useQuery({
    queryKey: ["tariffs", currentPage, debouncedSearch],
    queryFn: () =>
      referenceAPI.getTariffs(debouncedSearch || null, currentPage),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const datas = response?.data?.data || [];
  const meta = response?.data?.meta || {};

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => referenceAPI.createTariff(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
      showToast.success(response?.data?.message || "Тариф успешно создан!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Произошла ошибка при создании тарифа"
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      referenceAPI.updateTariff(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
      showToast.success(response?.data?.message || "Тариф успешно обновлен!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message ||
          "Произошла ошибка при обновлении тарифа"
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => referenceAPI.deleteTariff(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tariffs"] });
      showToast.success(response?.data?.message || "Тариф успешно удален!");
      closeModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message || "Произошла ошибка при удалении тарифа"
      );
    },
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name_ru: "",
      name_en: "",
      title_ru: "",
      title_en: "",
      partner_id: null,
      region_ids: [],
      region_group_id: null,
      quantity_sms: 0,
      quantity_minute: 0,
      quantity_internet: 0,
      validity_period: 0,
      price_arrival: 0,
      price_sell: 0,
      sku_id: "",
      cashback_percent: 0,
      status: "ACTIVE",
      is_popular: false,
      is_4g: false,
      is_5g: false,
      is_global: false,
      is_local: false,
      is_regional: false,
      type: null,
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Prepare data for submission
    const dataToSend: any = {
      name_ru: formData.name_ru,
      name_en: formData.name_en,
      title_ru: formData.title_ru,
      title_en: formData.title_en,
      partner_id: formData.partner_id,
      quantity_sms: Number(formData.quantity_sms),
      quantity_minute: Number(formData.quantity_minute),
      quantity_internet: Number(formData.quantity_internet),
      validity_period: Number(formData.validity_period),
      price_arrival: Number(formData.price_arrival),
      price_sell: Number(formData.price_sell),
      sku_id: formData.sku_id,
      cashback_percent: Number(formData.cashback_percent),
      status: formData.status,
      is_popular: formData.is_popular,
      is_4g: formData.is_4g,
      is_5g: formData.is_5g,
      is_global: formData.is_global,
      is_local: formData.is_local,
      is_regional: formData.is_regional,
    };

    // Add region_group_id if provided
    if (formData.region_group_id) {
      dataToSend.region_group_id = Number(formData.region_group_id);
    }

    // Add region_ids if provided (array)
    if (formData.region_ids && formData.region_ids.length > 0) {
      dataToSend.region_ids = formData.region_ids.map((id: any) => Number(id));
    }

    // Add type if provided (tariff type ID)
    if (formData.type) {
      dataToSend.type = Number(formData.type);
    }

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
          Добавить тариф
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
          title={isEditMode ? "Изменить тариф" : "Добавить тариф"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          <TariffsForm
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
              tableHeadItems={tariffsTableHeadItems}
              className="grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_70px]"
            >
              <TariffsTbody
                className="grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_70px]"
                datas={datas}
                onEdit={(item) => {
                  setSelectedData(item);
                  setFormData({
                    ...item,
                    region_ids:
                      item.regions?.map((region: any) => region.id) || [],
                    region_group_id:
                      item.region_group_id || item.region_group?.id || null,
                    partner_id: item.partner?.id || null,
                    type: item.tariff_type?.id || item.type || null,
                    is_global: item.is_global || false,
                    is_local: item.is_local || false,
                    is_regional: item.is_regional || false,
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

export default Tariffs;

import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockTariffs, generateId } from "@/data/mockData";

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
import { size } from "@/constants/paginationStuffs";

// Default qiymatlar
const defaultValues = {
  name: "",
  regions: [],
  sms: 0,
  minutes: 0,
  price_arrival: 0,
  price_sell: 0,
  cashback_percent: 0,
  type_sim: "physical_sim",
  quantity_internet: 0,
  expiry_day: 30,
  provider: { name: "" },
};

function Tariffs() {
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState(defaultValues);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || ""
  );

  const isEditMode = modalType === "edit";

  // Get pagination parameters from URL
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = size;

  // Use mock data
  const {
    data: allData,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
  } = useMockData({
    initialData: mockTariffs,
  });

  // Filter data based on search
  const filteredData = debouncedSearch
    ? allData.filter(
        (item) =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.provider?.name
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      )
    : allData;

  // Paginate data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const datas = filteredData.slice(startIndex, endIndex);

  // Pagination info
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const closeModal = () => {
    setIsShow(false);
    setFormData(defaultValues);
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateItem(selectedData.id, formData);
        showToast.success("Тариф успешно обновлен!");
      } else {
        const newItem = {
          ...formData,
          id: generateId(),
        };
        await createItem(newItem);
        showToast.success("Тариф успешно создан!");
      }
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(selectedData.id);
      showToast.success("Тариф удален!");
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  // Debounce search input by 1s
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Update URL when debounced search changes (reset page to 1)
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
          Добавить тариф
        </UniversalBtn>

        <div className="w-full flex items-center bg-white max-w-[520px] ">
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
          loading={isLoading}
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
          loading={isLoading}
        />
      )}
      <div className="relative">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={tariffsTableHeadItems}
              className="grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_auto]"
            >
              <TariffsTbody
                className="grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_auto]"
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

            {/* Pagination Component */}
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

export default Tariffs;

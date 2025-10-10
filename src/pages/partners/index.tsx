import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockPartners, generateId } from "@/data/mockData";

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

  const {
    data: allData,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
  } = useMockData({
    initialData: mockPartners,
  });

  // Filter data based on search
  const filteredData = debouncedSearch
    ? allData.filter(
        (item) =>
          item.name_ru.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          item.name_en.toLowerCase().includes(debouncedSearch.toLowerCase())
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

    try {
      if (isEditMode) {
        await updateItem(selectedData.id, formData);
        showToast.success("Партнер успешно обновлен!");
      } else {
        const newItem = {
          ...formData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        await createItem(newItem);
        showToast.success("Партнер успешно создан!");
      }
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(selectedData.id);
      showToast.success("Партнер удален!");
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
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
          loading={isLoading}
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
          loading={isLoading}
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

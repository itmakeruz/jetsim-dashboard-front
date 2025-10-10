import { Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockRegions, generateId } from "@/data/mockData";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import { regionsTableHeadItems2 } from "@/constants/tableHeadNames";
import RegionsForm from "./components/RegionsForm";
import RegionsTbody from "./components/RegionsTbody";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

function Regions() {
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    countries: [],
    status: "active",
    selecting: "0",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");

  const isEditMode = modalType === "edit";
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const pageSize = size;

  const {
    data: allData,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
  } = useMockData({
    initialData: mockRegions,
  });

  // Paginate data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const datas = allData.slice(startIndex, endIndex);

  const totalItems = allData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      name: "",
      countries: [],
      status: "active",
      selecting: "0",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateItem(selectedData.id, formData);
        showToast.success("Регион успешно обновлен!");
      } else {
        const newItem = {
          ...formData,
          id: generateId(),
        };
        await createItem(newItem);
        showToast.success("Регион успешно создан!");
      }
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(selectedData.id);
      showToast.success("Регион успешно удален!");
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

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
      </div>

      {isShow && (
        <UniversalModal
          isShow={isShow}
          title={isEditMode ? "Изменить регион" : "Добавить регион"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={isLoading}
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
          loading={isLoading}
        />
      )}

      <div className="relative">
        {isLoading ? (
          <Loader isFullScreen={false} />
        ) : datas?.length > 0 ? (
          <div className="bg-white rounded shadow p-4">
            <UniversalTable
              tableHeadItems={regionsTableHeadItems2}
              className="grid-cols-[50px_1fr_auto]"
            >
              <RegionsTbody
                className="grid-cols-[50px_1fr_auto]"
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

export default Regions;

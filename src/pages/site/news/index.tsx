import { Plus } from "lucide-react";
import { useState } from "react";

import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockNews, generateId } from "@/data/mockData";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";

import { newsTableHeadItems } from "@/constants/tableHeadNames";
import NewsForm from "./components/NewsForm";
import NewsTbody from "./components/NewsTbody";
import Loader from "@/components/Loader";

const categories = [
  { id: "Русский", name: "Русский" },
  { id: "English", name: "English" },
  { id: "O'zbek", name: "O'zbek" },
];

function News() {
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    language: "en",
    image_url: "",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");

  const isEditMode = modalType === "edit";

  const {
    data: datas,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
  } = useMockData({
    initialData: mockNews,
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      title: "",
      description: "",
      content: "",
      language: "en",
      image_url: "",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleChange = (e: any) => {
    const { name, type, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateItem(selectedData.id, formData);
        showToast.success("Новость успешно обновлена!");
      } else {
        const newItem = {
          ...formData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        await createItem(newItem);
        showToast.success("Новость успешно добавлена!");
      }
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(selectedData.id);
      showToast.success("Новость удалена!");
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
          Добавить новость
        </UniversalBtn>
      </div>

      {isShow && (
        <UniversalModal
          isShow={isShow}
          title={isEditMode ? "Изменить новость" : "Добавить новость"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={isLoading}
        >
          <NewsForm
            editData={selectedData}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            categories={categories}
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
              tableHeadItems={newsTableHeadItems}
              className="grid-cols-[50px_1fr_2fr_150px_auto]"
            >
              <NewsTbody
                className="grid-cols-[50px_1fr_2fr_150px_auto]"
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
      </div>
    </div>
  );
}

export default News;

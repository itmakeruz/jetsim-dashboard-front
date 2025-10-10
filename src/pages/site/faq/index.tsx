import { Plus } from "lucide-react";
import { useState } from "react";

import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockFaq, generateId } from "@/data/mockData";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";

import { faqTableHeadItems } from "@/constants/tableHeadNames";
import FaqForm from "./components/FaqForm";
import FaqTbody from "./components/FaqTbody";
import Loader from "@/components/Loader";

function Faq() {
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    language: "en",
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
    initialData: mockFaq,
  });

  const closeModal = () => {
    setIsShow(false);
    setFormData({
      question: "",
      answer: "",
      language: "en",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateItem(selectedData.id, formData);
        showToast.success("FAQ успешно обновлен!");
      } else {
        const newItem = {
          ...formData,
          id: generateId(),
        };
        await createItem(newItem);
        showToast.success("FAQ успешно добавлен!");
      }
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(selectedData.id);
      showToast.success("FAQ удален!");
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
          Добавить FAQ
        </UniversalBtn>
      </div>

      {isShow && (
        <UniversalModal
          isShow={isShow}
          title={isEditMode ? "Изменить FAQ" : "Добавить FAQ"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={isLoading}
        >
          <FaqForm
            editData={selectedData}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
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
              tableHeadItems={faqTableHeadItems}
              className="grid-cols-[50px_1fr_2fr_150px_auto]"
            >
              <FaqTbody
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

export default Faq;

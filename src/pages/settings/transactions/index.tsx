import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { showToast } from "@/utils/toastHelper";
import { useMockData } from "@/hooks/useMockData";
import { mockTransactions, generateId } from "@/data/mockData";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalDeleteModal from "@/components/modals/UniversalDeleteModal";
import UniversalTable from "@/components/tables/UniversalTables";
import EmptyDatas from "@/components/empty/EmptyDatas";
import PaginationComp from "@/components/paginations/PaginationComp";

import { transactionsTableHeadItems } from "@/constants/tableHeadNames";
import TransactionsForm from "./components/TransactionsForm";
import TransactionsTbody from "./components/TransactionsTbody";
import Loader from "@/components/Loader";
import { size } from "@/constants/paginationStuffs";

function Transactions() {
  const [isShow, setIsShow] = useState(false);
  const [formData, setFormData] = useState({
    agent: { name: "" },
    user: { name: "" },
    amount: 0,
    type: "",
    action: "",
    message: "",
  });
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalType, setModalType] = useState("");
  const [searchParams] = useSearchParams();

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
    initialData: mockTransactions,
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
      agent: { name: "" },
      user: { name: "" },
      amount: 0,
      type: "",
      action: "",
      message: "",
    });
    setModalType("");
    setSelectedData(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updateItem(selectedData.id, formData);
        showToast.success("Транзакция успешно обновлена!");
      } else {
        const newItem = {
          ...formData,
          id: generateId(),
          created_at: new Date().toISOString(),
        };
        await createItem(newItem);
        showToast.success("Транзакция успешно создана!");
      }
      closeModal();
    } catch (error) {
      showToast.error("Произошла ошибка");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(selectedData.id);
      showToast.success("Транзакция удалена!");
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
          Добавить транзакцию
        </UniversalBtn>
      </div>

      {isShow && (
        <UniversalModal
          isShow={isShow}
          title={isEditMode ? "Изменить транзакцию" : "Добавить транзакцию"}
          btnText={isEditMode ? "Изменить" : "Добавить"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={isLoading}
        >
          <TransactionsForm
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left whitespace-nowrap border-b">
                    {transactionsTableHeadItems.map((title, index) => (
                      <th key={index} className="p-2">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <TransactionsTbody
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
                </tbody>
              </table>
            </div>

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

export default Transactions;

import CustomInput from "@/components/formElements/CustomInput";
import CustomSelect from "@/components/formElements/CustomSelect";

const transactionTypes = [
  { value: "deposit", label: "Пополнение" },
  { value: "withdrawal", label: "Снятие" },
  { value: "transfer", label: "Перевод" },
  { value: "refund", label: "Возврат" },
];

const transactionActions = [
  { value: "completed", label: "Завершено" },
  { value: "pending", label: "В ожидании" },
  { value: "failed", label: "Неудачно" },
  { value: "cancelled", label: "Отменено" },
];

function TransactionsForm({ formData, setFormData, editData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "agent" || name === "user") {
      setFormData((prev) => ({
        ...prev,
        [name]: { name: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <CustomInput
        onChange={handleChange}
        className="max-w-[410px]"
        label="Агент"
        placeholder="Введите имя агента"
        name="agent"
        value={formData?.agent?.name || ""}
        required
      />

      <CustomInput
        onChange={handleChange}
        className="max-w-[410px]"
        label="Пользователь"
        placeholder="Введите имя пользователя"
        name="user"
        value={formData?.user?.name || ""}
        required
      />

      <CustomInput
        onChange={handleChange}
        className="max-w-[410px]"
        label="Сумма"
        placeholder="Введите сумму"
        name="amount"
        type="number"
        value={formData?.amount || ""}
        required
      />

      <CustomSelect
        name="type"
        label="Тип транзакции"
        value={formData?.type || ""}
        onChange={handleChange}
        required
        options={transactionTypes}
        placeholder="Выберите тип"
        className="border max-w-[410px] !text-[#929292] border-gray-300 bg-white rounded grow"
      />

      <CustomSelect
        name="action"
        label="Действие"
        value={formData?.action || ""}
        onChange={handleChange}
        required
        options={transactionActions}
        placeholder="Выберите действие"
        className="border max-w-[410px] !text-[#929292] border-gray-300 bg-white rounded grow"
      />

      <CustomInput
        onChange={handleChange}
        className="max-w-[410px]"
        label="Сообщение"
        placeholder="Введите сообщение"
        name="message"
        value={formData?.message || ""}
        required
      />
    </div>
  );
}

export default TransactionsForm;

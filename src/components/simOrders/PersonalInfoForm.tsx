import { useRef, useEffect } from "react";
import MaskedPhoneInput from "@/components/formElements/MaskedPhoneInput";
import CustomInput from "@/components/formElements/CustomInput";
import { EyeIcon, TrashIcon } from "lucide-react";
import { hasRole } from "@/utils/sidebarFilter";
import { useAuthStore } from "@/store/authStore";

export default function PersonalInfoForm({
  formData,
  setFormData,
  isSearchingClient,
  clientFound,
  setShowPassportModal,
  handleFormChange,
  searchClientByPhone,
  selectedPlan,
  selectedSimCards,
}) {
  const passportFileRef = useRef(null);
  const { user } = useAuthStore();
  // Clear file input when passport is reset
  useEffect(() => {
    if (!formData.passport && passportFileRef.current) {
      passportFileRef.current.value = "";
    }
  }, [formData.passport]);

  const clearPassportFile = () => {
    if (passportFileRef.current) {
      passportFileRef.current.value = "";
    }
    setFormData((prev) => ({
      ...prev,
      passport: null,
    }));
  };

  const handlePhoneChangeWithSearch = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "phone") {
      if (value.length >= 13) {
        setTimeout(() => searchClientByPhone(value), 500);
      }
    }
  };

  const handleDiscountChange = (e) => {
    const { name, value } = e.target;
    const maxDiscount = selectedPlan
      ? selectedPlan.price_sell *
        (selectedSimCards.length > 0 ? selectedSimCards.length : 1)
      : 0;

    if (Number(value) <= maxDiscount) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-6">
      {/* Phone Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Телефон
          {isSearchingClient && (
            <span className="ml-2 text-xs text-orange-500">
              Mijoz qidirilmoqda...
            </span>
          )}
          {clientFound && !isSearchingClient && (
            <span className="ml-2 text-xs text-green-500">✓ Mijoz topildi</span>
          )}
        </label>
        <MaskedPhoneInput
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChangeWithSearch}
          placeholder="+998 __ ___ __ __"
          disabled={isSearchingClient}
        />
      </div>

      {/* FIO Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Фио
          {clientFound && formData.fio && (
            <span className="ml-2 text-xs text-green-500">
              Avtomatik to'ldirildi
            </span>
          )}
        </label>
        <CustomInput
          type="text"
          name="fio"
          className={`w-full border rounded px-3 text-sm py-2 focus:outline-none focus:ring-0 focus:ring-transparent ${
            clientFound && formData.full_name
              ? "border-green-300 bg-green-50"
              : "border-gray-300"
          }`}
          placeholder="Введите ФИО"
          value={formData.fio}
          onChange={handleFormChange}
        />
      </div>

      {/* Passport Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Паспорт
        </label>
        <div className="flex gap-2 w-full">
          <CustomInput
            ref={passportFileRef}
            onChange={handleFormChange}
            className="w-full"
            placeholder="Загрузить"
            name="passport"
            type="file"
            required={false}
            divClassname="w-full"
          />
          {formData.passport && (
            <button
              type="button"
              onClick={clearPassportFile}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm whitespace-nowrap"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
          {formData.passport && (
            <button
              type="button"
              onClick={() => setShowPassportModal(true)}
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm whitespace-nowrap"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Discount Input */}
      {!hasRole(user, "Turagent") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Скидка
          </label>
          <CustomInput
            required={false}
            onChange={handleDiscountChange}
            className="w-full"
            placeholder="Скидка"
            name="discount"
            type="number"
            value={formData.discount}
          />
        </div>
      )}
    </div>
  );
}

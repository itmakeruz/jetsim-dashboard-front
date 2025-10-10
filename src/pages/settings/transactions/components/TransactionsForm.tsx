import CustomInput from "@/components/formElements/CustomInput";
import CustomSelect from "@/components/formElements/CustomSelect";
import MaskedPhoneInput from "@/components/formElements/MaskedPhoneInput";

function TransactionsForm({
  onChange,
  formData,
  required,
  selectedData,
  isError,
  setIsError,
  categories,
}) {
  return (
    <>
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="ФИО"
        placeholder="ФИО"
        name={"fullName"}
        value={formData?.fullName ?? selectedData?.fullName ?? ""}
        required={required}
      />
      <MaskedPhoneInput
        name="additionalPhone"
        label="Телефон"
        value={formData?.phoneNumber ?? selectedData?.phoneNumber ?? ""}
        onChange={onChange}
        className="max-w-[410px]"
        required={required}
      />
      <CustomSelect
        name={"status"}
        label={"Статус"}
        setIsError={setIsError}
        isError={isError}
        value={formData?.status ?? selectedData?.status?.id ?? ""}
        onChange={onChange}
        required
        options={categories}
        placeholder="Выбрать файл"
        className="border max-w-[410px] !text-[#929292] border-gray-300 bg-white rounded grow"
      />
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="Паспорт"
        placeholder="Паспорт"
        name={"passport"}
        type="file"
        value={formData?.passport ?? selectedData?.passport ?? ""}
        required={required}
      />
      <CustomSelect
        name={"role"}
        label={"Роль"}
        setIsError={setIsError}
        isError={isError}
        value={formData?.role ?? selectedData?.role?.id ?? ""}
        onChange={onChange}
        required
        options={categories}
        placeholder="Выбрать файл"
        className="border max-w-[410px] !text-[#929292] border-gray-300 bg-white rounded grow"
      />
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="Пароль"
        placeholder="Пароль"
        name={"password"}
        value={formData?.password ?? selectedData?.password ?? ""}
        required={required}
      />
    </>
  );
}

export default TransactionsForm;

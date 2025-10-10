import CustomInput from "@/components/formElements/CustomInput";
import CustomSelect from "@/components/formElements/CustomSelect";
import { languageOptions } from "@/constants/languagesOptions";

function FaqForm({
  onChange,
  formData,
  required,
  selectedData,
  isError,
  setIsError,
}) {
  return (
    <>
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="Вопрос"
        placeholder="Вопрос"
        name={"question"}
        value={formData?.question ?? selectedData?.question ?? ""}
        required={required}
      />
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="Ответ"
        placeholder="Ответ"
        name="answer"
        type="textarea"
        value={formData?.answer ?? selectedData?.answer ?? ""}
        required={required}
      />
      <CustomSelect
        name={"lang"}
        label={"Язык"}
        setIsError={setIsError}
        isError={isError}
        value={formData?.lang ?? selectedData?.lang ?? ""}
        onChange={onChange}
        required
        options={languageOptions}
        placeholder="Выбрать язык"
        className="border max-w-[410px] !text-[#929292] border-gray-300 bg-white rounded grow"
      />
    </>
  );
}

export default FaqForm;

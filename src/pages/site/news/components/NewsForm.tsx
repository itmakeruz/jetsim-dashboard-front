import CustomInput from "@/components/formElements/CustomInput";
import CustomSelect from "@/components/formElements/CustomSelect";
import { languageOptions } from "@/constants/languagesOptions";

function NewsForm({
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
        label="Название"
        placeholder="Название"
        name={"title"}
        value={formData?.title ?? selectedData?.title ?? ""}
        required={required}
      />
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="Изображение"
        placeholder="Изображение"
        name={"photo"}
        type="file"
        // value={formData?.photo ?? selectedData?.photo ?? ""}
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
        placeholder="Выбрать файл"
        className="border max-w-[410px] !text-[#929292] border-gray-300 bg-white rounded grow"
      />
      <CustomInput
        onChange={onChange}
        className="max-w-[410px]"
        label="Описание"
        placeholder="Описание"
        name="description"
        type="textarea"
        value={formData?.description ?? selectedData?.description ?? ""}
        required={required}
      />
    </>
  );
}

export default NewsForm;

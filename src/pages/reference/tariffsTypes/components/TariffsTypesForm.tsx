import CustomInput from "@/components/formElements/CustomInput";
import CustomSelect from "@/components/formElements/CustomSelect";
import { handleChange } from "@/utils/handleChange";
import { statusOptions } from "@/constants/StaticOptions";

interface TariffsTypesFormProps {
  formData: any;
  setFormData: any;
  editData: any;
}

function TariffsTypesForm({
  formData,
  setFormData,
  editData,
}: TariffsTypesFormProps) {
  return (
    <>
      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (RU)"
        placeholder="Название на русском"
        name="name_ru"
        value={formData?.name_ru ?? ""}
        required
      />

      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (EN)"
        placeholder="Название на английском"
        name="name_en"
        value={formData?.name_en ?? ""}
        required
      />

      <CustomSelect
        onChange={handleChange(setFormData)}
        className="max-w-[320px] w-full"
        label="Статус"
        placeholder="Статус"
        name="status"
        value={formData?.status ?? ""}
        options={statusOptions}
      />
    </>
  );
}

export default TariffsTypesForm;

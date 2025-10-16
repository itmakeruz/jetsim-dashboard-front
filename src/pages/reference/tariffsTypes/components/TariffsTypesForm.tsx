import CustomInput from "@/components/formElements/CustomInput";
import { handleChange } from "@/utils/handleChange";

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
        value={formData?.name_ru ?? editData?.name_ru ?? ""}
        required
      />

      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (EN)"
        placeholder="Название на английском"
        name="name_en"
        value={formData?.name_en ?? editData?.name_en ?? ""}
        required
      />
    </>
  );
}

export default TariffsTypesForm;

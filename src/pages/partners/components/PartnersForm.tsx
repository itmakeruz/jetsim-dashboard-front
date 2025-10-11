import CustomInput from "@/components/formElements/CustomInput";
import CustomLabel from "@/components/formElements/CustomLabel";
import CustomSelect from "@/components/formElements/CustomSelect";

interface PartnersFormProps {
  formData: any;
  setFormData: (data: any) => void;
  editData?: any;
}

const statusOptions = [
  { id: "ACTIVE", name: "Активный" },
  { id: "INACTIVE", name: "Неактивный" },
];

function PartnersForm({ formData, setFormData, editData }: PartnersFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <CustomLabel>Название (RU)</CustomLabel>
        <CustomInput
          value={formData.name_ru}
          onChange={(e) =>
            setFormData({ ...formData, name_ru: e.target.value })
          }
          placeholder="Название на русском"
        />
      </div>
      <div>
        <CustomLabel>Название (EN)</CustomLabel>
        <CustomInput
          value={formData.name_en}
          onChange={(e) =>
            setFormData({ ...formData, name_en: e.target.value })
          }
          placeholder="Название на английском"
        />
      </div>
      <div>
        <CustomLabel>Описание (RU)</CustomLabel>
        <textarea
          className="w-full border rounded p-2"
          value={formData.description_ru}
          onChange={(e) =>
            setFormData({ ...formData, description_ru: e.target.value })
          }
          placeholder="Описание на русском"
          rows={3}
        />
      </div>
      <div>
        <CustomLabel>Описание (EN)</CustomLabel>
        <textarea
          className="w-full border rounded p-2"
          value={formData.description_en}
          onChange={(e) =>
            setFormData({ ...formData, description_en: e.target.value })
          }
          placeholder="Описание на английском"
          rows={3}
        />
      </div>
      <div>
        <CustomLabel>Идентификационный номер</CustomLabel>
        <CustomInput
          type="number"
          value={formData.identified_number}
          onChange={(e) =>
            setFormData({
              ...formData,
              identified_number: Number(e.target.value),
            })
          }
        />
      </div>
      <div>
        <CustomLabel>Статус</CustomLabel>
        <CustomSelect
          value={formData.status}
          options={statusOptions}
          placeholder="Выберите статус"
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          name="status"
        />
      </div>
    </div>
  );
}

export default PartnersForm;

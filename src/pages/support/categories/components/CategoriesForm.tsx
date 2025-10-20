import CustomInput from "@/components/formElements/CustomInput";
import CustomSelect from "@/components/formElements/CustomSelect";

interface CategoriesFormProps {
  editData?: any;
  formData: {
    name: {
      ru: string;
      en: string;
    };
    color: string;
    status: string;
  };
  setFormData: (data: any) => void;
  isEditMode: boolean;
}

const statusOptions = [
  { value: "ACTIVE", label: "Активен" },
  { value: "INACTIVE", label: "Неактивен" },
];

function CategoriesForm({
  editData,
  formData,
  setFormData,
  isEditMode,
}: CategoriesFormProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "name_ru") {
      setFormData({
        ...formData,
        name: {
          ...formData.name,
          ru: value,
        },
      });
    } else if (name === "name_en") {
      setFormData({
        ...formData,
        name: {
          ...formData.name,
          en: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Название (RU)"
            name="name_ru"
            type="text"
            value={formData.name.ru}
            onChange={handleChange}
            placeholder="Введите название на русском"
            required
          />

          <CustomInput
            label="Название (EN)"
            name="name_en"
            type="text"
            value={formData.name.en}
            onChange={handleChange}
            placeholder="Введите название на английском"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Цвет"
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="#FF5733"
            required
          />

          {/* <CustomSelect
            label="Статус"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            placeholder="Выберите статус"
          /> */}
        </div>
      </div>
    </div>
  );
}

export default CategoriesForm;

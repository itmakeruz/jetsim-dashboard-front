import CustomInput from "@/components/formElements/CustomInput";

interface OperatorsFormProps {
  editData?: any;
  formData: {
    login: string;
    password: string;
  };
  setFormData: (data: any) => void;
  isEditMode: boolean;
}

function OperatorsForm({
  editData,
  formData,
  setFormData,
  isEditMode,
}: OperatorsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Логин"
          name="login"
          type="text"
          value={formData.login}
          onChange={handleChange}
          placeholder="Введите логин"
          required
        />

        <CustomInput
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={
            isEditMode ? "Оставьте пустым, чтобы не менять" : "Введите пароль"
          }
          required={!isEditMode}
        />
      </div>

      {isEditMode && (
        <div className="text-sm text-gray-500">
          Примечание: Оставьте поле пароля пустым, если не хотите его изменять
        </div>
      )}
    </div>
  );
}

export default OperatorsForm;

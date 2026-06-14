import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import CustomInput from "@/components/formElements/CustomInput";
import CustomLabel from "@/components/formElements/CustomLabel";
import CustomSelect from "@/components/formElements/CustomSelect";

interface EmployeesFormProps {
  formData: any;
  setFormData: (data: any) => void;
  editData?: any;
}

const statusOptions = [
  { id: "ACTIVE", name: "Активный" },
  { id: "INACTIVE", name: "Неактивный" },
];

const roleOptions = [
  { id: "SUPER_ADMIN", label: "Супер администратор" },
  { id: "ADMIN", label: "Администратор" },
  { id: "ACCOUNTANT", label: "Бухгалтер" },
  { id: "PRE_ACCOUNTANT", label: "Помощник бухгалтера" },
  { id: "AGENT", label: "Агент" },
];

const fieldClassName = "flex flex-col gap-2";

function EmployeesForm({ formData, setFormData, editData }: EmployeesFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = Boolean(editData);

  return (
    <div className="flex flex-col gap-4">
      <div className={fieldClassName}>
        <CustomLabel labelText="Имя" />
        <CustomInput
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Введите имя"
        />
      </div>
      <div className={fieldClassName}>
        <CustomLabel labelText="Логин" />
        <CustomInput
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          placeholder="Введите логин"
        />
      </div>
      <div className={fieldClassName}>
        <CustomLabel labelText="Пароль" />
        <div className="relative">
          <CustomInput
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Введите пароль"
            required={!isEditMode}
            divClassname=""
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            title={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className={fieldClassName}>
        <CustomLabel labelText="Роль" />
        <CustomSelect
          value={formData.role}
          options={roleOptions}
          placeholder="Выберите роль"
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          name="role"
        />
      </div>

      <div className={fieldClassName}>
        <CustomLabel labelText="Статус" />
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

export default EmployeesForm;

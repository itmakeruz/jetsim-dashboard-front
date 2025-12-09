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

function EmployeesForm({ formData, setFormData }: EmployeesFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <CustomLabel labelText="Имя" />
        <CustomInput
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Введите имя"
        />
      </div>
      <div>
        <CustomLabel labelText="Логин" />
        <CustomInput
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          placeholder="Введите логин"
        />
      </div>
      <div>
        <CustomLabel labelText="Пароль" />
        <div className="relative">
          <CustomInput
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Введите пароль"
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

      <div>
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

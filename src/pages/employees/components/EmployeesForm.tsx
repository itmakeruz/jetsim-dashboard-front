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
        <CustomInput
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Введите пароль"
        />
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

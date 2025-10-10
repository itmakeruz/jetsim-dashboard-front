import CustomInput from "@/components/formElements/CustomInput";
import CustomLabel from "@/components/formElements/CustomLabel";

interface UsersFormProps {
  formData: any;
  setFormData: (data: any) => void;
  editData?: any;
}

function UsersForm({ formData, setFormData, editData }: UsersFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <CustomLabel>Имя</CustomLabel>
        <CustomInput
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Введите имя"
        />
      </div>
      <div>
        <CustomLabel>Email</CustomLabel>
        <CustomInput
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@example.com"
        />
      </div>
      <div>
        <CustomLabel>Телефон</CustomLabel>
        <CustomInput
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+998901234567"
        />
      </div>
      <div>
        <CustomLabel>Роль</CustomLabel>
        <select
          className="w-full border rounded p-2"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="Admin">Администратор</option>
          <option value="Manager">Менеджер</option>
          <option value="Operator">Оператор</option>
        </select>
      </div>
      <div>
        <CustomLabel>Статус</CustomLabel>
        <select
          className="w-full border rounded p-2"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="ACTIVE">Активный</option>
          <option value="INACTIVE">Неактивный</option>
        </select>
      </div>
    </div>
  );
}

export default UsersForm;

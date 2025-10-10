// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import CustomInput from "@/components/formElements/CustomInput";
import UniversalBtn from "@/components/buttons/UniversalBtn";
import { handleChange } from "@/utils/handleChange";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(form);
    console.log(result);

    if (result.success) {
      toast.success("Вход выполнен успешно!");
      navigate("/");
    } else {
      toast.error(result.error || "Ошибка входа!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Вход</h2>

        <CustomInput
          type="text"
          name="login"
          placeholder="login"
          value={form.login}
          onChange={handleChange(setForm)}
          required
          className="max-w-[320px]"
        />
        <CustomInput
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange(setForm)}
          required
          className="max-w-[320px]"
        />
        <UniversalBtn
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 !bg-blue-600 rounded justify-center hover:!bg-blue-700 disabled:!bg-blue-300"
        >
          {isLoading ? "Загрузка..." : "Войти"}
        </UniversalBtn>
      </form>
    </div>
  );
}

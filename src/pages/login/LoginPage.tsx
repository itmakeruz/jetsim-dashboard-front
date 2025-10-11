// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import CustomInput from "@/components/formElements/CustomInput";
import UniversalBtn from "@/components/buttons/UniversalBtn";
import { handleChange } from "@/utils/handleChange";
import Loader from "@/components/Loader";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, token, getProfile, logout } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  useEffect(() => {
    const checkExistingAuth = async () => {
      if (token) {
        try {
          const result = await getProfile();
          if (result.success) {
            navigate("/", { replace: true });
            return;
          } else {
            logout()
            toast.error(result.message);
          }
        } catch (error) {
          console.log("Token invalid:", error);
        }
      }
      setIsCheckingAuth(false);
    };

    checkExistingAuth();
  }, [token, getProfile, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await login(form);
    if (result.success) {
      toast.success(result.message);
      navigate("/");
    } else {
      toast.error(result.message || "Ошибка входа!");
    }
  };

  if (isCheckingAuth) {
    return <Loader isFullScreen />;
  }

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
          placeholder="Username"
          value={form.login}
          onChange={handleChange(setForm)}
          required
          className="max-w-[320px]"
        />
        <CustomInput
          type="password"
          name="password"
          placeholder="Password"
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

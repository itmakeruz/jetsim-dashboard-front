import { useApi } from "./useApi";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const loginStore = useAuthStore((s) => s.login);

  return useApi({
    endpoint: "/auth/login",
    method: "POST",
    successMessage: "Muvaffaqiyatli tizimga kirdingiz!",
    errorMessage: "Login xatolik bilan bajarildi!",
    onSuccess: (data) => {
      loginStore(data.token);
    },
  });
};

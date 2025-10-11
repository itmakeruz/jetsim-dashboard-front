import { create } from "zustand";
import { authAPI } from "../lib/api";

// --- Types ---
interface User {
  id: number;
  name: string;
  login: string;
  status: string;
  created_at: string;
  role: string;
}

interface LoginCredentials {
  login: string;
  password: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  getProfile: () => Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }>;
  setToken: (token: string) => void;
}

// --- Store ---
export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: null,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      const { access_token } = response.data.data;
      localStorage.setItem("token", access_token);
      set({ token: access_token });

      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ token: null, user: null });
    localStorage.removeItem("token");
  },

  getProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      const user = response.data.data as User;
      set({
        user: user,
        isLoading: false,
      });
      return {
        success: response.data.success,
        user,
        message: response.data.message,
      };
    } catch (error: any) {
      set({ isLoading: false });
      return {
        success: error.response?.data?.success,
        message: error.response?.data?.message || "Failed to get profile",
      };
    }
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
}));

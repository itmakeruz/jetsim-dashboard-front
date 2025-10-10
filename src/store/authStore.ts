import { create } from "zustand";
import { authAPI } from "../lib/api";

// --- Types ---
interface RolePivot {
  model_id: number;
  role_id: number;
  model_type: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: RolePivot;
}

interface BranchPivot {
  user_id: number;
  branch_id: number;
  is_primary: number;
  created_at: string;
  updated_at: string;
}

interface Branch {
  id: number;
  name: string;
  responsible_person: string;
  phone: string;
  additional_phone: string;
  address: string;
  location: string;
  area: number;
  created_at: string;
  updated_at: string;
  pivot: BranchPivot;
}

interface Agent {
  id: number;
  name: string;
  balance: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  agent_id: number;
  name: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string;
  phone_verified_at: string | null;
  is_active: boolean;
  roles: Role[];
  permissions: any[];
  branches: Branch[];
  agent: Agent;
  branch_id?: number;
}

interface LoginCredentials {
  login: string;
  password: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  branch_id: string | null;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  getProfile: () => Promise<{ success: boolean; user?: User; error?: string }>;
  setToken: (token: string) => void;
  setSelectedWarehouse: (branchId: string) => void;
  updateUserBranches: (branches: Branch[]) => void;
}

// --- Store ---
export const useAuthStore = create<AuthStore>((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: {
    id: 2,
    agent_id: 5,
    name: "Test Testbekov",
    email_verified_at: null,
    created_at: "2025-07-17T00:14:43.000000Z",
    updated_at: "2025-07-30T07:24:38.000000Z",
    phone: "+998955056969",
    phone_verified_at: null,
    is_active: true,
    roles: [
      {
        id: 3,
        name: "super_admin",
        guard_name: "web",
        created_at: "2025-07-29T15:11:36.000000Z",
        updated_at: "2025-07-29T15:11:36.000000Z",
        pivot: { model_id: 2, role_id: 3, model_type: "App\\Models\\User" },
      },
      {
        id: 9,
        name: "HEAD ADMIN",
        guard_name: "web",
        created_at: "2025-08-07T16:07:49.000000Z",
        updated_at: "2025-08-07T16:07:49.000000Z",
        pivot: { model_id: 2, role_id: 9, model_type: "App\\Models\\User" },
      },
    ],
    permissions: [],
    branches: [
      {
        id: 1,
        name: "CENTRAL",
        responsible_person: "SARDOR ATAMIRZAEV",
        phone: "+998 99 865 65 70",
        additional_phone: "+998 20 010 51 15",
        address:
          "Toshkent shahar, Sergeli tumani, Qum-Ariq MFY, Qum-Ariq ko'chasi, 13-uy, Islom Karimov nomidagi Toshkent aeroporti",
        location: "41.2595981,69.279151",
        area: 37,
        created_at: "2025-06-04T06:20:23.000000Z",
        updated_at: "2025-07-21T12:52:17.000000Z",
        pivot: {
          user_id: 2,
          branch_id: 1,
          is_primary: 1,
          created_at: "2025-10-03T05:42:18.000000Z",
          updated_at: "2025-10-04T07:14:43.000000Z",
        },
      },
      {
        id: 10,
        name: "AIRPORT SAMARKAND",
        responsible_person: "SHAVKATOV SHERZOD",
        phone: "+998 99 891 52 78",
        additional_phone: "+998 __ ___ __ __",
        address:
          "\u0421\u0410\u041c\u0410\u0420\u049a\u0410\u041d\u0414 \u0412\u0418\u041b\u041e\u042f\u0422\u0418, \u0421\u0410\u041c\u0410\u0420\u049a\u0410\u041d\u0414 \u0428\u0410\u04b2\u0410\u0420, YUKSALISH, \u0443\u043b. \u0418\u0431\u043d \u0421\u0438\u043d\u043e, \u0434\u043e\u043c 1",
        location: "39.6827017,66.860817",
        area: 12,
        created_at: "2025-06-11T20:59:26.000000Z",
        updated_at: "2025-07-21T12:54:50.000000Z",
        pivot: {
          user_id: 2,
          branch_id: 10,
          is_primary: 0,
          created_at: "2025-10-03T05:42:18.000000Z",
          updated_at: "2025-10-04T07:14:43.000000Z",
        },
      },
      {
        id: 13,
        name: "HEAD OFFICE",
        responsible_person: "asd",
        phone: "+998 22 222 22 22",
        additional_phone: "+998 22 222 22 22",
        address: "Sharof Rashidov",
        location: "40.216189624310594, 67.9139142812531",
        area: 22,
        created_at: "2025-07-13T20:26:55.000000Z",
        updated_at: "2025-07-23T15:27:48.000000Z",
        pivot: {
          user_id: 2,
          branch_id: 13,
          is_primary: 0,
          created_at: "2025-10-03T05:42:18.000000Z",
          updated_at: "2025-10-04T07:14:43.000000Z",
        },
      },
      {
        id: 14,
        name: "\u0422\u0443\u0440\u0430\u0433\u0435\u043d\u0442",
        responsible_person: "Asadulla Ziedullayev",
        phone: "+998213213123",
        additional_phone: "+998123213213",
        address: "123213213",
        location: "213213",
        area: 21321,
        created_at: "2025-08-21T20:45:51.000000Z",
        updated_at: "2025-08-21T20:45:51.000000Z",
        pivot: {
          user_id: 2,
          branch_id: 14,
          is_primary: 0,
          created_at: "2025-10-03T05:42:18.000000Z",
          updated_at: "2025-10-04T07:14:43.000000Z",
        },
      },
    ],
    agent: {
      id: 5,
      name: "123123123123",
      balance: "41288.50",
      phone: "+998 99 833 22 23",
      status: "active",
      created_at: "2025-07-13T20:19:08.000000Z",
      updated_at: "2025-10-03T05:38:48.000000Z",
    },
  },
  isLoading: false,
  branch_id: localStorage.getItem("selectedWarehouse") || null,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      console.log(response);

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      if (user.branches && user.branches.length > 0) {
        const primaryBranch =
          user.branches.find(
            (branch: Branch) => branch.pivot?.is_primary === 1
          ) || user.branches[0];
        const branchId = primaryBranch.id.toString();
        localStorage.setItem("selectedWarehouse", branchId);
        set({ token, user, isLoading: false, branch_id: branchId });
      } else {
        const branchId = user.branch_id?.toString() || null;
        localStorage.setItem("selectedWarehouse", branchId || "");
        set({ token, user, isLoading: false, branch_id: branchId });
      }

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("selectedWarehouse");
      set({ token: null, user: null, branch_id: null });
    }
  },

  getProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      const user = response.data.user as User;

      if (user.branches && user.branches.length > 0) {
        const primaryBranch =
          user.branches.find(
            (branch: Branch) => branch.pivot?.is_primary === 1
          ) || user.branches[0];
        const branchId = primaryBranch.id.toString();
        localStorage.setItem("selectedWarehouse", branchId);
        set({ user, isLoading: false, branch_id: branchId });
      } else {
        const branchId = user.branch_id?.toString() || null;
        localStorage.setItem("selectedWarehouse", branchId || "");
        set({ user, isLoading: false, branch_id: branchId });
      }

      return { success: true, user };
    } catch (error: any) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get profile",
      };
    }
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setSelectedWarehouse: (branchId) => {
    localStorage.setItem("selectedWarehouse", branchId);
    set({ branch_id: branchId });
  },

  updateUserBranches: (branches) => {
    set((state) => ({
      user: state.user ? { ...state.user, branches } : null,
    }));
  },
}));

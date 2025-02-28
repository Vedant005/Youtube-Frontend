import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import apiClient from "../utils/axiosInterceptors";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: string;
  createdAt: string;
  updatedAt: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  fetchCurrentUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => {
      if (typeof window !== "undefined") {
        window.addEventListener("forceLogout", async () => {
          await get().logout();
          toast.error("Session expired. Please log in again.");
        });
      }

      return {
        user: null,
        loading: false,
        error: null,

        login: async (credentials) => {
          set({ loading: true, error: null });
          try {
            const response = await apiClient.post("/users/login", credentials);
            set({
              user: response.data.data.user,
              loading: false,
            });
            toast.success("Login successful!");
          } catch (error: any) {
            set({
              error: error.response?.data?.message || error.message,
              loading: false,
            });
            toast.error(error.response?.data?.message || "Login failed");
            throw error;
          }
        },

        logout: async () => {
          set({ loading: true, error: null });
          try {
            await apiClient.post("/users/logout", {});

            toast.success("Logged out successfully");
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            set({ user: null, loading: false, error: null });
            localStorage.removeItem("user-store");
          }
        },

        refreshAccessToken: async () => {
          try {
            await apiClient.post(
              "/users/refresh-token",
              {},
              { withCredentials: true }
            );
            console.log("Access token refreshed successfully");
            return true;
          } catch (error) {
            set({ user: null, error: "Session expired. Please login again." });
            return false;
          }
        },

        fetchCurrentUser: async () => {
          const currentUser = get().user;
          if (!currentUser) return;

          set({ loading: true, error: null });
          try {
            const response = await apiClient.get("/users/current-user");
            set({ user: response.data.data, loading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || error.message,
              loading: false,
            });
          }
        },

        isAuthenticated: () => {
          return !!get().user;
        },
      };
    },
    {
      name: "user-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUserStore;

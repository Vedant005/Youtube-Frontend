import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import apiClient from "../utils/axiosInterceptors";
import { error } from "console";

// interface VideoStore {
//   video: string | null;
// }

const useVideoStore = create((set, get) => ({
  videos: [],
  singleVideo: {},
  loading: true,
  error: null,

  fetchAllVideos: async () => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get("/products/");
      set({ videos: response.data.data, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
}));

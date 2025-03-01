import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../utils/axiosInterceptors";

interface Video {
  _id: string;
  videoFile: { url: string; public_id: string; _id: string };
  thumbnail: { url: string; public_id: string; _id: string };
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SingleVideo {
  _id: string;
  videoFile: { url: string; public_id: string; _id: string };
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: {
    _id: string;
    username: string;
    subscribersCount: number;
    isSubscribed: boolean;
  };
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
}

interface Publish {
  title: string;
  description: string;
  videoFile: File; // ✅ Corrected: Use File type
  thumbnail: File;
}

interface UpdatedData {
  title: string;
  description: string;
}

interface VideoStore {
  videos: Video[];
  singleVideo: SingleVideo | null;
  loading: boolean;
  error: string | null;
  fetchAllVideos: () => Promise<void>;
  publishAVideo: (credentials: Publish) => Promise<void>;
  getVideoById: (videoId: string) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  updateVideo: (videoId: string, updatedData: UpdatedData) => Promise<void>;
  togglePublishStatus: (videoId: string) => Promise<void>;
}

const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      videos: [],
      singleVideo: null,
      loading: false,
      error: null,

      fetchAllVideos: async () => {
        set({ loading: true, error: null });

        try {
          const response = await apiClient.get("/products/");
          set({ videos: response.data.data, loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to fetch videos",
          });
        }
      },

      publishAVideo: async ({ title, description, videoFile, thumbnail }) => {
        set({ loading: true, error: null });

        try {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("videoFile", videoFile);
          formData.append("thumbnail", thumbnail);

          await apiClient.post("/products/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          set({ loading: false, error: null });
        } catch (error: any) {
          set({ loading: false, error: error.message || "Upload failed" });
        }
      },

      getVideoById: async (videoId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.get(`/products/${videoId}`);
          set({ singleVideo: response.data.data, loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to fetch video",
          });
        }
      },

      deleteVideo: async (videoId: string) => {
        set({ loading: true, error: null });
        try {
          await apiClient.delete(`/products/${videoId}`);
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to delete video",
          });
        }
      },

      updateVideo: async (videoId: string, updatedData: UpdatedData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.patch(
            `/products/${videoId}`,
            updatedData
          );
          set({ singleVideo: response.data.data, loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to update video",
          });
        }
      },

      togglePublishStatus: async (videoId: string) => {
        set({ loading: true, error: null });
        try {
          await apiClient.patch(`/toggle/publish/${videoId}`);
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to update status",
          });
        }
      },
    }),
    {
      name: "video-store",
      partialize: (state) => ({
        videos: state.videos,
        singleVideo: state.singleVideo,
      }),
    }
  )
);

export default useVideoStore;

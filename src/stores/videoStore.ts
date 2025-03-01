import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import apiClient from "../utils/axiosInterceptors";

interface Video {
  _id: string;

  videoFile: {
    url: string;
    public_id: string;
    _id: string;
  };

  thumbnail: {
    url: string;
    public_id: string;
    _id: string;
  };
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

  videoFile: {
    url: string;
    public_id: string;
    _id: string;
  };
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

interface Publish{
 title
}

interface VideoStore {
  videos: Video | null;
  singleVideo: SingleVideo | null;
  loading: boolean;
  error: string | null;
  fetchAllVideos: () => Promise<void>;
  publishAVideo:
}

const useVideoStore = create(
  persist((set, get) => ({
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

    publishAVideo: async () => {
      set({ loading: true, error: null });

      try {
        const response = await apiClient.post("/products/",video,);
        set({ loading: false, error: null });
      } catch (error) {
        set({ loading: false, error: error });
      }
    },

    getVideoById: async (videoId) => {
      set({ loading: true, error: null });
      try {
        const response = await apiClient.get(`/products/${videoId}`);
        set({ singleVideo: response.data.data, loading: false, error: null });
      } catch (error) {
        set({ loading: false, error: error });
      }
    },

    deleteVideo: async (videoId) => {
      set({ loading: true, error: null });
      try {
        const response = await apiClient.delete(`/products/${videoId}`);
        set({ loading: false, error: null });
      } catch (error) {
        set({ loading: false, error: error });
      }
    },

    updateVideo: async (videoId, updatedData) => {
      set({ loading: true, error: null });
      try {
        const response = await apiClient.patch(
          `/products/${videoId}`,
          updatedData
        );
        set({ singleVideo: response.data.data, loading: false, error: null });
      } catch (error) {
        set({ loading: false, error: error });
      }
    },

    togglePublishStatus: async (videoId) => {
      set({ loading: true, error: null });
      try {
        const response = await apiClient.patch(`/toggle/publish/${videoId}`);
        set({ loading: false, error: null });
      } catch (error) {
        set({ loading: false, error: error });
      }
    },
  }))
);

export default useVideoStore;

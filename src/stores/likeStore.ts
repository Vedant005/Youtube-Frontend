import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../utils/axiosInterceptors";

// interface LikedVideos {
//   _id: string;
//   videoUrl:string;
//   thumbnailUrl:string;
//   owner
// }

interface LikeStore {
  loading: boolean;
  error: string | null;
  toggleVideoLike: (videoId: string) => Promise<void>;
  toggleCommentLike: (commentId: string) => Promise<void>;
  toggleTweetLike: (tweetId: string) => Promise<void>;
  getLikedVideos: () => Promise<void>;
}

const useLikeStore = create<LikeStore>()(
  persist(
    (set) => ({
      loading: false,
      error: null,

      toggleVideoLike: async (videoId) => {
        set({ loading: true, error: null });

        try {
          await apiClient.post(`/likes/toggle/v/${videoId}`);
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message,
          });
        }
      },
      toggleCommentLike: async (commentId) => {
        set({ loading: true, error: null });

        try {
          await apiClient.post(`/likes/toggle/c/${commentId}`);
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message,
          });
        }
      },
      toggleTweetLike: async (tweetId) => {
        set({ loading: true, error: null });

        try {
          await apiClient.post(`/likes/toggle/t/${tweetId}`);
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message,
          });
        }
      },
      getLikedVideos: async () => {
        set({ loading: true, error: null });

        try {
          const response = await apiClient.get("/videos");
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message,
          });
        }
      },
    }),
    {
      name: "like-store",
    }
  )
);

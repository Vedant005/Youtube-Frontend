import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../utils/axiosInterceptors";

interface Tweet {
  _id: string;
  content: string;
  createdAt: string;
  ownerDetails: {
    _id: string;
    username: string;
  };
  likesCount: number;
  isLiked: boolean;
}

interface Update {
  content: string;
  tweetId: string;
}

interface TweetStore {
  tweets: Tweet[];
  loading: boolean;
  error: string | null;
  getUserTweets: () => Promise<void>;
  createTweet: (content: string) => Promise<void>;
  updateTweet: (credentials: Update) => Promise<void>;
  deleteTweet: (tweetId: string) => Promise<void>;
}

const useTweetStore = create<TweetStore>()(
  persist(
    (set) => ({
      tweets: [],
      loading: false,
      error: null,

      getUserTweets: async () => {
        set({ loading: true, error: null });

        try {
          const response = await apiClient.get("/tweets/user");
          set({ tweets: response.data.data, loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to fetch tweets",
          });
        }
      },
      createTweet: async (content) => {
        set({ loading: true, error: null });

        try {
          const response = await apiClient.post("/tweets/", { content });
          set({ loading: false });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to fetch tweets",
          });
        }
      },

      updateTweet: async (credentials) => {
        set({ loading: true, error: null });

        try {
          const response = await apiClient.patch("/tweets/", { credentials });
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to fetch tweets",
          });
        }
      },

      deleteTweet: async (tweetId) => {
        set({ loading: true, error: null });

        try {
          await apiClient.delete(`/tweets/${tweetId}`);
          set({ loading: false, error: null });
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Failed to fetch tweets",
          });
        }
      },
    }),
    {
      name: "tweet-store",
      partialize: (state) => ({
        tweets: state.tweets,
      }),
    }
  )
);

export default useTweetStore;

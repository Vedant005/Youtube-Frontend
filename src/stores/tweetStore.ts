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

interface TweetStore {
  tweets: Tweet[];
  loading: boolean;
  error: string | null;
  getUserTweets: () => Promise<void>;
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

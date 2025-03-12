import { create } from "zustand";
import axios from "axios";

interface Video {
  _id: string;
  videoFile: { url: string };
  thumbnail: { url: string };
  title: string;
  description: string;
  createdAt: { year: number; month: number; day: number };
  isPublished: boolean;
  likesCount: number;
}

interface ChannelStats {
  totalSubscribers: number;
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
}

interface DashboardStore {
  stats: ChannelStats | null;
  videos: Video[];
  loading: boolean;
  fetchStats: () => Promise<void>;
  fetchVideos: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  videos: [],
  loading: false,

  fetchStats: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/api/dashboard/stats");
      set({ stats: data.data, loading: false });
    } catch (error) {
      console.error("Error fetching stats:", error);
      set({ loading: false });
    }
  },

  fetchVideos: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/api/dashboard/videos");
      set({ videos: data.data, loading: false });
    } catch (error) {
      console.error("Error fetching videos:", error);
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import axios from "axios";

interface Channel {
  _id: string;
  username: string;
  fullName: string;
  avatar: { url: string };
  latestVideo?: {
    _id: string;
    videoFile: { url: string };
    thumbnail: { url: string };
    title: string;
    description: string;
    duration: number;
    createdAt: string;
    views: number;
  };
}

interface Subscriber {
  _id: string;
  username: string;
  fullName: string;
  avatar: { url: string };
  subscriberCount: number;
}

interface SubscriptionStore {
  subscribedChannels: Channel[];
  channelSubscribers: Subscriber[];
  loading: boolean;
  fetchSubscribedChannels: () => Promise<void>;
  fetchUserSubscribers: () => Promise<void>;
  toggleSubscription: (channelId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscribedChannels: [],
  channelSubscribers: [],
  loading: false,

  fetchSubscribedChannels: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/subscription/c");
      set({ subscribedChannels: res.data.data });
    } catch (error) {
      console.error("Error fetching subscribed channels:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserSubscribers: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/subscription/u");
      set({ channelSubscribers: res.data.data });
    } catch (error) {
      console.error("Error fetching channel subscribers:", error);
    } finally {
      set({ loading: false });
    }
  },

  toggleSubscription: async (channelId: string) => {
    set({ loading: true });
    try {
      await axios.post(`/api/subscription/c/${channelId}`);
      await useSubscriptionStore.getState().fetchSubscribedChannels();
    } catch (error) {
      console.error("Error toggling subscription:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from "zustand";
import axios from "axios";

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  createdAt: string;
  videoFile: { url: string };
  thumbnail: { url: string };
}

interface Playlist {
  _id: string;
  name: string;
  description: string;
  totalVideos: number;
  totalViews: number;
  updatedAt: string;
  videos: Video[];
}

interface PlaylistStore {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;

  fetchUserPlaylists: (userId: string) => Promise<void>;
  createPlaylist: (name: string, description: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addVideoToPlaylist: (videoId: string, playlistId: string) => Promise<void>;
  removeVideoFromPlaylist: (
    videoId: string,
    playlistId: string
  ) => Promise<void>;
}

// Create Zustand Store
const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  loading: false,
  error: null,

  // Fetch all playlists for a user
  fetchUserPlaylists: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get<{ data: Playlist[] }>(
        `/playlist/user/${userId}`
      );
      set({ playlists: response.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch playlists",
        loading: false,
      });
    }
  },

  // Create a new playlist
  createPlaylist: async (name: string, description: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post<{ data: Playlist }>("/playlist", {
        name,
        description,
      });
      set((state) => ({
        playlists: [...state.playlists, response.data.data],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create playlist",
        loading: false,
      });
    }
  },

  // Delete a playlist
  deletePlaylist: async (playlistId: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/playlist/${playlistId}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p._id !== playlistId),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete playlist",
        loading: false,
      });
    }
  },

  // Add video to playlist
  addVideoToPlaylist: async (videoId: string, playlistId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch<{ data: Playlist }>(
        `/playlist/add/${videoId}/${playlistId}`
      );
      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist._id === playlistId ? response.data.data : playlist
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to add video",
        loading: false,
      });
    }
  },

  // Remove video from playlist
  removeVideoFromPlaylist: async (videoId: string, playlistId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch<{ data: Playlist }>(
        `/playlist/remove/${videoId}/${playlistId}`
      );
      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist._id === playlistId ? response.data.data : playlist
        ),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to remove video",
        loading: false,
      });
    }
  },
}));

export default usePlaylistStore;

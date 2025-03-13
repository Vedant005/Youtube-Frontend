import { create } from "zustand";
import axios from "axios";

interface Comment {
  _id: string;
  content: string;
  owner: {
    username: string;
    fullName: string;
    avatar: string;
  };
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
}

interface CommentStore {
  comments: Comment[];
  totalDocs: number;
  loading: boolean;
  fetchComments: (videoId: string) => Promise<void>;
  addComment: (videoId: string, content: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  totalDocs: 0,
  loading: false,

  fetchComments: async (videoId) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`/api/comments/${videoId}`);
      set({
        comments: data.data.docs,
        totalDocs: data.data.totalDocs,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      set({ loading: false });
    }
  },

  addComment: async (videoId, content) => {
    try {
      const { data } = await axios.post(`/api/comments/${videoId}`, {
        content,
      });
      set((state) => ({ comments: [data.data.docs, ...state.comments] }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  },

  updateComment: async (commentId, content) => {
    try {
      const { data } = await axios.patch(`/api/comments/c/${commentId}`, {
        content,
      });
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: data.data.docs.content }
            : comment
        ),
      }));
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  },

  deleteComment: async (commentId) => {
    try {
      await axios.delete(`/api/comments/c/${commentId}`);
      set((state) => ({
        comments: state.comments.filter((comment) => comment._id !== commentId),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  },
}));

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
}

// const useTweetStore= create<TweetStore>()(
//     persist(
//         (set)=>({
//             tweets:[],
//             loading:false,
//             error:null;

//             getUserTweets:async(user)=>{

//             }
//         }
//     )
//     )
// )

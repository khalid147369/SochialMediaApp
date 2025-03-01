import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import postsReducer from "../features/postsSlice";
import MypostsReducer from "../features/myPostsSlice";
import FavoritesReducer from "../features/favoritesSlice";
import FriendsReducer from "../features/friendsSlice";
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    user: userReducer,
    favorites: FavoritesReducer,
    myPosts: MypostsReducer,
    friends: FriendsReducer,
  },
});

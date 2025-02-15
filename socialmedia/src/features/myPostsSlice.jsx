import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { backendUrl } from "../config";



const deletePosts = createAsyncThunk(
  "myPosts/deletePosts",
  async (postId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch(`${backendUrl}/api/Posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return postId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const myPostsSlice = createSlice({
  name: "myPosts",
  initialState: { myPosts: [],pageNumber:2, loading: false, errors: [] },
  reducers: {},
  extraReducers: (builder) => {

    //delete posts
    builder.addCase(deletePosts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deletePosts.fulfilled, (state, action) => {
      state.loading = false;
      state.myPosts = state.myPosts.filter(post => post.id !== action.payload);
    });
    builder.addCase(deletePosts.rejected, (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    });
  },
});

export {  deletePosts };
export default myPostsSlice.reducer;

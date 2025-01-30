import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { backendUrl } from "../config";

const getMyPosts = createAsyncThunk(
  "myPosts/getMyPosts",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const cookie = new Cookies();
    const token = cookie.get('token'); // Assuming you have an auth slice with a token

    try {
      const response = await fetch(`${backendUrl}/api/Posts/userPosts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
  initialState: { myPosts: [], loading: false, errors: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMyPosts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMyPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.myPosts = action.payload;
    });
    builder.addCase(getMyPosts.rejected, (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    });
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

export { getMyPosts, deletePosts };
export default myPostsSlice.reducer;

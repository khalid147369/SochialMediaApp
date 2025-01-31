import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import { backendUrl } from "../config";

const getallPosts = createAsyncThunk(
  "posts/getallPosts",
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const response = await fetch(`${backendUrl}/api/Posts`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sendPost = createAsyncThunk(
  "posts/sendPost",
  async ({  description, image }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const cookie = new Cookies()
      const token = cookie.get("token");
      const formData = new FormData();
      formData.append("Description", description);
      formData.append("imagePost", image);

      const response = await fetch(`${backendUrl}/api/Posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: false, errors: [] },
  reducers: {
    sendPost: (state, action) => {
      state.posts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getallPosts.pending, (state, action) => {
      state.loading = true;
    }),
      builder.addCase(getallPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      }),
      builder.addCase(getallPosts.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });
      //send Posts
    builder.addCase(sendPost.pending, (state) => {
    });
    builder.addCase(sendPost.fulfilled, (state, action) => {
      state.posts = [...state.posts, action.payload];
    });
    builder.addCase(sendPost.rejected, (state, action) => {
      state.errors = action.payload;
    });
  },
});

export { getallPosts, sendPost };
export const { sendPost: sendPostAction } = postsSlice.actions;
export default postsSlice.reducer;

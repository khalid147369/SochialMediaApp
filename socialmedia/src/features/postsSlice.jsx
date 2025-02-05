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

const getNextallPosts = createAsyncThunk(
  "posts/getNextallPosts",
  async (pageNumber, thunkAPI) => {
  
    const { rejectWithValue ,getState } = thunkAPI;
    console.log(getState().posts.posts.length)
    try {
      const response = await fetch(`${backendUrl}/api/Posts?pageNumber=${pageNumber}&&pageSize=20`);
      if (!response.ok) {
        throw new Error(response.errors);
      }

      return await response.json();
    } catch (error) {

      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: false, errors: [] ,pageNumber:1},
  reducers: {
    sendPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getallPosts.pending, (state, action) => {
      state.loading = true;
    }),
      builder.addCase(getallPosts.fulfilled, (state, action) => {
        state.loading = false;

        state.posts = action.payload.posts;
        state.pageNumber = action.payload.pageNumber;
      }),
      builder.addCase(getallPosts.rejected, (state, action) => {
        state.errors = action.payload;
        state.loading = false;
      });

      builder.addCase(getNextallPosts.pending, (state, action) => {
        state.loading = true;
      }),
        builder.addCase(getNextallPosts.fulfilled, (state, action) => {
          state.loading = false;
          action.payload.posts.forEach((pt) => {
            state.posts.push(pt);
          });
          state.pageNumber = action.payload.pageNumber;
        }),
        builder.addCase(getNextallPosts.rejected, (state, action) => {
          state.errors = action.payload;
          state.loading = false;
        });

  },
});

export { getallPosts ,getNextallPosts };
export const { sendPost: sendPostAction } = postsSlice.actions;
export default postsSlice.reducer;

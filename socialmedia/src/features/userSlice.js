import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import axios from "axios";
import { backendUrl } from "../config";
import { useEffect } from "react";

const initialState = {
  user: [],
  userLoading: false,
  userAuthor: false,
  pageNumber:2,
  author:[],
  error: null,
  refreshFaild:false,
  userPostsLoading:false,
};

const cookie = new Cookies();

const refreshUserAndToken = createAsyncThunk(
  "user/refreshUserAndToken",
  async (thunkAPI) => {
    try {
      console.log("testo");
      const response = await axios.post(
        `${backendUrl}/api/refreshToken`,
        null,
        { withCredentials: true }
      );
      cookie.set("token", response.data.token);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  }
);
export const getNextUserPosts = createAsyncThunk(
  "user/getNextUserPosts",
  async (pageNumber, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const cookie = new Cookies();
    const token = cookie.get('token'); // Assuming you have an auth slice with a token

    try {
      const response = await fetch(`${backendUrl}/api/Posts/userPosts?pageNumber=${pageNumber}&&pageSize=10`, {
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
const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, thunkAPI) => {
    const token = cookie.get("token");

    try {
      const response = await axios.get(`${backendUrl}/api/Users/${userId}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user by ID:", error);
      throw error;
    }
  }
);

const submitProfile = createAsyncThunk(
  "user/submitProfile",
  async (profileData, thunkAPI) => {
    const cookie = new Cookies();
    const token = cookie.get("token");
    try {
      const formData = new FormData();
      formData.append("username", profileData.userName);
      formData.append("email", profileData.email);
      formData.append("newPassword", profileData.password);
      formData.append("oldPassword", profileData.oldPassword);
      if (profileData.fileList.length > 0) {
        formData.append("avatar", profileData.fileList[0].originFileObj);
      }

      const response = await axios.put(`${backendUrl}/api/Users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile updated successfully:", response.data);
      return profileData;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRefreshFaild: (state, action) => {
      state.refreshFaild = false;
    },
    clearUser: (state) => {
      state.user = null;
    },
    deleteAuthorPosts: (state ,action)=> {
      state.author.posts = state.author.posts.filter(pt=>pt.id!==action.payload) ;
    },
    addPostToAuthorPosts: (state ,action)=> {
      state.author.posts = [action.payload,...state.author.posts]  ;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserAndToken.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(refreshUserAndToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userLoading = false;


      })
      .addCase(refreshUserAndToken.rejected, (state, action) => {
        state.error = action.error.message;
        state.userLoading = false;
        state.refreshFaild =true;
        
      })
      //Update user
      .addCase(submitProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
      })
      .addCase(submitProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      //get next user posts 
      .addCase(getNextUserPosts.pending, (state) => {
        state.status = "loading";
        state.userPostsLoading = true;
      })
      .addCase(getNextUserPosts.fulfilled, (state, action) => {
        action.payload.posts.forEach(p=>{
        state.author.posts.push(p) ;  
        })
        
        state.pageNumber = action.payload.pageNumber ;
        state.userPostsLoading = false;

      })
      .addCase(getNextUserPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.userPostsLoading = false;

      })
      // get user by id
      .addCase(getUserById.pending, (state) => {
        state.userAuthor = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userAuthor = false;
        state.author = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userAuthor = false;
        state.error = action.error.message;
      });
  },
});

export const { setUser, clearUser ,deleteAuthorPosts ,addPostToAuthorPosts ,setRefreshFaild} = userSlice.actions;
export { refreshUserAndToken, submitProfile, getUserById };
export default userSlice.reducer;

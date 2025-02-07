import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import axios from "axios";
import { backendUrl } from "../config";
import { useEffect } from "react";

const initialState = {
  user: [],
  userLoading: false,
  error: null,
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
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserAndToken.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(refreshUserAndToken.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload;
      })
      .addCase(refreshUserAndToken.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.error.message;
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
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export { refreshUserAndToken, submitProfile };
export default userSlice.reducer;

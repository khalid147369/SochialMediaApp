import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { backendUrl } from "../config";

const getFavorites = createAsyncThunk(
  "favorites/getFavorites",
  async (_, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const cookie = new Cookies()
    const token = cookie.get('token'); // Assuming you have an auth slice with a token

    try {
      const response = await fetch(`${backendUrl}/api/SavedPosts`, {
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

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { favorites: [], loading: false, errors: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFavorites.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getFavorites.fulfilled, (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
    });
    builder.addCase(getFavorites.rejected, (state, action) => {
      state.errors = action.payload;
      state.loading = false;
    });
  },
});

export { getFavorites };
export default favoritesSlice.reducer;

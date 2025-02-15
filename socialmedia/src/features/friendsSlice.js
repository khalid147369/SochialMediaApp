import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backendUrl } from "../config";
import Cookies from "universal-cookie";

const initialState = {
  friendRequests: [],
  friends: [],
  isFriend :"false",
  messages:[],
  error: null,
  loading: false,
  status:null
};

const cookie = new Cookies();
export const deleteRequest = createAsyncThunk(
    "friends/deleteRequest",
    async (friendId, thunkAPI) => {
      const token = cookie.get("token");
      try {
        const response = await axios.delete(
          `${backendUrl}/api/friends/delete-request/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data)
        return response.data;
      } catch (error) {
        console.error("Failed to accept friend request:", error);
        throw error;
      }
    }
  );
const getFriendRequests = createAsyncThunk(
  "friends/getFriendRequests",
  async (_, thunkAPI) => {
    const token = cookie.get("token");
    try {
      const response = await axios.get(`${backendUrl}/api/friends/get-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
      throw error;
    }
  }
);

const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (friendId, thunkAPI) => {
    const token = cookie.get("token");
    try {
      const response = await axios.post(
        `${backendUrl}/api/friends/send-request/${friendId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to send friend request:", error);
      throw error;
    }
  }
);

export const checkIsfriend = createAsyncThunk(
  "friends/checkIsfriend",
  async (friendId, thunkAPI) => {
    const token = cookie.get("token");
    try {
      const response = await axios.get(
        `${backendUrl}/api/friends/are-friends/${friendId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to send friend request:", error);
      throw error;
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (requestId, thunkAPI) => {
    const token = cookie.get("token");
    try {
      const response = await axios.post(
        `${backendUrl}/api/friends/accept-request/${requestId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      throw error;
    }
  }
);

export const getFriends = createAsyncThunk(
  "friends/getFriends",
  async (_, thunkAPI) => {
    const token = cookie.get("token");
    try {
      const response = await axios.get(`${backendUrl}/api/friends/get-friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      throw error;
    }
  }
);

export const getMessages = createAsyncThunk(
  "friends/getMessages",
  async (receiverId, thunkAPI) => {
    const token = cookie.get("token");
    try {
      const response = await axios.get(`${backendUrl}/api/messages/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      throw error;
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages.push(action.payload) ;
    },
  },
  
  extraReducers: (builder) => {
    //get friends requests
    builder
      .addCase(getFriendRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //send friends requests
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests.push(action.payload);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //accept friends requests
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friends.push(action.payload);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //get friends
      .addCase(getFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
            //remove request
   .addCase(deleteRequest.pending, (state) => {
                state.loading = true;
         })
    .addCase(deleteRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload;
         })
    .addCase(deleteRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
        })
    //check is friend  
    .addCase(checkIsfriend.pending, (state) => {

     })
    .addCase(checkIsfriend.fulfilled, (state, action) => {
          state.isFriend = action.payload;
    })
    .addCase(checkIsfriend.rejected, (state, action) => {
          state.error = action.error.message;
    })
    //get messages
    .addCase(getMessages.pending, (state) => {

    })
   .addCase(getMessages.fulfilled, (state, action) => {
         state.messages = action.payload;
   })
   .addCase(getMessages.rejected, (state, action) => {
         state.error = action.error.message;
   });
  },
});
export const { setMessages } = friendsSlice.actions;
export {sendFriendRequest};
export {getFriendRequests};
export default friendsSlice.reducer;

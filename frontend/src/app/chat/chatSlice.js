import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  onlineUsers: [],
  allMessages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setAllMessages: (state, action) => {
      state.allMessages = action.payload;
    },
  },
});
export const { setSocket, setOnlineUsers, setAllMessages } = chatSlice.actions;

export default chatSlice.reducer;

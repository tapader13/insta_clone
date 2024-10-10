import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      if (action.payload.message === 'liked your post') {
        state.notifications.unshift(action.payload);
      } else if (action.payload.message === 'disliked your post') {
        state.notifications = state.notifications.filter(
          (notification) => notification.postId !== action.payload.postId
        );
      } else if (action.payload.message === 'Followed you!') {
        state.notifications.unshift(action.payload);
      } else if (action.payload.message === 'Unfollowed you!') {
        state.notifications = state.notifications.filter(
          (notification) => notification.senderId !== action.payload.senderId
        );
      }
    },

    removeNotification: (state) => {
      state.notifications = [];
    },
  },
});
export const { setNotifications, removeNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;

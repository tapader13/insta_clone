import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  suggestedUser: [],
  selectedProfile: null,
  selectedUser: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUser: (state, action) => {
      state.suggestedUser = action.payload;
    },
    setSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },
    setFollow: (state, action) => {
      state.user.following.push(action.payload.followlenewala);
      state.selectedProfile.followers.push(action.payload.followkornewala);
    },
    setUnfollow: (state, action) => {
      state.user.following = state.user.following.filter(
        (follower) => follower !== action.payload.followlenewala
      );
      state.selectedProfile.followers = state.selectedProfile.followers.filter(
        (follower) => follower !== action.payload.followkornewala
      );
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setBookmark: (state, action) => {
      state.user.bookmarks.push(action.payload.postId);
    },

    removeBookmark: (state, action) => {
      state.user.bookmarks = state.user.bookmarks.filter(
        (bookmark) => bookmark !== action.payload.postId
      );
    },
  },
});
export const {
  setUser,
  setSuggestedUser,
  setSelectedProfile,
  setFollow,
  setUnfollow,
  setSelectedUser,
  setBookmark,
  removeBookmark,
} = authSlice.actions;

export default authSlice.reducer;

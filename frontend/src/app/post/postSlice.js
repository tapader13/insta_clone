import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.posts = action.payload;
    },

    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },

    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    setLikes: (state, action) => {
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );
      if (post) {
        post.likes.push(action.payload.user);
      }
    },

    setDislikes: (state, action) => {
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );
      if (post) {
        post.likes = post.likes.filter((id) => id !== action.payload.user);
      }
    },
    addComment: (state, action) => {
      const post = state.posts.find(
        (post) => post._id === action.payload.postId
      );
      if (post) {
        post.comments.push(action.payload.cid);
      }
    },
  },
});
export const {
  setPost,
  addPost,
  removePost,
  setLikes,
  setDislikes,
  addComment,
} = postSlice.actions;

export default postSlice.reducer;

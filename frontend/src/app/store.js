import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../app/auth/authSlice';
import postReducer from '../app/post/postSlice';
import chatReducer from '../app/chat/chatSlice';
import notificationReducer from '../app/notification/notificationSlice';
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};
const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  chat: chatReducer,
  notification: notificationReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

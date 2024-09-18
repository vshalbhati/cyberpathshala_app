import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import isUserPres from './slices/isUserPres';

export const store = configureStore({
  reducer: {
    user: userReducer,
    isUserPresent: isUserPres,
  },
});
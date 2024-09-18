import { createSlice } from '@reduxjs/toolkit';

export const isUserPres = createSlice({
  name: 'user',
  initialState: {
    isUserPresent: false,
  },
  reducers: {
    setIsUserPresent: (state, action) => {
      state.isUserPresent = action.payload;
    },
  },
});

export const { setIsUserPresent } = isUserPres.actions;

export default isUserPres.reducer;

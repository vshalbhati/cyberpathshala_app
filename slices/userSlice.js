import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
};

// Utility function to store user in AsyncStorage
const saveUserToAsyncStorage = async (user) => {
  try {
    await AsyncStorage.setItem('@user', JSON.stringify(user));
  } catch (error) {
    console.log('Error saving user to AsyncStorage:', error);
  }
};

// Utility function to retrieve user from AsyncStorage
const getUserFromAsyncStorage = async () => {
  try {
    const user = await AsyncStorage.getItem('@user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log('Error retrieving user from AsyncStorage:', error);
    return null;
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      saveUserToAsyncStorage(action.payload); 
    },
    clearUser: (state) => {
      state.user = null;
      AsyncStorage.removeItem('@user'); 
    },
    loadUserFromStorage: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, clearUser, loadUserFromStorage } = userSlice.actions;

export const loadUser = () => async (dispatch) => {
  const user = await getUserFromAsyncStorage();
  if (user) {
    dispatch(loadUserFromStorage(user)); 
  }
};

export default userSlice.reducer;

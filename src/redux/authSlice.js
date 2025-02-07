import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  error: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
    }
  }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

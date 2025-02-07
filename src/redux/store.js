import { configureStore } from '@reduxjs/toolkit'
import rentReducer from './rentSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    rent: rentReducer,
    auth: authReducer
  },
})
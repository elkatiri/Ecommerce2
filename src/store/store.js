import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice.js';
import authReducer from './authSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});
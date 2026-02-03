import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice.ts';

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;

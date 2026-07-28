import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'

export const rootReducer = combineReducers({
  auth: authReducer,
})

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.slice";
import cartReducer from "./reducers/cart.slice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  current: cartReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

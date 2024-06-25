import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user.slice";
import cartReducer from "./reducers/cart.slice";
import orderReducer from "./reducers/order.slice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  user: userReducer,
  current: cartReducer,
  order: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

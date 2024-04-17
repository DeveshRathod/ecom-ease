// cart.slice.js

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;

export const fetchCartItems = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:4000/api/cart");
    dispatch(addItem(response.data)); // Dispatch addItem action with the fetched data
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

// Thunk action creator for adding an item to the cart
export const addToCart = (item) => async (dispatch) => {
  try {
    await axios.post("http://localhost:4000/api/cart/add", item);
    dispatch(addItem(item)); // Dispatch addItem action with the item to be added
  } catch (error) {
    console.error("Error adding item to cart:", error);
    // Handle error if needed
  }
};

// Thunk action creator for removing an item from the cart
export const removeFromCart = (itemId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:4000/api/cart/remove/${itemId}`);
    dispatch(removeItem({ id: itemId })); // Dispatch removeItem action with the item ID to be removed
  } catch (error) {
    console.error("Error removing item from cart:", error);
    // Handle error if needed
  }
};

export default cartSlice.reducer;

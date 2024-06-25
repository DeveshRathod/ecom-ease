import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [],
  billing: {
    totalAmount: 0,
    deliveryCharges: 0,
    discountedPrice: 0,
    discountAmount: 0,
  },
  address: {},
  paymentDetails: {},
  orderStatus: null,
};

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.products = [];
      state.billing = {
        totalAmount: 0,
        deliveryCharges: 0,
        discountedPrice: 0,
        discountAmount: 0,
      };
      state.address = {};
      state.paymentDetails = {};
      state.orderStatus = null;
    },
    addProducts: (state, action) => {
      state.products = action.payload;
    },
    addBilling: (state, action) => {
      state.billing = {
        ...state.billing,
        ...action.payload,
      };
    },
    addAddress: (state, action) => {
      state.address = action.payload;
    },
    addPaymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderStatus = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderStatus = action.payload;
      });
  },
});

export const {
  clearOrder,
  addProducts,
  addBilling,
  addAddress,
  addPaymentDetails,
} = orderSlice.actions;

export default orderSlice.reducer;

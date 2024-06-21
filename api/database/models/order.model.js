import mongoose from "mongoose";
import { addressSchema } from "./address.model.js";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        name: {
          type: String,
          required: true,
        },
        productId: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        sold: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
        colorName: {
          type: String,
          required: true,
        },
        colorIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    status: {
      type: String,
      default: "Placed",
    },
    typeOfPayment: {
      type: String,
      required: true,
    },
    details: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

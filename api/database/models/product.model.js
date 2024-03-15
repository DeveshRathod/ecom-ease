import mongoose from "mongoose";
import Review from "./review.model.js";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  specification: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: [] },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;

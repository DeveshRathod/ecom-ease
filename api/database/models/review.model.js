import mongoose from "mongoose";
import User from "./user.model.js";
import Product from "./product.model.js";

const reviewSchema = mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;

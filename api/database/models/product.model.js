import mongoose from "mongoose";
import Review from "./review.model.js";
import Brand from "./brands.model.js";
const imageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  images: [
    {
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

const productSchema = mongoose.Schema(
  {
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
    specifications: {
      type: String,
      required: true,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    sizes: {
      type: [String],
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
    sold: {
      type: Number,
      default: 0,
    },
    reviews: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: {} },
    ],
    type: {
      type: String,
      default: "all",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
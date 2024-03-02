import mongoose from "mongoose";

// Define Address Schema
const addressSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  addressLine3: {
    type: String,
  },
  pincode: {
    type: String,
    required: true,
  },
});

// Define User Schema
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [addressSchema],
    wishlist: {
      type: Array,
      default: [],
    },
    orders: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compile User model
const User = mongoose.model("User", userSchema);

export default User;

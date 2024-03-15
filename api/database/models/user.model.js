import mongoose from "mongoose";
import Address from "./address.model.js";

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
    birthday: {
      type: Date,
      default: "1999-01-01",
    },
    gender: {
      type: String,
      default: "M",
      validate: {
        validator: function (v) {
          return /^[MFO]$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid gender value! Must be 'M' or 'F'.`,
      },
    },
    mobile: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v.toString());
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit mobile number!`,
      },
      default: 9999999999,
    },
    profile: {
      type: String,
      default:
        "https://www.uhs-group.com/wp-content/uploads/2020/08/person-dummy-e1553259379744.jpg",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
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

const User = mongoose.model("User", userSchema);

export default User;

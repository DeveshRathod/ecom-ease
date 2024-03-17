import mongoose from "mongoose";
import Address from "./address.model.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
          `${props.value} is not a valid gender value! Must be 'M','F' or "O.`,
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
    background: {
      type: String,
      default: "https://cdn.wallpapersafari.com/25/35/duzYIR.jpg",
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

const generateUsername = (firstName, lastName) => {
  const usernamePrefix = `${firstName.slice(0, 3)}${lastName.slice(
    0,
    3
  )}`.toLowerCase();
  const randomNumbers = Math.floor(100000 + Math.random() * 900000);
  return `${usernamePrefix}${randomNumbers}`;
};

userSchema.pre("save", function (next) {
  if (!this.username) {
    this.username = generateUsername(this.firstName, this.lastName);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

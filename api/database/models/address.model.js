import mongoose from "mongoose";

export const addressSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
    required: true,
  },
  addressLine3: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
});

export const Address = mongoose.model("Address", addressSchema);

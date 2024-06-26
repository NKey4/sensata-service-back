import mongoose from "mongoose";
import UserModel from "./User.js";

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    flat: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Address", AddressSchema);

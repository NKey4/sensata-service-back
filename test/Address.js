import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
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

import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
});

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    confirmationCode: String,
    aliceCode: String,
    yandexId: String,
    address: [AddressSchema],
    entryDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);

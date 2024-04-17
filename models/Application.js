import mongoose from "mongoose";
import Location from "./Location.js";
import Category from "./Category.js";
import Status from "./Status.js";

const ApplicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    requestCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    requestSubCategoryId: {
      type: String,
      required: true,
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    dataMessage: String,
    userMessage: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Application", ApplicationSchema);

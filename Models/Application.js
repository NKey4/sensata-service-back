import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    yandexId: String,
    location: {
      type: String,
      required: true,
    },
    workType: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status_id: {
      type: String,
      default: "Создано",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    yandexAddress: String,
    dataMessage: String,
    description: String,
    userMessage: String,
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Application", ApplicationSchema);

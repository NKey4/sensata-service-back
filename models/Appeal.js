import mongoose from "mongoose";

const AppealSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Appeal", AppealSchema);

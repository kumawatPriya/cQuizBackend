import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    level: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);

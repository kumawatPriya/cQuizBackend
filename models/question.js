import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: Number, required: true },
  level: { type: String, enum: ["easy", "medium", "hard"], required: true }
});

export default mongoose.model("Question", questionSchema);

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
    category: { type: String, required: true, enum: ["hr", "technical", "aptitude"] },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, default: "Medium" },
    marks: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);

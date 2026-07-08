import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ["hr", "technical", "aptitude"] },
    description: { type: String, required: true },
    difficulty: { type: String, default: "Medium" },
    duration: { type: Number, default: 30 }, // in minutes
    totalQuestions: { type: Number, default: 20 },
    passingMarks: { type: Number, default: 12 }, // e.g. 60% of 20
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);

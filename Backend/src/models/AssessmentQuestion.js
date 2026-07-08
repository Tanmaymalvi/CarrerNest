import mongoose from "mongoose";

// MCQ question for assessments (separate from study questions)
const assessmentQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["hr", "technical", "aptitude"],
      required: true,
      index: true,
    },
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: (v) => v.length === 4,
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 }, // index into options[]
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    explanation: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("AssessmentQuestion", assessmentQuestionSchema);

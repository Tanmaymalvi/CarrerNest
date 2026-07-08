import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["hr", "technical", "aptitude", "experience"],
      required: true,
      index: true,
    },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    tags: { type: [String], default: [] },
    company: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Full-text index for search
interviewQuestionSchema.index({ question: "text", answer: "text", tags: "text", company: "text" });

export default mongoose.model("InterviewQuestion", interviewQuestionSchema);

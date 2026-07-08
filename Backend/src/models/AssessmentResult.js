import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: ["hr", "technical", "aptitude"], required: true },
    assessmentName: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    attempted: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    score: { type: Number, default: 0 },          // correct count
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    timeTakenSeconds: { type: Number, default: 0 },
    // snapshot of questions used (without correctIndex for security)
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "AssessmentQuestion" }],
  },
  { timestamps: true }
);

export default mongoose.model("AssessmentResult", assessmentResultSchema);

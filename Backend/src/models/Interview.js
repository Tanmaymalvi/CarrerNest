import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    scheduledDate: { type: Date, required: true },
    type: { type: String, enum: ["phone", "video", "in-person"], default: "video" },
    meetingLink: String,
    round: { type: Number, default: 1 },
    status: { type: String, enum: ["scheduled", "completed", "cancelled", "no-show"], default: "scheduled" },
    feedback: String,
    rating: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);

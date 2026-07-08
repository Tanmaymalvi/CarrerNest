import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    email: String,
    phone: String,
    resume: String,
    portfolioLink: String,
    coverNote: String,
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "interview_scheduled", "on_hold", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
  },
  { timestamps: true },
);

applicationSchema.index({ job: 1, student: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);

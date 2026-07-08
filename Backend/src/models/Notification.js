import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["application_submitted", "application_status", "application_accepted", "application_rejected", "interview_scheduled", "job_posted", "message"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: mongoose.Schema.Types.ObjectId,
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);

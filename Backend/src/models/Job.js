import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    salary: String,
    location: String,
    experience: String,
    openPositions: { type: Number, default: 1 },
    skills: [String],
    type: { type: String, default: "Full-time" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "active", "paused", "rejected"], default: "pending" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);

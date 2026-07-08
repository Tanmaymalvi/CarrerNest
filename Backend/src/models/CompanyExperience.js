import mongoose from "mongoose";

const companyExperienceSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    verdict: { type: String, enum: ["Selected", "Rejected", "Landed next round", "Pending"], default: "Pending" },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CompanyExperience", companyExperienceSchema);

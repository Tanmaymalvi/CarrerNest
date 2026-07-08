import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    resumeUrl: String,
    pdfUrl: String,
    cloudinaryId: String,
    isPrimary: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    data: {
      personalDetails: { type: Object, default: {} },
      careerObjective: { type: String, default: "" },
      education: { type: Array, default: [] },
      skills: { type: Array, default: [] },
      projects: { type: Array, default: [] },
      internships: { type: Array, default: [] },
      experience: { type: Array, default: [] },
      certifications: { type: Array, default: [] },
      achievements: { type: Array, default: [] },
      positionsOfResponsibility: { type: Array, default: [] },
      languages: { type: Array, default: [] },
      socialLinks: { type: Array, default: [] },
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);

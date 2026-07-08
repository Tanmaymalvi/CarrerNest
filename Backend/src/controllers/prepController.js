import CompanyExperience from "../models/CompanyExperience.js";

export const getExperiences = async (req, res) => {
  try {
    const experiences = await CompanyExperience.find()
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch experiences" });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { companyName, role, difficulty, verdict, content } = req.body;
    if (!companyName || !role || !content) {
      return res.status(400).json({ message: "Company name, role, and details are required" });
    }

    const experience = await CompanyExperience.create({
      companyName,
      role,
      difficulty,
      verdict,
      content,
      user: req.user._id,
    });

    const populated = await experience.populate("user", "name email avatar");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to save experience" });
  }
};

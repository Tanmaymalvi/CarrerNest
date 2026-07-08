import Company from "../models/Company.js";

export const listCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to list companies" });
  }
};

export const createCompany = async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, owner: req.user._id, logo: req.file?.path });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create company" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update company" });
  }
};

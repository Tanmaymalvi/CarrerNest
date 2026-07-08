import Resume from "../models/Resume.js";

const buildResumeDownloadUrl = (resume) => {
  const payload = encodeURIComponent(JSON.stringify({
    title: resume.title,
    template: resume.template,
    data: resume.data,
  }));
  return `data:application/json;charset=utf-8,${payload}`;
};

export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      userId: req.user._id,
      title: req.body.title || "Untitled Resume",
      template: req.body.template || "classic",
      data: req.body.data || {},
    });
    resume.resumeUrl = buildResumeDownloadUrl(resume);
    resume.pdfUrl = resume.resumeUrl;
    await resume.save();
    res.status(201).json({ message: "Resume draft saved", resume });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create resume" });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json({ resume });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.resumeId, userId: req.user._id },
      {
        title: req.body.title,
        template: req.body.template,
        data: req.body.data,
        uploadedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!resume) return res.status(404).json({ message: "Resume not found" });
    resume.resumeUrl = buildResumeDownloadUrl(resume);
    resume.pdfUrl = resume.resumeUrl;
    await resume.save();
    res.status(200).json({ message: "Resume updated", resume });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update resume" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { userId } = req.body;
    const resumeFile = req.file;

    if (!resumeFile || !userId) {
      return res.status(400).json({ message: "Resume file and userId are required" });
    }

    const resume = new Resume({
      userId,
      title: req.body.title || "My Resume",
      resumeUrl: resumeFile.path,
      pdfUrl: resumeFile.path,
      cloudinaryId: resumeFile.filename,
    });

    await resume.save();
    res.status(201).json({ message: "Resume uploaded successfully", resume });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

export const getResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId }).sort({ uploadedAt: -1 });

    res.status(200).json({ resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndDelete(resumeId);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

export const setPrimaryResume = async (req, res) => {
  try {
    const { resumeId, userId } = req.body;

    // Remove primary from all other resumes
    await Resume.updateMany({ userId }, { isPrimary: false });

    // Set the selected resume as primary
    const resume = await Resume.findByIdAndUpdate(resumeId, { isPrimary: true }, { new: true });

    res.status(200).json({ message: "Primary resume updated", resume });
  } catch (error) {
    console.error("Error setting primary resume:", error);
    res.status(500).json({ message: "Failed to set primary resume" });
  }
};

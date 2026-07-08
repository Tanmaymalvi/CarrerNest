import SavedJob from "../models/SavedJob.js";

export const saveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Check if already saved
    const existingSave = await SavedJob.findOne({ userId, jobId });
    if (existingSave) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const savedJob = new SavedJob({ userId, jobId });
    await savedJob.save();

    res.status(201).json({ message: "Job saved successfully", savedJob });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Failed to save job" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const { userId } = req.params;

    const savedJobs = await SavedJob.find({ userId })
      .populate("jobId")
      .sort({ savedAt: -1 });

    res.status(200).json({ savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    await SavedJob.findOneAndDelete({ userId, jobId });

    res.status(200).json({ message: "Job unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving job:", error);
    res.status(500).json({ message: "Failed to unsave job" });
  }
};

export const checkIfSaved = async (req, res) => {
  try {
    const { userId, jobId } = req.query;

    const savedJob = await SavedJob.findOne({ userId, jobId });

    res.status(200).json({ isSaved: !!savedJob });
  } catch (error) {
    console.error("Error checking saved status:", error);
    res.status(500).json({ message: "Failed to check saved status" });
  }
};

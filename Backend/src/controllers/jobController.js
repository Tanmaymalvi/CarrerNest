import Job from "../models/Job.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const listJobs = async (req, res) => {
  try {
    const { search, location, status = "active" } = req.query;
    const query = {};
    if (status !== "all") query.status = status;
    if (location) query.location = new RegExp(location, "i");
    if (search) query.$or = [{ title: new RegExp(search, "i") }, { skills: new RegExp(search, "i") }];

    const jobs = await Job.find(query).populate("company", "name logo location status").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch jobs" });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company", "name logo location website description");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch job" });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employer: req.user._id });
    const students = await User.find({ role: "student", status: "active" }).select("_id").limit(250);
    if (students.length) {
      await Notification.insertMany(
        students.map((student) => ({
          userId: student._id,
          type: "job_posted",
          title: "New job posted",
          message: `${job.title} is now open for applications.`,
          relatedId: job._id,
        })),
        { ordered: false },
      );
    }
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create job" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete job" });
  }
};

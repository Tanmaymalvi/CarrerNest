import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

export const applyToJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const existing = await Application.findOne({ job: req.params.jobId, student: req.user._id });
  if (existing) {
    res.status(409);
    throw new Error("You already applied for this job");
  }

  const application = await Application.create({
    job: req.params.jobId,
    student: req.user._id,
    employer: job.employer,
    fullName: req.body.fullName || req.user.name,
    email: req.body.email || req.user.email,
    phone: req.body.phone || req.user.phone,
    resume: req.file?.path || req.user.resume,
    coverNote: req.body.coverLetter || req.body.coverNote,
    portfolioLink: req.body.portfolioLink,
  });

  await Notification.create({
    userId: req.user._id,
    type: "application_submitted",
    title: "Application submitted",
    message: `Your application for ${job.title} was submitted successfully.`,
    relatedId: application._id,
  });

  res.status(201).json(application);
};

export const myApplications = async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate({ path: "job", populate: { path: "company", select: "name logo location" } })
    .sort({ createdAt: -1 });
  res.json(applications);
};

export const employerApplications = async (req, res) => {
  const applications = await Application.find({ employer: req.user._id })
    .populate("student", "name email phone resume")
    .populate({ path: "job", populate: { path: "company", select: "name logo location" } })
    .sort({ createdAt: -1 });
  res.json(applications);
};

export const updateApplicationStatus = async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  const statusAliases = {
    "interview scheduled": "interview_scheduled",
    "on hold": "on_hold",
  };
  const nextStatus = statusAliases[req.body.status] || req.body.status;
  const allowedStatuses = ["pending", "reviewing", "shortlisted", "interview_scheduled", "on_hold", "accepted", "rejected", "withdrawn"];

  if (!allowedStatuses.includes(nextStatus)) {
    res.status(400);
    throw new Error("Invalid application status");
  }
  if (req.user.role === "student") {
    if (nextStatus !== "withdrawn" || application.student.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Students can only withdraw their own applications");
    }
  } else if (application.employer?.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Forbidden");
  }

  application.status = nextStatus;
  await application.save();

  await Notification.create({
    userId: application.student,
    type: nextStatus === "accepted" ? "application_accepted" : nextStatus === "rejected" ? "application_rejected" : nextStatus === "interview_scheduled" ? "interview_scheduled" : "application_status",
    title: "Application status updated",
    message: `Your application status is now ${application.status.replace("_", " ")}.`,
    relatedId: application._id,
  });
  res.json(application);
};

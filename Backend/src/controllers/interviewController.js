import Interview from "../models/Interview.js";

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, userId, jobId, companyId, scheduledDate, type, meetingLink } = req.body;

    const interview = new Interview({
      applicationId,
      userId,
      jobId,
      companyId,
      scheduledDate,
      type,
      meetingLink,
    });

    await interview.save();
    res.status(201).json({ message: "Interview scheduled", interview });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ message: "Failed to schedule interview" });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await Interview.find({ userId })
      .populate("jobId")
      .populate("companyId")
      .sort({ scheduledDate: -1 });

    res.status(200).json({ interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
};

export const updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status, feedback, rating } = req.body;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      { status, feedback, rating },
      { new: true }
    );

    res.status(200).json({ message: "Interview status updated", interview });
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ message: "Failed to update interview" });
  }
};

export const cancelInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      { status: "cancelled" },
      { new: true }
    );

    res.status(200).json({ message: "Interview cancelled", interview });
  } catch (error) {
    console.error("Error cancelling interview:", error);
    res.status(500).json({ message: "Failed to cancel interview" });
  }
};

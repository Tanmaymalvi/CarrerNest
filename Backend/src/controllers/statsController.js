import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";
import Application from "../models/Application.js";

export const getStats = async (req, res) => {
  try {
    const [totalJobs, totalCompanies, totalUsers, totalApplications, acceptedApplications] =
      await Promise.all([
        Job.countDocuments({ status: "active" }),
        Company.countDocuments({ status: "verified" }),
        User.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: "accepted" }),
      ]);

    // satisfactionRate = percentage of accepted applications out of total
    // Fall back to 98 if there is not enough data yet (< 10 applications)
    const satisfactionRate =
      totalApplications >= 10
        ? Math.min(99, Math.round((acceptedApplications / totalApplications) * 100))
        : 98;

    res.status(200).json({
      success: true,
      totalJobs,
      totalCompanies,
      totalUsers,
      satisfactionRate,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      // Graceful fallback values
      totalJobs: 0,
      totalCompanies: 0,
      totalUsers: 0,
      satisfactionRate: 98,
    });
  }
};

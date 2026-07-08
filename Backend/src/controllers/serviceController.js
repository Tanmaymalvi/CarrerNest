import Service from "../models/Service.js";
import Order from "../models/Order.js";

const defaultServices = [
  { name: "Resume Builder", description: "Create professional resumes with templates and downloads.", price: 0, category: "resume", features: ["ATS-ready sections", "Multiple templates", "Download support"], icon: "FileText", badge: "Free" },
  { name: "Resume Review", description: "Get expert feedback on structure, keywords, and presentation.", price: 1999, category: "resume", features: ["Expert comments", "Improvement checklist", "24-hour turnaround"], icon: "Award", badge: "Popular" },
  { name: "Resume Writing", description: "Work with a specialist to create an ATS-friendly resume.", price: 2499, category: "resume", features: ["Professional writer", "ATS optimization", "Two revisions"], icon: "FileText", badge: "Premium" },
  { name: "AI Mock Interview", description: "Practice role-specific interviews with instant feedback.", price: 999, category: "interview", features: ["Role-based questions", "Feedback report", "Readiness score"], icon: "Brain", badge: "Smart" },
  { name: "Priority Applicant", description: "Move your applications higher in recruiter review queues.", price: 699, category: "job-search", features: ["Priority tag", "Faster review", "30-day validity"], icon: "Zap", badge: "Best Value" },
  { name: "Resume Display", description: "Show your profile prominently to active recruiters.", price: 499, category: "premium", features: ["Higher visibility", "Premium badge", "Recruiter reach"], icon: "Eye", badge: "Popular" },
  { name: "Recruiter Connection", description: "Get direct recruiter outreach for matching roles.", price: 4999, category: "premium", features: ["Dedicated recruiter", "Custom matches", "Priority support"], icon: "Users", badge: "Exclusive" },
  { name: "Career Coaching", description: "Plan your next move with a dedicated career coach.", price: 2999, category: "other", features: ["One-on-one session", "Career roadmap", "Action plan"], icon: "Award", badge: "Guided" },
  { name: "Interview Preparation", description: "Prepare for technical and HR interview rounds.", price: 1499, category: "interview", features: ["Question bank", "Practice plan", "Feedback checklist"], icon: "Brain", badge: "Focused" },
];

export const getAllServices = async (req, res) => {
  try {
    let services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    if (!services.length) {
      services = await Service.insertMany(defaultServices);
    }
    res.status(200).json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, category, features, icon, badge } = req.body;

    const service = new Service({
      name,
      description,
      price,
      category,
      features,
      icon,
      badge,
    });

    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Failed to create service" });
  }
};

export const purchaseService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const userId = req.user._id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Create order
    const order = new Order({
      userId,
      serviceId,
      amount: service.price,
      status: "pending",
    });

    await order.save();

    res.status(201).json({ 
      message: "Order created successfully",
      order,
      paymentUrl: `/api/services/payment/${order._id}`
    });
  } catch (error) {
    console.error("Error purchasing service:", error);
    res.status(500).json({ message: "Failed to purchase service" });
  }
};

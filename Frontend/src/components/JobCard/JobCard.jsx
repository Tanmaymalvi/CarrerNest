import { Bookmark, Briefcase, Clock, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Badge, Button } from "../ui";
import { savedJobsApi } from "../../services/api";
import { getCompanyLogo } from "../../utils/logos";
import "./JobCard.css";

const getJobId = (job) => job._id || job.id;
const isMongoId = (value) => /^[a-f\d]{24}$/i.test(value || "");
const companyName = (job) => (typeof job.company === "object" ? job.company?.name : job.company) || "Company";
const postedLabel = (job) => job.posted || (job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently posted");
const applicantsLabel = (job) => job.applicants ?? job.openPositions ?? 0;

const JobCard = ({ job, compact = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const jobId = getJobId(job);
  const nameOfCompany = companyName(job);
  const logoUrl = getCompanyLogo(nameOfCompany);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    if (!isMongoId(jobId)) {
      toast.success("Demo job saved for this session");
      return;
    }

    try {
      await savedJobsApi.save(jobId, user.id || user._id);
      toast.success("Job saved");
    } catch (error) {
      const message = error.response?.data?.message || "Could not save job";
      if (message.toLowerCase().includes("already")) {
        toast("This job is already saved");
        return;
      }
      toast.error(message);
    }
  };

  return (
  <motion.article 
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -6, scale: 1.01 }}
    className="glass group flex h-full flex-col rounded-2xl p-5 text-left"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-100 dark:bg-white/10 dark:border-white/5 overflow-hidden p-1.5 shadow-sm">
          {logoUrl ? (
            <img src={logoUrl} alt={nameOfCompany} className="h-full w-full object-contain" />
          ) : (
            <span className="text-teal-800 font-extrabold text-sm dark:text-teal-200">
              {nameOfCompany.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <Link
            to={`/job/${jobId}`}
            className="text-lg font-bold text-slate-950 hover:text-teal-700 dark:text-white dark:hover:text-teal-200"
          >
            {job.title}
          </Link>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{companyName(job)}</p>
        </div>
      </div>
      <button onClick={handleSave} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm hover:text-teal-700 dark:bg-white/10 dark:text-slate-300" aria-label="Save job">
        <Bookmark size={18} />
      </button>
    </div>

    <div className="mt-5 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
      <span className="inline-flex items-center gap-2"><MapPin size={16} /> {job.location || "Remote"} - {job.mode || job.type}</span>
      <span className="inline-flex items-center gap-2"><Briefcase size={16} /> {job.experience} - {job.type}</span>
      <span className="inline-flex items-center gap-2"><Clock size={16} /> {postedLabel(job)}</span>
    </div>

    {!compact ? (
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {job.description}
      </p>
    ) : null}

    <div className="mt-5 flex flex-wrap gap-2">
      {(job.skills || []).slice(0, 3).map((skill) => (
        <Badge key={skill} tone="slate">{skill}</Badge>
      ))}
    </div>

    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
      <div>
        <p className="text-sm font-bold text-slate-950 dark:text-white">{job.salary}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{applicantsLabel(job)} openings</p>
      </div>
      <Button to={`/job/${jobId}`} className="px-4">View</Button>
    </div>
  </motion.article>
  );
};

export default JobCard;

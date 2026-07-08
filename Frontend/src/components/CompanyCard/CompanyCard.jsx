import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui";
import { getCompanyLogo } from "../../utils/logos";
import "./CompanyCard.css";

const CompanyCard = ({ company, index }) => {
  const [isSaved, setIsSaved] = useState(false);
  const companyId = company._id || company.id;
  const category = company.industry || company.category || "Technology";
  const logoUrl = getCompanyLogo(company.name) || company.logo;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:border-teal-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 dark:hover:border-teal-500/50"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white border border-slate-100 dark:bg-white/10 dark:border-white/5 overflow-hidden p-2 shadow-sm shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={company.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-teal-800 font-extrabold text-lg dark:text-teal-200">
                {company.name?.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{company.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{category}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsSaved(!isSaved);
            toast.success(isSaved ? "Company removed from follows" : "Company followed");
          }}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
            isSaved
              ? "border-yellow-400 bg-yellow-50 text-yellow-500 dark:border-yellow-500/30 dark:bg-yellow-500/10"
              : "border-slate-200 bg-white text-slate-400 hover:border-yellow-400 dark:border-white/10 dark:bg-white/10 dark:text-slate-500"
          }`}
          aria-label="Follow company"
        >
          <Star size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{company.description || "Explore hiring activity and open roles."}</p>
      <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
        <div className="text-center"><div className="text-sm font-semibold">{company.rating || "4.5"}</div><p className="text-xs text-slate-600 dark:text-slate-400">Rating</p></div>
        <div className="text-center"><div className="text-sm font-semibold">{company.openJobs || 0}</div><p className="text-xs text-slate-600 dark:text-slate-400">Open Jobs</p></div>
        <div className="text-center"><div className="text-sm font-semibold">{company.employees || "100+"}</div><p className="text-xs text-slate-600 dark:text-slate-400">Employees</p></div>
      </div>
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"><MapPin size={16} />{company.location || "India"}</div>
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500"><Clock size={14} />Recently active</div>
      <div className="flex gap-2">
        <Button to={`/companies/${companyId}`} className="flex-1 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20">View Jobs</Button>
        <Button onClick={() => toast.success("Company followed")} className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg">Follow</Button>
      </div>
    </motion.article>
  );
};

export default CompanyCard;

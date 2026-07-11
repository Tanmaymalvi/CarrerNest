import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, LayoutGrid, List, Search } from "lucide-react";
import toast from "react-hot-toast";
import JobCard from "../../components/JobCard/JobCard";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";
import { jobsApi } from "../../services/api";
import { motion } from "framer-motion";

import "./Jobs.css";
const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [view, setView] = useState("grid");
  const [apiJobs, setApiJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [expFilter, setExpFilter] = useState("Any experience");
  const [salaryFilter, setSalaryFilter] = useState("Any salary");
  const [typeFilter, setTypeFilter] = useState("Any job type");
  const [modeFilter, setModeFilter] = useState("Any work mode");

  // Sync state if URL query params change
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
  }, [searchParams]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data } = await jobsApi.list({ status: "active" });
        setApiJobs(Array.isArray(data) ? data : data.jobs || []);
        setError("");
      } catch (apiError) {
        const message = apiError.response?.data?.message || "Could not load jobs from the backend";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return apiJobs.filter((job) => {
      // 1. Text search filter
      const company = typeof job.company === "object" ? job.company?.name : job.company;
      const text = `${job.title} ${company || ""} ${(job.skills || []).join(" ")}`.toLowerCase();
      if (!text.includes(query.toLowerCase())) return false;

      // 2. Location filter
      if (location && !(job.location || "").toLowerCase().includes(location.toLowerCase())) return false;

      // 3. Experience filter
      if (expFilter !== "Any experience") {
        const jobExp = (job.experience || "").toLowerCase();
        const val = expFilter.toLowerCase();
        if (val === "fresher") {
          if (!jobExp.includes("fresher") && !jobExp.includes("0")) return false;
        } else if (val === "1-3 years") {
          if (!jobExp.includes("1") && !jobExp.includes("2") && !jobExp.includes("3") && !jobExp.includes("1-3")) return false;
        } else if (val === "3-5 years") {
          if (!jobExp.includes("3") && !jobExp.includes("4") && !jobExp.includes("5") && !jobExp.includes("3-5")) return false;
        } else if (val === "5+ years") {
          const match = jobExp.match(/(\d+)/);
          if (match) {
            const years = parseInt(match[1]);
            if (years < 5) return false;
          } else if (!jobExp.includes("5") && !jobExp.includes("6") && !jobExp.includes("senior") && !jobExp.includes("lead")) {
            return false;
          }
        } else if (!jobExp.includes(val)) {
          return false;
        }
      }

      // 4. Salary filter
      if (salaryFilter !== "Any salary") {
        const jobSalary = (job.salary || "").toLowerCase();
        const numbers = jobSalary.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const isMonthly = jobSalary.includes("month") || jobSalary.includes("pm");
          let minSalaryLPA = 0;
          const val = parseInt(numbers[0]);
          if (isMonthly) {
            minSalaryLPA = val > 1000 ? (val * 12) / 100000 : val;
          } else {
            minSalaryLPA = val;
          }
          if (salaryFilter === "Under ₹3 LPA" && minSalaryLPA >= 3) return false;
          if (salaryFilter === "₹3 LPA - ₹6 LPA" && (minSalaryLPA < 3 || minSalaryLPA > 6)) return false;
          if (salaryFilter === "₹6 LPA - ₹10 LPA" && (minSalaryLPA < 6 || minSalaryLPA > 10)) return false;
          if (salaryFilter === "₹10 LPA+" && minSalaryLPA < 10) return false;
        } else {
          return false;
        }
      }

      // 5. Job Type filter
      if (typeFilter !== "Any job type") {
        if ((job.type || "").toLowerCase() !== typeFilter.toLowerCase()) return false;
      }

      // 6. Work Mode filter
      if (modeFilter !== "Any work mode") {
        const mode = (job.mode || job.location || "").toLowerCase();
        const val = modeFilter.toLowerCase();
        if (val === "remote" && !mode.includes("remote")) return false;
        if (val === "hybrid" && !mode.includes("hybrid")) return false;
        if (val === "on-site" && (mode.includes("remote") || mode.includes("hybrid"))) return false;
      }

      return true;
    });
  }, [apiJobs, query, location, expFilter, salaryFilter, typeFilter, modeFilter]);

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-16 sm:py-20 border-b border-slate-100 dark:border-white/5">
        <motion.div 
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/5" 
        />
        <motion.div 
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" 
        />
        
        <Container>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/30">
              🔍 Explore Opportunities
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Search Roles with <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">Smart Filters</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Filter by title, company, skills, salary, location, and experience. Toggle between grid and list views.
            </p>

            <div className="glass mx-auto mt-8 max-w-4xl rounded-3xl p-4 shadow-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/10">
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
                <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 dark:bg-white/10">
                  <Search size={18} className="text-teal-700" />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search title, company, skill" />
                </label>
                <input value={location} onChange={(event) => setLocation(event.target.value)} className="min-h-12 rounded-2xl bg-white px-4 text-sm outline-none dark:bg-white/10" placeholder="Location" />
                
                <Button 
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-teal-700 text-white hover:bg-teal-800" : ""}
                >
                  <Filter size={17} /> Filters
                </Button>
                
                <div className="flex rounded-2xl bg-white p-1 dark:bg-white/10">
                  <button onClick={() => setView("grid")} className={`flex h-10 w-10 items-center justify-center rounded-xl ${view === "grid" ? "bg-teal-700 text-white" : ""}`} aria-label="Grid view"><LayoutGrid size={17} /></button>
                  <button onClick={() => setView("list")} className={`flex h-10 w-10 items-center justify-center rounded-xl ${view === "list" ? "bg-teal-700 text-white" : ""}`} aria-label="List view"><List size={17} /></button>
                </div>
              </div>

              {/* Collapsible filters panel */}
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 border-t border-slate-200 dark:border-white/10 pt-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Refine search results</span>
                    <button
                      onClick={() => {
                        setExpFilter("Any experience");
                        setSalaryFilter("Any salary");
                        setTypeFilter("Any job type");
                        setModeFilter("Any work mode");
                      }}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {/* Experience */}
                    <label className="block text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Experience</span>
                      <select
                        value={expFilter}
                        onChange={(e) => setExpFilter(e.target.value)}
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Any experience">Any experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5+ years">5+ years</option>
                      </select>
                    </label>

                    {/* Salary */}
                    <label className="block text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Salary</span>
                      <select
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Any salary">Any salary</option>
                        <option value="Under ₹3 LPA">Under ₹3 LPA</option>
                        <option value="₹3 LPA - ₹6 LPA">₹3 LPA - ₹6 LPA</option>
                        <option value="₹6 LPA - ₹10 LPA">₹6 LPA - ₹10 LPA</option>
                        <option value="₹10 LPA+">₹10 LPA+</option>
                      </select>
                    </label>

                    {/* Job Type */}
                    <label className="block text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Type</span>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Any job type">Any job type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </label>

                    {/* Work Mode */}
                    <label className="block text-left">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Mode</span>
                      <select
                        value={modeFilter}
                        onChange={(e) => setModeFilter(e.target.value)}
                        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none dark:border-white/10 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Any work mode">Any work mode</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="mt-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{loading ? "Loading jobs..." : `${filteredJobs.length} jobs found`}</p>
            <Badge tone="cyan">Sorted by relevance</Badge>
          </div>
          {error ? (
            <div className="glass rounded-2xl p-10 text-center">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">Backend unavailable</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{error}</p>
            </div>
          ) : filteredJobs.length ? (
            <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3" : "grid gap-4"}>
              {filteredJobs.map((job) => <JobCard key={job._id || job.id} job={job} compact={view === "list"} />)}
            </div>
          ) : (
            <div className="glass rounded-2xl p-10 text-center">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white">No jobs found</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Try removing a filter or searching for a broader skill.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Jobs;

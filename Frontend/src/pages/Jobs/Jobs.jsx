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
      const company = typeof job.company === "object" ? job.company?.name : job.company;
      const text = `${job.title} ${company || ""} ${(job.skills || []).join(" ")}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (job.location || "").toLowerCase().includes(location.toLowerCase());
    });
  }, [apiJobs, query, location]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="section-pad"
    >
      <Container>
        <SectionHeader
          eyebrow="Find jobs"
          title="Search roles with smart filters"
          description="Filter by title, company, skills, salary, location, and experience. Toggle between grid and list views."
        />

        <div className="glass mb-6 rounded-3xl p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
            <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 dark:bg-white/10">
              <Search size={18} className="text-teal-700" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search title, company, skill" />
            </label>
            <input value={location} onChange={(event) => setLocation(event.target.value)} className="min-h-12 rounded-2xl bg-white px-4 text-sm outline-none dark:bg-white/10" placeholder="Location" />
            <Button variant="secondary"><Filter size={17} /> Filters</Button>
            <div className="flex rounded-2xl bg-white p-1 dark:bg-white/10">
              <button onClick={() => setView("grid")} className={`flex h-10 w-10 items-center justify-center rounded-xl ${view === "grid" ? "bg-teal-700 text-white" : ""}`} aria-label="Grid view"><LayoutGrid size={17} /></button>
              <button onClick={() => setView("list")} className={`flex h-10 w-10 items-center justify-center rounded-xl ${view === "list" ? "bg-teal-700 text-white" : ""}`} aria-label="List view"><List size={17} /></button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass h-max rounded-2xl p-5">
            <h3 className="font-bold text-slate-950 dark:text-white">Advanced filters</h3>
            {["Experience", "Salary", "Job type", "Work mode"].map((label) => (
              <label key={label} className="mt-5 block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                <select className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-900">
                  <option>Any {label.toLowerCase()}</option>
                  <option>Entry level</option>
                  <option>Mid level</option>
                  <option>Senior</option>
                </select>
              </label>
            ))}
          </aside>

          <div>
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
              <div className={view === "grid" ? "grid gap-5 md:grid-cols-2" : "grid gap-4"}>
                {filteredJobs.map((job) => <JobCard key={job._id || job.id} job={job} compact={view === "list"} />)}
              </div>
            ) : (
              <div className="glass rounded-2xl p-10 text-center">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">No jobs found</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Try removing a filter or searching for a broader skill.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </motion.section>
  );
};

export default Jobs;

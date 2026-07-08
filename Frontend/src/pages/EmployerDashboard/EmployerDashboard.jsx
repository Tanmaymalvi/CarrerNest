import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Building2, FileText, PlusCircle, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Container, SectionHeader, StatCard } from "../../components/ui";
import { jobsApi, applicationsApi } from "../../services/api";

const EmployerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;

  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  
  // Chart Data states
  const [appsPerJobData, setAppsPerJobData] = useState([]);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        // 1. Fetch Employer Jobs
        const { data: allJobs } = await jobsApi.list({ status: "all" });
        const list = Array.isArray(allJobs) ? allJobs : allJobs?.jobs || [];
        const myJobs = list.filter((job) => job.employer === userId || job.employer?._id === userId);
        
        setTotalJobs(myJobs.length);
        setActiveJobs(myJobs.filter((job) => job.status === "active").length);

        // 2. Fetch Applications
        const { data: allApps } = await applicationsApi.employer();
        const appsList = Array.isArray(allApps) ? allApps : [];
        setApplicationsCount(appsList.length);
        setShortlistedCount(appsList.filter((app) => app.status === "shortlisted").length);
        
        setRecentApps(appsList.slice(0, 4));

        // 3. Process Applications per Job Chart Data
        const jobCounts = {};
        myJobs.forEach((job) => {
          jobCounts[job.title] = 0;
        });
        appsList.forEach((app) => {
          const title = app.job?.title || "Unknown Job";
          if (jobCounts[title] !== undefined) {
            jobCounts[title]++;
          } else {
            jobCounts[title] = 1;
          }
        });

        const chartData = Object.keys(jobCounts).map((title) => ({
          title: title.slice(0, 15) + (title.length > 15 ? "..." : ""),
          count: jobCounts[title],
        })).slice(0, 5); // Limit to top 5 for visual layout
        setAppsPerJobData(chartData);

      } catch (error) {
        console.error("Dashboard statistics loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (!user || user.role !== "employer") {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Employer Access Only</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Please register or log in as an Employer to access the dashboard controls.</p>
            <Button to="/login" className="mt-6">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen"
    >
      <Container>
        <SectionHeader 
          eyebrow="Employer Dashboard" 
          title="Manage Jobs and Applicants" 
          description="Post new openings, review incoming applicant submissions, and check hiring metrics." 
        />
        
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium">Computing dashboard stats...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={BriefcaseBusiness} value={totalJobs} label="Total Jobs Posted" />
              <StatCard icon={Building2} value={activeJobs} label="Active Listings" />
              <StatCard icon={Users} value={applicationsCount} label="Applications Received" />
              <StatCard icon={FileText} value={shortlistedCount} label="Shortlisted Candidates" />
            </div>

            {/* Analytics Charts & Recent Applicants */}
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-8">
                {/* SVG/CSS Charts Section */}
                <div className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-slate-950">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Applications per Job (Top 5)</h3>
                  {appsPerJobData.length > 0 ? (
                    <div className="space-y-4">
                      {appsPerJobData.map((data, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <span>{data.title}</span>
                            <span>{data.count} applications</span>
                          </div>
                          <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-1000"
                              style={{ width: `${Math.min((data.count / Math.max(...appsPerJobData.map(d => d.count || 1))) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">No application stats available yet. Post a job to start gathering stats!</p>
                  )}
                </div>

                <div className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-slate-950">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Monthly Hiring Analytics (Hired vs Applied)</h3>
                  {/* Clean SVG Line / Area chart */}
                  <div className="relative h-44 w-full">
                    <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="appliedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Applied line & fill */}
                      <path d="M 0 35 Q 25 15 50 25 T 100 10 L 100 40 L 0 40 Z" fill="url(#appliedGrad)" />
                      <path d="M 0 35 Q 25 15 50 25 T 100 10" fill="none" stroke="#14b8a6" strokeWidth="0.8" />
                      
                      {/* Hired line */}
                      <path d="M 0 38 Q 25 28 50 34 T 100 24" fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="1.5, 1" />
                    </svg>
                    <div className="absolute inset-0 flex justify-between items-end text-[10px] text-slate-500 font-bold px-2 pb-1 pointer-events-none">
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun (Current)</span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 justify-center text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                      <span className="h-3 w-3 rounded-full bg-teal-500 inline-block" /> Candidates Applied
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                      <span className="h-3 w-3 rounded-full bg-cyan-500 border border-dashed border-cyan-300 inline-block" /> Candidates Selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Actions and Recent applicants */}
              <aside className="space-y-6">
                <div className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-slate-950">
                  <h3 className="font-bold text-slate-950 dark:text-white border-b pb-3 mb-4">Quick Action Menu</h3>
                  <div className="grid gap-3">
                    <Button to="/employer/post-job" className="w-full">
                      <PlusCircle size={17} /> Post a New Job
                    </Button>
                    <Button to="/employer/company" variant="secondary" className="w-full">
                      Company Profile Setup
                    </Button>
                    <Button to="/employer/jobs" variant="secondary" className="w-full">
                      Manage My Jobs
                    </Button>
                    <Button to="/employer/applicants" variant="secondary" className="w-full">
                      View Applications
                    </Button>
                  </div>
                </div>

                <div className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm bg-white dark:bg-slate-950">
                  <h3 className="font-bold text-slate-950 dark:text-white border-b pb-3 mb-4">Recent Applicants</h3>
                  <div className="space-y-3">
                    {recentApps.length > 0 ? (
                      recentApps.map((item) => (
                        <div key={item._id} className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3.5 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{item.student?.name || item.fullName || "Candidate"}</p>
                            <p className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold mt-0.5">{item.job?.title}</p>
                          </div>
                          <Button to="/employer/applicants" variant="secondary" className="px-3 py-1.5 min-h-8 text-[11px] rounded-lg">
                            Review
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-4">No recent applications.</p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </Container>
    </motion.section>
  );
};

export default EmployerDashboard;

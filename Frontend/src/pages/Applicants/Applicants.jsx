import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Phone, Mail, User, Check, X, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";
import { applicationsApi, resumesApi } from "../../services/api";

const statusMapping = {
  "pending": "Pending",
  "reviewing": "Reviewed",
  "shortlisted": "Shortlisted",
  "interview_scheduled": "Interview Scheduled",
  "accepted": "Selected",
  "rejected": "Rejected",
};

const statusesList = [
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "accepted", label: "Selected" },
  { value: "rejected", label: "Rejected" },
];

const Applicants = () => {
  const [searchParams] = useSearchParams();
  const filterJobId = searchParams.get("jobId");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Cache to map student ID -> Array of Skills
  const [skillsCache, setSkillsCache] = useState({});

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const { data } = await applicationsApi.employer();
      const list = Array.isArray(data) ? data : [];
      
      // Filter by jobId if parameter is passed in URL
      const filtered = filterJobId 
        ? list.filter((app) => (app.job?._id || app.job) === filterJobId)
        : list;

      setApplications(filtered);
    } catch (error) {
      toast.error("Failed to load applicants from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [filterJobId]);

  // Dynamically load applicant skills from their primary resume
  useEffect(() => {
    const fetchCandidateSkills = async () => {
      const studentIds = [...new Set(applications.map((app) => app.student?._id).filter(Boolean))];
      
      studentIds.forEach(async (studentId) => {
        if (skillsCache[studentId]) return; // already loaded
        
        try {
          const { data } = await resumesApi.list(studentId);
          const list = data.resumes || [];
          const primary = list.find((r) => r.isPrimary) || list[0];
          const skills = primary?.data?.skills || [];
          setSkillsCache((prev) => ({ ...prev, [studentId]: skills }));
        } catch (err) {
          console.error("Could not fetch skills for candidate ID:", studentId);
        }
      });
    };

    if (applications.length > 0) {
      fetchCandidateSkills();
    }
  }, [applications]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      await applicationsApi.updateStatus(applicationId, newStatus);
      toast.success(`Applicant status set to: ${statusMapping[newStatus] || newStatus}`);
      loadApplicants();
    } catch (error) {
      toast.error("Failed to update status on server");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <Container>
        <SectionHeader 
          eyebrow="Application Tracking" 
          title="Manage Applicants" 
          description="Review candidate details, view skills tags loaded from profiles, and progress applicant stages." 
        />

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium">Retrieving candidates...</div>
        ) : applications.length > 0 ? (
          <div className="grid gap-5">
            {applications.map((app) => {
              const studentId = app.student?._id;
              const candidateSkills = skillsCache[studentId] || [];
              const resumeUrl = app.resume || app.student?.resume;
              const formattedResumeUrl = resumeUrl && !resumeUrl.startsWith("data:")
                ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${resumeUrl}`
                : resumeUrl;

              return (
                <article 
                  key={app._id} 
                  className="glass grid gap-5 rounded-3xl p-6 border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950 shadow-sm md:grid-cols-[1fr_auto] md:items-center hover:border-teal-300 dark:hover:border-teal-500/20 hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    {/* Name & Job Title */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                        <User size={18} className="text-teal-700 dark:text-teal-300" />
                        {app.fullName || app.student?.name || "Candidate"} 
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 normal-case">
                          applied for
                        </span>
                        <span className="text-teal-700 dark:text-teal-400 font-black">
                          {app.job?.title || "Job Listing"}
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Mail size={14} /> {app.email || app.student?.email}</span>
                        {(app.phone || app.student?.phone) && (
                          <span className="flex items-center gap-1.5"><Phone size={14} /> {app.phone || app.student?.phone}</span>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Skills Tags */}
                    <div>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Applicant Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {candidateSkills.length > 0 ? (
                          candidateSkills.map((skill) => (
                            <Badge key={skill} tone="slate">{skill}</Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No skills details found in database</span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Stage:</span>
                      <Badge 
                        tone={
                          app.status === "accepted" ? "teal" : 
                          app.status === "rejected" ? "rose" : 
                          app.status === "pending" ? "amber" : "cyan"
                        }
                      >
                        {statusMapping[app.status] || app.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2.5 items-stretch sm:items-center">
                    {formattedResumeUrl ? (
                      <a 
                        href={formattedResumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-white shrink-0 shadow-sm"
                      >
                        <FileText size={16} /> Resume File
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic py-2">No resume uploaded</span>
                    )}

                    {/* Status Selector Dropdown */}
                    <div className="flex items-center gap-2 shrink-0">
                      <select 
                        value={app.status} 
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-900 outline-none font-semibold text-slate-700 dark:text-slate-200"
                      >
                        {statusesList.map((st) => (
                          <option key={st.value} value={st.value}>{st.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Acceptance Buttons */}
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => handleUpdateStatus(app._id, "accepted")}
                        disabled={updatingId === app._id || app.status === "accepted"}
                        className="p-3 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 rounded-xl hover:bg-teal-700 hover:text-white transition-all disabled:opacity-30 shrink-0"
                        title="Accept Candidate"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(app._id, "rejected")}
                        disabled={updatingId === app._id || app.status === "rejected"}
                        className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl hover:bg-rose-700 hover:text-white transition-all disabled:opacity-30 shrink-0"
                        title="Reject Candidate"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass p-12 text-center rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">No Applicants Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
              {filterJobId ? "No candidate has applied for this specific job listing." : "You have not received any job application submissions yet."}
            </p>
            <Button to="/employer/jobs" className="mt-6">Manage Jobs</Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Applicants;

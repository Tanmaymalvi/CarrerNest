import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Briefcase, Edit3, Eye, Power, PowerOff, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";
import { jobsApi, applicationsApi } from "../../services/api";

const jobCategories = [
  "IT & Software",
  "Data Science",
  "Human Resources",
  "Finance",
  "Marketing",
  "Management",
  "Design",
];

const ManageJobs = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Editing Modal States
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editType, setEditType] = useState("Full-time");
  const [editCategory, setEditCategory] = useState("IT & Software");
  const [editLastDate, setEditLastDate] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPositions, setEditPositions] = useState(1);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      // Fetch all jobs
      const { data: allJobs } = await jobsApi.list({ status: "all" });
      const jobList = Array.isArray(allJobs) ? allJobs : allJobs?.jobs || [];
      const myJobs = jobList.filter((job) => job.employer === userId || job.employer?._id === userId);
      setJobs(myJobs);

      // Fetch all applications to count them
      const { data: allApps } = await applicationsApi.employer();
      setApplications(Array.isArray(allApps) ? allApps : []);
    } catch (error) {
      toast.error("Failed to load jobs list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Count helper
  const getAppCount = (jobId) => {
    return applications.filter((app) => (app.job?._id || app.job) === jobId).length;
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "active" ? "paused" : "active";
    try {
      await jobsApi.update(job._id, { status: newStatus });
      toast.success(newStatus === "active" ? "Job opened / published!" : "Job closed / paused!");
      loadData();
    } catch (error) {
      toast.error("Failed to update job status");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to permanently delete this job listing?")) return;
    try {
      await jobsApi.delete(jobId);
      toast.success("Job listing deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setEditTitle(job.title || "");
    setEditLocation(job.location || "");
    setEditSalary(job.salary || "");
    setEditExperience(job.experience || "");
    setEditSkills(Array.isArray(job.skills) ? job.skills.join(", ") : "");
    setEditType(job.type || "Full-time");
    setEditPositions(job.openPositions || 1);

    // Extract category & last date from description
    const descText = job.description || "";
    const catMatch = descText.match(/\[Category:\s*([^\]]+)\]/);
    const dateMatch = descText.match(/\[Apply By:\s*([^\]]+)\]/);

    setEditCategory(catMatch ? catMatch[1] : "IT & Software");
    setEditLastDate(dateMatch ? dateMatch[1] : "");

    // Clean up clean description
    const cleanDesc = descText
      .replace(/\[Category:\s*[^\]]+\]/g, "")
      .replace(/\[Apply By:\s*[^\]]+\]/g, "")
      .trim();
    setEditDesc(cleanDesc);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editLocation || !editDesc) {
      toast.error("Title, Location, and Description are required");
      return;
    }

    try {
      setSavingEdit(true);
      const skillsArray = editSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      const serializedDescription = `[Category: ${editCategory}] [Apply By: ${editLastDate}]\n\n${editDesc}`;

      const payload = {
        title: editTitle,
        location: editLocation,
        salary: editSalary,
        experience: editExperience,
        skills: skillsArray,
        type: editType,
        openPositions: parseInt(editPositions) || 1,
        description: serializedDescription,
      };

      await jobsApi.update(editingJob._id, payload);
      toast.success("Job updated successfully!");
      setEditingJob(null);
      loadData();
    } catch (error) {
      toast.error("Failed to update job details");
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter & Search Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills || []).join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && job.status === "active") ||
      (statusFilter === "paused" && job.status === "paused") ||
      (statusFilter === "pending" && job.status === "pending");

    return matchesSearch && matchesStatus;
  });

  if (!user || user.role !== "employer") {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Employer Access Only</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Log in as an Employer to view and manage your posted jobs.</p>
            <Button to="/login" className="mt-6">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <Container>
        <SectionHeader 
          eyebrow="My Job Postings" 
          title="Manage Jobs" 
          description="View active postings, close filled listings, edit requirements, and review incoming candidate counts." 
        />

        {/* Search & Filter Bar */}
        <div className="glass rounded-2xl p-4 mb-6 border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-950 shadow-sm">
          <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 px-4 w-full border border-slate-100 dark:border-white/5">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm outline-none text-slate-900 dark:text-slate-100" 
              placeholder="Search by Job Title or Skills..." 
            />
          </label>
          
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-900 outline-none w-full md:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Closed / Paused</option>
              <option value="pending">Pending Admin</option>
            </select>
            <Button to="/employer/post-job" className="whitespace-nowrap px-4 py-2 min-h-11 text-xs">
              Post a Job
            </Button>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Loading jobs...</div>
        ) : filteredJobs.length > 0 ? (
          <div className="glass overflow-hidden rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950 shadow-sm">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_auto] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 md:grid dark:border-white/10">
              <span>Job Role Details</span>
              <span>Applications</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            
            {filteredJobs.map((job) => (
              <div key={job._id} className="grid gap-3 border-b border-slate-100 px-6 py-5 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center dark:border-white/10">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-white text-base">{job.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    {job.location} &middot; {job.type} &middot; {job.salary || "Not Specified"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-3 py-1.5 rounded-full inline-block">
                    {getAppCount(job._id)} Applicants
                  </span>
                </div>
                <div>
                  <Badge tone={job.status === "active" ? "teal" : job.status === "paused" ? "slate" : "amber"}>
                    {job.status === "active" ? "Active / Open" : job.status === "paused" ? "Closed / Paused" : "Pending moderation"}
                  </Badge>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    onClick={() => navigate(`/employer/applicants?jobId=${job._id}`)} 
                    variant="secondary" 
                    className="px-3 py-2 min-h-10 text-xs rounded-xl"
                  >
                    <Eye size={15} /> Candidates
                  </Button>
                  <Button 
                    onClick={() => openEditModal(job)} 
                    variant="secondary" 
                    className="px-3 py-2 min-h-10 text-xs rounded-xl"
                  >
                    <Edit3 size={15} /> Edit
                  </Button>
                  <Button 
                    onClick={() => handleToggleStatus(job)} 
                    variant="secondary" 
                    className={`px-3 py-2 min-h-10 text-xs rounded-xl ${job.status === "active" ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}`}
                  >
                    {job.status === "active" ? <PowerOff size={15} /> : <Power size={15} />}
                  </Button>
                  <Button 
                    onClick={() => handleDeleteJob(job._id)} 
                    variant="secondary" 
                    className="px-3 py-2 min-h-10 text-xs rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-12 text-center rounded-3xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">No Jobs Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Post a job listing to start receiving applications.</p>
            <Button to="/employer/post-job" className="mt-6">Post a Job Now</Button>
          </div>
        )}

        {/* Editing Modal Overlay */}
        {editingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="glass rounded-3xl max-w-2xl w-full p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setEditingJob(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-6">Edit Job Posting</h3>
              
              <form onSubmit={handleSaveEdit} className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Job Title</span>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 text-sm outline-none" required />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Location</span>
                  <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 text-sm outline-none" required />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Salary Range</span>
                  <input type="text" value={editSalary} onChange={(e) => setEditSalary(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 text-sm outline-none" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Experience Required</span>
                  <input type="text" value={editExperience} onChange={(e) => setEditExperience(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 text-sm outline-none" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Job Type</span>
                  <select value={editType} onChange={(e) => setEditType(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-2 text-sm outline-none">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Job Category</span>
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-2 text-sm outline-none">
                    {jobCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-600">Last Date to Apply</span>
                  <input type="date" value={editLastDate} onChange={(e) => setEditLastDate(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 text-sm outline-none" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Skills Required (Comma separated)</span>
                  <input type="text" value={editSkills} onChange={(e) => setEditSkills(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 text-sm outline-none" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-600">Job Description</span>
                  <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl bg-slate-50 dark:bg-white/5 border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" required />
                </label>
                
                <div className="sm:col-span-2 flex gap-3 mt-4">
                  <Button type="submit" disabled={savingEdit} className="flex-1 shadow-teal-500/10">
                    {savingEdit ? "Saving..." : "Save Job Changes"}
                  </Button>
                  <Button type="button" onClick={() => setEditingJob(null)} variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </Container>
    </section>
  );
};

export default ManageJobs;

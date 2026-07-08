import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Briefcase, Plus, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Container, SectionHeader } from "../../components/ui";
import { jobsApi, companiesApi } from "../../services/api";

const jobCategories = [
  "IT & Software",
  "Data Science",
  "Human Resources",
  "Finance",
  "Marketing",
  "Management",
  "Design",
];

const PostJob = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Form Fields
  const [title, setTitle] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [category, setCategory] = useState("IT & Software");
  const [lastDate, setLastDate] = useState("");
  const [description, setDescription] = useState("");
  const [openPositions, setOpenPositions] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      if (!userId) return;
      try {
        const { data } = await companiesApi.list();
        const list = Array.isArray(data) ? data : [];
        // Filter companies owned by this employer
        const myCompanies = list.filter(
          (c) => c.owner === userId || c.owner?._id === userId
        );
        setCompanies(myCompanies);
        if (myCompanies.length > 0) {
          setSelectedCompanyId(myCompanies[0]._id);
        }
      } catch (error) {
        toast.error("Failed to load company records");
      } finally {
        setLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, [userId]);

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    if (!title || !selectedCompanyId || !location || !description) {
      toast.error("Job Title, Company, Location, and Description are required");
      return;
    }

    try {
      setSubmitting(true);
      // Split skills by comma
      const skillsArray = skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");

      // Prepend Category and Last Date to description to persist them cleanly in DB
      const serializedDescription = `[Category: ${category}] [Apply By: ${lastDate}]\n\n${description}`;

      const payload = {
        title,
        company: selectedCompanyId,
        location,
        salary,
        experience,
        openPositions: parseInt(openPositions) || 1,
        skills: skillsArray,
        type: jobType,
        description: serializedDescription,
        status: publishStatus, // "active" for publish, "paused" for draft
      };

      await jobsApi.create(payload);
      
      toast.success(
        publishStatus === "active" 
          ? "Job published successfully!" 
          : "Draft saved successfully!"
      );
      navigate("/employer/jobs");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit job listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "employer") {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Employer Access Only</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Log in as an Employer to create and post job openings.</p>
            <Button to="/login" className="mt-6">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  if (loadingCompanies) {
    return (
      <section className="section-pad">
        <Container>
          <div className="text-center py-12 text-slate-500 font-medium">Validating company profiles...</div>
        </Container>
      </section>
    );
  }

  if (companies.length === 0) {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-10 max-w-xl mx-auto border border-amber-200 bg-amber-50/50 text-center dark:border-amber-500/20 dark:bg-amber-950/20">
            <AlertTriangle className="mx-auto text-amber-600 dark:text-amber-400 mb-4" size={48} />
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">No Company Profile Found</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              Before posting a job, you must create a company profile first. This helps candidates identify your brand and logo.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button to="/employer/company" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-amber-600/10">
                Create Company Profile
              </Button>
              <Button to="/employer/dashboard" variant="secondary">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <Container className="max-w-4xl">
        <SectionHeader 
          eyebrow="Publish Job" 
          title="Create a New Job Listing" 
          description="Enter role descriptions, location, categories, skills, and compensation ranges to attract candidate matches." 
        />
        
        <form className="glass grid gap-5 rounded-3xl p-6 sm:grid-cols-2 border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950 shadow-sm">
          
          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Title</span>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" 
              placeholder="e.g. Frontend Developer" 
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Associated Company</span>
            <select 
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-3 text-sm outline-none"
            >
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Location</span>
            <input 
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none" 
              placeholder="e.g. Bengaluru / Remote"
              required
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Salary Range</span>
            <input 
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none" 
              placeholder="e.g. Rs 8 - 12 LPA" 
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Experience Required</span>
            <input 
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none" 
              placeholder="e.g. 1-3 years" 
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills Required (Comma separated)</span>
            <input 
              type="text"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none" 
              placeholder="React, Redux, Tailwind CSS" 
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Type</span>
            <select 
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-3 text-sm outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Category</span>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-3 text-sm outline-none"
            >
              {jobCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Date to Apply</span>
            <input 
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none" 
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Description</span>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-36 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" 
              placeholder="Describe the role, responsibilities, impact, and expected qualification requirements." 
              required
            />
          </label>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              type="button" 
              onClick={(e) => handleSubmit(e, "active")}
              disabled={submitting} 
              className="flex-1 shadow-teal-500/10"
            >
              <Plus size={16} /> {submitting ? "Publishing..." : "Publish Job"}
            </Button>
            <Button 
              type="button" 
              onClick={(e) => handleSubmit(e, "paused")}
              disabled={submitting} 
              variant="secondary"
              className="flex-1"
            >
              <Save size={16} /> {submitting ? "Saving..." : "Save Draft"}
            </Button>
          </div>

        </form>
      </Container>
    </section>
  );
};

export default PostJob;

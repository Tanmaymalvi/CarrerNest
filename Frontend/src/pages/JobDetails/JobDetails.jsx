import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bookmark, Building2, CheckCircle2, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import JobCard from "../../components/JobCard/JobCard";
import { jobs } from "../../data/mockData";
import { Badge, Button, Container } from "../../components/ui";
import { jobsApi, savedJobsApi } from "../../services/api";

import "./JobDetails.css";
const isMongoId = (value) => /^[a-f\d]{24}$/i.test(value || "");
const getCompanyName = (job) => (typeof job.company === "object" ? job.company?.name : job.company) || "Company";
const getCompanyLogo = (job) => job.logo || getCompanyName(job).slice(0, 2).toUpperCase();

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [job, setJob] = useState(() => jobs.find((item) => item.id === id));
  const [loading, setLoading] = useState(isMongoId(id));
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    portfolioLink: "",
    resume: null,
  });

  useEffect(() => {
    const loadJob = async () => {
      if (!isMongoId(id)) {
        setJob(jobs.find((item) => item.id === id) || jobs[0]);
        setLoading(false);
        return;
      }

      try {
        const { data } = await jobsApi.get(id);
        setJob(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Job not found");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const similar = useMemo(() => {
    const currentId = job?._id || job?.id;
    return jobs.filter((item) => item.id !== currentId && item.category === job?.category).slice(0, 2);
  }, [job]);

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    if (user.role !== "student") {
      toast.error("Only students can apply for jobs");
      return;
    }
    if (!isMongoId(id)) {
      toast.success("Demo application submitted");
      navigate("/applied-jobs");
      return;
    }
    setApplicationForm((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
    }));
    setShowApplyModal(true);
  };

  const submitApplication = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append("fullName", applicationForm.fullName);
      payload.append("email", applicationForm.email);
      payload.append("phone", applicationForm.phone);
      payload.append("coverLetter", applicationForm.coverLetter);
      payload.append("portfolioLink", applicationForm.portfolioLink);
      if (applicationForm.resume) payload.append("resume", applicationForm.resume);
      await jobsApi.apply(id, payload);
      toast.success("Application submitted");
      setShowApplyModal(false);
      navigate("/applied-jobs");
    } catch (error) {
      const message = error.response?.data?.message || "Could not apply for this job";
      toast.error(message.includes("duplicate") ? "You already applied for this job" : message);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }
    if (!isMongoId(id)) {
      toast.success("Demo job saved for this session");
      return;
    }

    try {
      await savedJobsApi.save(id, user.id || user._id);
      toast.success("Job saved");
    } catch (error) {
      const message = error.response?.data?.message || "Could not save job";
      message.toLowerCase().includes("already") ? toast("This job is already saved") : toast.error(message);
    }
  };

  if (loading) {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-8 text-center">Loading job details...</div>
        </Container>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Job not found</h1>
            <Button to="/jobs" className="mt-4">Browse jobs</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <article className="glass rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">{getCompanyLogo(job)}</div>
                <div>
                  <Badge>{job.type}</Badge>
                  <h1 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white sm:text-5xl">{job.title}</h1>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{getCompanyName(job)} - {job.location} - {job.mode || job.type}</p>
                </div>
              </div>
              <button onClick={handleSave} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-600 shadow dark:bg-white/10 dark:text-slate-200" aria-label="Save job">
                <Bookmark size={18} />
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 dark:bg-white/10"><p className="text-sm text-slate-500">Salary</p><p className="font-bold">{job.salary}</p></div>
              <div className="rounded-2xl bg-white p-4 dark:bg-white/10"><p className="text-sm text-slate-500">Experience</p><p className="font-bold">{job.experience}</p></div>
              <div className="rounded-2xl bg-white p-4 dark:bg-white/10"><p className="text-sm text-slate-500">Openings</p><p className="font-bold">{job.openPositions || job.applicants || 1}</p></div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Job description</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{job.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {(job.requirements || ["Relevant experience for this role", "Strong communication skills", "Ability to collaborate with teams"]).map((item) => (
                  <li key={item} className="flex gap-3 text-slate-600 dark:text-slate-300"><CheckCircle2 className="mt-1 text-teal-700" size={18} /> {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {(job.skills || []).map((skill) => <Badge key={skill} tone="slate">{skill}</Badge>)}
            </div>
          </article>

          <aside className="space-y-5">
            <div className="glass rounded-3xl p-6">
              <Button onClick={handleApply} className="w-full">Apply now</Button>
              <Button onClick={handleSave} variant="secondary" className="mt-3 w-full">Save job</Button>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold text-slate-950 dark:text-white">Company info</h3>
              <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Building2 size={17} /> {getCompanyName(job)}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><MapPin size={17} /> {job.location}</p>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-950 dark:text-white">Similar jobs</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {(similar.length ? similar : jobs.slice(0, 2)).map((item) => <JobCard key={item.id} job={item} compact />)}
          </div>
        </div>
      </Container>

      {showApplyModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4" role="dialog" aria-modal="true">
          <form onSubmit={submitApplication} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Apply for {job.title}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="text-sm font-semibold">Full Name</span>
                <input value={applicationForm.fullName} onChange={(event) => setApplicationForm({ ...applicationForm, fullName: event.target.value })} required className="mt-2 min-h-11 w-full rounded-xl bg-slate-100 px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <label>
                <span className="text-sm font-semibold">Email</span>
                <input type="email" value={applicationForm.email} onChange={(event) => setApplicationForm({ ...applicationForm, email: event.target.value })} required className="mt-2 min-h-11 w-full rounded-xl bg-slate-100 px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <label>
                <span className="text-sm font-semibold">Phone</span>
                <input value={applicationForm.phone} onChange={(event) => setApplicationForm({ ...applicationForm, phone: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl bg-slate-100 px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <label>
                <span className="text-sm font-semibold">Resume Upload</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setApplicationForm({ ...applicationForm, resume: event.target.files?.[0] })} className="mt-2 min-h-11 w-full rounded-xl bg-slate-100 px-4 py-2 text-sm dark:bg-white/10" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold">Portfolio Link</span>
                <input value={applicationForm.portfolioLink} onChange={(event) => setApplicationForm({ ...applicationForm, portfolioLink: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl bg-slate-100 px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold">Cover Letter</span>
                <textarea value={applicationForm.coverLetter} onChange={(event) => setApplicationForm({ ...applicationForm, coverLetter: event.target.value })} rows={4} className="mt-2 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm outline-none dark:bg-white/10" />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="flex-1">Submit application</Button>
              <Button type="button" onClick={() => setShowApplyModal(false)} variant="secondary" className="flex-1">Cancel</Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
};

export default JobDetails;

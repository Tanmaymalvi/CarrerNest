import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserMinus,
  UsersRound,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { adminApi, companiesApi, jobsApi, interviewQuestionsApi, testsApi } from "../../services/api";
import { Badge, Button, Container, SectionHeader, StatCard } from "../../components/ui";

import "./Admin.css";

const Admin = () => {
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, companies: 0, jobs: 0, applications: 0 });
  const [usersList, setUsersList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [jobsList, setJobsList] = useState([]);

  // Search filters
  const [userSearch, setUserSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  // Interview questions panel
  const [iqList, setIqList] = useState([]);
  const [iqLoading, setIqLoading] = useState(false);
  const [iqCategoryFilter, setIqCategoryFilter] = useState("all");
  const [iqSearch, setIqSearch] = useState("");
  const [iqForm, setIqForm] = useState({ category: "hr", question: "", answer: "", difficulty: "Medium", tags: "", company: "", role: "" });
  const [iqEditId, setIqEditId] = useState(null);
  const [iqSubmitting, setIqSubmitting] = useState(false);
  const [showIqForm, setShowIqForm] = useState(false);

  // Online Assessments Panel States
  const [adminTests, setAdminTests] = useState([]);
  const [adminQuestions, setAdminQuestions] = useState([]);
  const [adminResults, setAdminResults] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  // Forms
  const [showTestForm, setShowTestForm] = useState(false);
  const [testForm, setTestForm] = useState({ title: "", category: "hr", description: "", difficulty: "Medium", duration: 30, totalQuestions: 20, passingMarks: 12 });
  const [testEditId, setTestEditId] = useState(null);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({ testId: "", category: "hr", question: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "Medium", marks: 1 });
  const [questionEditId, setQuestionEditId] = useState(null);

  const [aqFilterTest, setAqFilterTest] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, companiesRes, jobsRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getUsers(),
        companiesApi.list(),
        jobsApi.list({ status: "all" }),
      ]);

      setStats(statsRes.data || { users: 0, companies: 0, jobs: 0, applications: 0 });
      setUsersList(Array.isArray(usersRes.data) ? usersRes.data : []);
      setCompaniesList(Array.isArray(companiesRes.data) ? companiesRes.data : []);
      setJobsList(Array.isArray(jobsRes.data) ? jobsRes.data : []);
    } catch (error) {
      console.error("Admin load error:", error);
      toast.error("Could not fetch admin data from backend.");
    } finally {
      setLoading(false);
    }
  };

  const loadIqData = async () => {
    try {
      setIqLoading(true);
      const { data } = await interviewQuestionsApi.getAll();
      setIqList(data.questions || []);
    } catch {
      toast.error("Could not load interview questions.");
    } finally {
      setIqLoading(false);
    }
  };

  const loadAssessmentsData = async () => {
    try {
      setLoadingAssessments(true);
      const { data } = await testsApi.list();
      setAdminTests(data.tests || []);
    } catch {
      toast.error("Could not fetch assessments.");
    } finally {
      setLoadingAssessments(false);
    }
  };

  const loadQuestionsData = async (testId = "all") => {
    try {
      setLoadingQuestions(true);
      const params = {};
      if (testId && testId !== "all") params.testId = testId;
      const { data } = await testsApi.questionsList(params);
      setAdminQuestions(data.questions || []);
    } catch {
      toast.error("Could not fetch assessment questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadResultsData = async () => {
    try {
      setLoadingResults(true);
      const { data } = await testsApi.allResults();
      setAdminResults(data.results || []);
    } catch {
      toast.error("Could not fetch assessment results.");
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadData();
      loadIqData();
      loadAssessmentsData();
      loadQuestionsData();
      loadResultsData();
    }
  }, [user]);

  // User Actions
  const handleToggleUserStatus = async (userId) => {
    try {
      const { data } = await adminApi.toggleUserStatus(userId);
      setUsersList(usersList.map((u) => (u._id === userId ? { ...u, status: data.status } : u)));
      toast.success(`User status updated to ${data.status}`);
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await adminApi.deleteUser(userId);
      setUsersList(usersList.filter((u) => u._id !== userId));
      setStats((prev) => ({ ...prev, users: Math.max(0, prev.users - 1) }));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Company Actions
  const handleUpdateCompanyStatus = async (companyId, newStatus) => {
    try {
      const { data } = await adminApi.updateCompany(companyId, { status: newStatus });
      setCompaniesList(companiesList.map((c) => (c._id === companyId ? { ...c, status: data.status } : c)));
      toast.success(`Company status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update company status");
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await adminApi.deleteCompany(companyId);
      setCompaniesList(companiesList.filter((c) => c._id !== companyId));
      setStats((prev) => ({ ...prev, companies: Math.max(0, prev.companies - 1) }));
      toast.success("Company deleted successfully");
    } catch {
      toast.error("Failed to delete company");
    }
  };

  // Job Actions
  const handleUpdateJobStatus = async (jobId, newStatus) => {
    try {
      const { data } = await adminApi.updateJob(jobId, { status: newStatus });
      setJobsList(jobsList.map((j) => (j._id === jobId ? { ...j, status: data.status } : j)));
      toast.success(`Job status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update job status");
    }
  };

  const handleToggleJobFeatured = async (jobId, currentFeatured) => {
    try {
      const { data } = await adminApi.updateJob(jobId, { featured: !currentFeatured });
      setJobsList(jobsList.map((j) => (j._id === jobId ? { ...j, featured: data.featured } : j)));
      toast.success(data.featured ? "Job added to Featured list" : "Job removed from Featured list");
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to remove this job posting?")) return;
    try {
      await adminApi.deleteJob(jobId);
      setJobsList(jobsList.filter((j) => j._id !== jobId));
      setStats((prev) => ({ ...prev, jobs: Math.max(0, prev.jobs - 1) }));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  // Interview Question CRUD
  const handleIqSubmit = async (e) => {
    e.preventDefault();
    if (!iqForm.question.trim() || !iqForm.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    try {
      setIqSubmitting(true);
      const payload = { ...iqForm, tags: iqForm.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (iqEditId) {
        const { data } = await interviewQuestionsApi.update(iqEditId, payload);
        setIqList((prev) => prev.map((q) => q._id === iqEditId ? data.question : q));
        toast.success("Question updated");
      } else {
        const { data } = await interviewQuestionsApi.create(payload);
        setIqList((prev) => [data.question, ...prev]);
        toast.success("Question added");
      }
      setIqForm({ category: "hr", question: "", answer: "", difficulty: "Medium", tags: "", company: "", role: "" });
      setIqEditId(null);
      setShowIqForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save question");
    } finally {
      setIqSubmitting(false);
    }
  };

  const handleIqEdit = (q) => {
    setIqForm({ category: q.category, question: q.question, answer: q.answer, difficulty: q.difficulty || "Medium", tags: (q.tags || []).join(", "), company: q.company || "", role: q.role || "" });
    setIqEditId(q._id);
    setShowIqForm(true);
  };

  const handleIqDelete = async (id) => {
    if (!window.confirm("Delete this interview question?")) return;
    try {
      await interviewQuestionsApi.remove(id);
      setIqList((prev) => prev.filter((q) => q._id !== id));
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete question");
    }
  };

  // Assessment Tests CRUD
  const handleTestSubmit = async (e) => {
    e.preventDefault();
    if (!testForm.title.trim() || !testForm.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }
    try {
      if (testEditId) {
        const { data } = await testsApi.update(testEditId, testForm);
        if (data.success) {
          setAdminTests((prev) => prev.map((t) => t._id === testEditId ? data.test : t));
          toast.success("Assessment test updated.");
        }
      } else {
        const { data } = await testsApi.create(testForm);
        if (data.success) {
          setAdminTests((prev) => [data.test, ...prev]);
          toast.success("Assessment test created.");
        }
      }
      setTestForm({ title: "", category: "hr", description: "", difficulty: "Medium", duration: 30, totalQuestions: 20, passingMarks: 12 });
      setTestEditId(null);
      setShowTestForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save test.");
    }
  };

  const handleTestEdit = (t) => {
    setTestForm({
      title: t.title,
      category: t.category,
      description: t.description,
      difficulty: t.difficulty,
      duration: t.duration,
      totalQuestions: t.totalQuestions,
      passingMarks: t.passingMarks,
    });
    setTestEditId(t._id);
    setShowTestForm(true);
  };

  const handleTestDelete = async (testId) => {
    if (!window.confirm("Delete this test and all its questions? This action cannot be undone.")) return;
    try {
      const { data } = await testsApi.remove(testId);
      if (data.success) {
        setAdminTests((prev) => prev.filter((t) => t._id !== testId));
        toast.success("Test deleted successfully.");
      }
    } catch {
      toast.error("Failed to delete test.");
    }
  };

  // Assessment Questions CRUD
  const handleAqSubmit = async (e) => {
    e.preventDefault();
    if (!questionForm.testId) {
      toast.error("Please select a test first.");
      return;
    }
    if (!questionForm.question.trim() || !questionForm.correctAnswer.trim()) {
      toast.error("Question and correct answer are required.");
      return;
    }
    if (questionForm.options.some(opt => !opt.trim())) {
      toast.error("Please fill in all 4 MCQ options.");
      return;
    }

    try {
      if (questionEditId) {
        const { data } = await testsApi.updateQuestion(questionEditId, questionForm);
        if (data.success) {
          setAdminQuestions((prev) => prev.map((q) => q._id === questionEditId ? data.question : q));
          toast.success("Question updated.");
        }
      } else {
        const { data } = await testsApi.createQuestion(questionForm);
        if (data.success) {
          setAdminQuestions((prev) => [data.question, ...prev]);
          toast.success("Question created.");
        }
      }
      setQuestionForm((prev) => ({
        ...prev,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "Medium",
        marks: 1
      }));
      setQuestionEditId(null);
      setShowQuestionForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save question.");
    }
  };

  const handleAqEdit = (q) => {
    setQuestionForm({
      testId: q.testId?._id || q.testId || "",
      category: q.category,
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty || "Medium",
      marks: q.marks || 1,
    });
    setQuestionEditId(q._id);
    setShowQuestionForm(true);
  };

  const handleAqDelete = async (qId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      const { data } = await testsApi.deleteQuestion(qId);
      if (data.success) {
        setAdminQuestions((prev) => prev.filter((q) => q._id !== qId));
        toast.success("Question deleted.");
      }
    } catch {
      toast.error("Failed to delete question.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass mx-auto max-w-lg rounded-3xl p-12 text-center">
            <ShieldAlert size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Access Denied</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Only authorized administrators can access this system management dashboard.
            </p>
            <Button to="/login" className="mt-6">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCompanies = companiesList.filter((c) =>
    c.name?.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredJobs = jobsList.filter(
    (j) =>
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      (j.company?.name || "").toLowerCase().includes(jobSearch.toLowerCase())
  );

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen"
    >
      <Container>
        <SectionHeader
          eyebrow="Admin dashboard"
          title="Moderate the CareerNest platform"
          description="Manage users, verify companies, approve jobs, and monitor marketplace health."
          action={
            <Button onClick={loadData} variant="secondary">
              Refresh Data
            </Button>
          }
        />

        {loading ? (
          <div className="py-20 text-center font-medium text-slate-500">
            Loading system moderation dashboard...
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={UsersRound} value={stats.users} label="Registered users" />
              <StatCard icon={Building2} value={stats.companies} label="Companies" />
              <StatCard icon={BriefcaseBusiness} value={stats.jobs} label="Job postings" />
              <StatCard icon={BarChart3} value={stats.applications} label="Applications submitted" />
            </div>

            {/* Management Panels */}
            <div className="mt-8 grid gap-8 xl:grid-cols-3">
              
              {/* Users Management */}
              <div className="glass flex flex-col rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">Users management</h2>
                  <Badge tone="slate">{filteredUsers.length} total</Badge>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="mb-4 min-h-10 w-full rounded-xl bg-white px-3 text-xs outline-none border border-slate-100 dark:border-white/5 dark:bg-white/5"
                />
                <div className="mt-2 space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((item) => (
                      <div key={item._id} className="rounded-2xl bg-white/50 p-4 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-500/20 transition-all">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate">
                            <p className="font-bold truncate text-sm">{item.name}</p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{item.email}</p>
                          </div>
                          <Badge tone={item.status === "active" ? "teal" : "rose"}>
                            {item.status === "active" ? "Active" : "Suspended"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                          {item.role}
                        </p>
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 dark:border-white/5 pt-3">
                          <Button
                            variant="secondary"
                            onClick={() => handleToggleUserStatus(item._id)}
                            className="min-h-9 px-3 text-xs flex-1"
                          >
                            {item.status === "active" ? (
                              <>
                                <UserMinus size={13} /> Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} /> Activate
                              </>
                            )}
                          </Button>
                          <button
                            onClick={() => handleDeleteUser(item._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-slate-500 py-6">No users found</p>
                  )}
                </div>
              </div>

              {/* Companies Management */}
              <div className="glass flex flex-col rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">Companies management</h2>
                  <Badge tone="slate">{filteredCompanies.length} total</Badge>
                </div>
                <input
                  type="text"
                  placeholder="Search by company name..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="mb-4 min-h-10 w-full rounded-xl bg-white px-3 text-xs outline-none border border-slate-100 dark:border-white/5 dark:bg-white/5"
                />
                <div className="mt-2 space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp) => (
                      <div key={comp._id} className="rounded-2xl bg-white/50 p-4 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-500/20 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-sm">{comp.name}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{comp.description}</p>
                          </div>
                          <Badge tone={comp.status === "verified" ? "teal" : comp.status === "rejected" ? "rose" : "amber"}>
                            {comp.status === "verified" ? "Verified" : comp.status === "rejected" ? "Rejected" : "Pending"}
                          </Badge>
                        </div>
                        {comp.website && (
                          <a href={comp.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-teal-600 hover:underline">
                            Visit Website
                          </a>
                        )}
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 dark:border-white/5 pt-3">
                          {comp.status !== "verified" && (
                            <Button
                              onClick={() => handleUpdateCompanyStatus(comp._id, "verified")}
                              className="min-h-9 px-3 text-xs flex-1 bg-teal-600 hover:bg-teal-700"
                            >
                              <ShieldCheck size={13} /> Verify
                            </Button>
                          )}
                          {comp.status !== "rejected" && (
                            <Button
                              variant="secondary"
                              onClick={() => handleUpdateCompanyStatus(comp._id, "rejected")}
                              className="min-h-9 px-3 text-xs flex-1"
                            >
                              Reject
                            </Button>
                          )}
                          <button
                            onClick={() => handleDeleteCompany(comp._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                            title="Delete Company"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-slate-500 py-6">No companies found</p>
                  )}
                </div>
              </div>

              {/* Jobs Management */}
              <div className="glass flex flex-col rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">Jobs management</h2>
                  <Badge tone="slate">{filteredJobs.length} total</Badge>
                </div>
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="mb-4 min-h-10 w-full rounded-xl bg-white px-3 text-xs outline-none border border-slate-100 dark:border-white/5 dark:bg-white/5"
                />
                <div className="mt-2 space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div key={job._id} className="rounded-2xl bg-white/50 p-4 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-500/20 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-sm">{job.title}</p>
                              <button
                                onClick={() => handleToggleJobFeatured(job._id, job.featured)}
                                className={`p-0.5 rounded-full transition-all ${
                                  job.featured ? "text-amber-500 hover:text-amber-600" : "text-slate-300 hover:text-slate-400"
                                }`}
                                title={job.featured ? "Unfeature job" : "Feature job"}
                              >
                                <Star size={14} fill={job.featured ? "currentColor" : "none"} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{job.company?.name || "Company"}</p>
                          </div>
                          <Badge tone={job.status === "active" ? "teal" : job.status === "rejected" ? "rose" : "amber"}>
                            {job.status === "active" ? "Active" : job.status === "rejected" ? "Rejected" : "Pending"}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 dark:border-white/5 pt-3">
                          {job.status !== "active" && (
                            <Button
                              onClick={() => handleUpdateJobStatus(job._id, "active")}
                              className="min-h-9 px-3 text-xs flex-1 bg-teal-600 hover:bg-teal-700"
                            >
                              <Check size={13} /> Approve
                            </Button>
                          )}
                          {job.status !== "rejected" && (
                            <Button
                              variant="secondary"
                              onClick={() => handleUpdateJobStatus(job._id, "rejected")}
                              className="min-h-9 px-3 text-xs flex-1"
                            >
                              Reject
                            </Button>
                          )}
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                            title="Delete Job"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-slate-500 py-6">No jobs found</p>
                  )}
                </div>
              </div>

            </div>

            {/* Interview Questions Management */}
            <div className="mt-8 glass rounded-3xl p-6 border border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Interview Questions</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={iqCategoryFilter}
                    onChange={(e) => setIqCategoryFilter(e.target.value)}
                    className="min-h-9 rounded-xl bg-white px-3 text-xs outline-none border border-slate-100 dark:border-white/5 dark:bg-white/5"
                  >
                    <option value="all">All Categories</option>
                    <option value="hr">HR</option>
                    <option value="technical">Technical</option>
                    <option value="aptitude">Aptitude</option>
                    <option value="experience">Experience</option>
                  </select>
                  <Button onClick={() => { setIqEditId(null); setIqForm({ category: "hr", question: "", answer: "", difficulty: "Medium", tags: "", company: "", role: "" }); setShowIqForm(true); }}>
                    <Plus size={14} /> Add Question
                  </Button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Search questions..."
                value={iqSearch}
                onChange={(e) => setIqSearch(e.target.value)}
                className="mb-4 min-h-10 w-full max-w-sm rounded-xl bg-white px-3 text-xs outline-none border border-slate-100 dark:border-white/5 dark:bg-white/5"
              />

              {/* Add / Edit Form */}
              {showIqForm && (
                <form onSubmit={handleIqSubmit} className="mb-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 space-y-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{iqEditId ? "Edit Question" : "Add New Question"}</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <select name="category" value={iqForm.category} onChange={(e) => setIqForm({ ...iqForm, category: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500">
                      <option value="hr">HR</option>
                      <option value="technical">Technical</option>
                      <option value="aptitude">Aptitude</option>
                      <option value="experience">Experience</option>
                    </select>
                    <select name="difficulty" value={iqForm.difficulty} onChange={(e) => setIqForm({ ...iqForm, difficulty: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500">
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                    <input placeholder="Tags (comma-separated)" value={iqForm.tags} onChange={(e) => setIqForm({ ...iqForm, tags: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input placeholder="Company (optional)" value={iqForm.company} onChange={(e) => setIqForm({ ...iqForm, company: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" />
                    <input placeholder="Role (optional)" value={iqForm.role} onChange={(e) => setIqForm({ ...iqForm, role: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" />
                  </div>
                  <textarea required placeholder="Question *" value={iqForm.question} onChange={(e) => setIqForm({ ...iqForm, question: e.target.value })} rows={2} className="min-h-14 w-full rounded-xl bg-white dark:bg-white/10 px-3 py-2 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" />
                  <textarea required placeholder="Answer *" value={iqForm.answer} onChange={(e) => setIqForm({ ...iqForm, answer: e.target.value })} rows={4} className="min-h-24 w-full rounded-xl bg-white dark:bg-white/10 px-3 py-2 text-xs border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" />
                  <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="secondary" onClick={() => { setShowIqForm(false); setIqEditId(null); }}>Cancel</Button>
                    <Button type="submit" disabled={iqSubmitting}>{iqSubmitting ? "Saving..." : iqEditId ? "Update" : "Add"}</Button>
                  </div>
                </form>
              )}

              {iqLoading ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading questions...</div>
              ) : (
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {iqList
                    .filter((q) => iqCategoryFilter === "all" || q.category === iqCategoryFilter)
                    .filter((q) => !iqSearch || q.question.toLowerCase().includes(iqSearch.toLowerCase()))
                    .map((q) => (
                      <div key={q._id} className="rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 hover:border-teal-300 dark:hover:border-teal-500/20 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <Badge tone="teal">{q.category}</Badge>
                              <Badge tone={q.difficulty === "Easy" ? "teal" : q.difficulty === "Hard" ? "rose" : "amber"}>{q.difficulty}</Badge>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-white line-clamp-2">{q.question}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleIqEdit(q)} className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl transition-all" title="Edit"><Check size={14} /></button>
                            <button onClick={() => handleIqDelete(q._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {iqList.filter((q) => iqCategoryFilter === "all" || q.category === iqCategoryFilter).filter((q) => !iqSearch || q.question.toLowerCase().includes(iqSearch.toLowerCase())).length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-6">No interview questions found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Online Assessments Management Panel */}
            <div className="mt-8 grid gap-8 xl:grid-cols-2">
              
              {/* Part A: Tests list & creator */}
              <div className="glass flex flex-col rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">Assessments</h2>
                  <Button onClick={() => { setTestEditId(null); setTestForm({ title: "", category: "hr", description: "", difficulty: "Medium", duration: 30, totalQuestions: 20, passingMarks: 12 }); setShowTestForm(true); }}>
                    <Plus size={14} /> Add Test
                  </Button>
                </div>

                {showTestForm && (
                  <form onSubmit={handleTestSubmit} className="mb-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 space-y-3">
                    <h3 className="font-bold text-sm">{testEditId ? "Edit Test" : "Create New Test"}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input required placeholder="Test Title *" value={testForm.title} onChange={(e) => setTestForm({ ...testForm, title: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                      <select value={testForm.category} onChange={(e) => setTestForm({ ...testForm, category: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none">
                        <option value="hr">HR Assessment</option>
                        <option value="technical">Technical Assessment</option>
                        <option value="aptitude">Aptitude Assessment</option>
                      </select>
                    </div>
                    <textarea required placeholder="Description *" value={testForm.description} onChange={(e) => setTestForm({ ...testForm, description: e.target.value })} rows={2} className="min-h-14 w-full rounded-xl bg-white dark:bg-white/10 px-3 py-2 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                    <div className="grid gap-3 sm:grid-cols-4">
                      <select value={testForm.difficulty} onChange={(e) => setTestForm({ ...testForm, difficulty: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none">
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                      </select>
                      <input type="number" placeholder="Duration (min)" value={testForm.duration} onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                      <input type="number" placeholder="Total Qs" value={testForm.totalQuestions} onChange={(e) => setTestForm({ ...testForm, totalQuestions: parseInt(e.target.value) })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                      <input type="number" placeholder="Passing Score" value={testForm.passingMarks} onChange={(e) => setTestForm({ ...testForm, passingMarks: parseInt(e.target.value) })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <Button type="button" variant="secondary" onClick={() => { setShowTestForm(false); setTestEditId(null); }}>Cancel</Button>
                      <Button type="submit">{testEditId ? "Update Test" : "Create Test"}</Button>
                    </div>
                  </form>
                )}

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
                  {loadingAssessments ? (
                    <div className="py-6 text-center text-xs text-slate-500">Loading tests...</div>
                  ) : adminTests.map((t) => (
                    <div key={t._id} className="rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm">{t.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t.category.toUpperCase()} • {t.duration} Mins • {t.totalQuestions} Qs</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => handleTestEdit(t)} className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl" title="Edit"><Check size={14} /></button>
                        <button onClick={() => handleTestDelete(t._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B: Assessment Questions list & creator */}
              <div className="glass flex flex-col rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">Assessment MCQs</h2>
                  <div className="flex items-center gap-2">
                    <select value={aqFilterTest} onChange={(e) => { setAqFilterTest(e.target.value); loadQuestionsData(e.target.value); }} className="min-h-9 rounded-xl bg-white px-3 text-xs border border-slate-100 dark:border-white/5 dark:bg-white/5">
                      <option value="all">All Tests</option>
                      {adminTests.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                    </select>
                    <Button onClick={() => { setQuestionEditId(null); setQuestionForm({ testId: adminTests[0]?._id || "", category: "hr", question: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "Medium", marks: 1 }); setShowQuestionForm(true); }}>
                      <Plus size={14} /> Add MCQ
                    </Button>
                  </div>
                </div>

                {showQuestionForm && (
                  <form onSubmit={handleAqSubmit} className="mb-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 space-y-3">
                    <h3 className="font-bold text-sm">{questionEditId ? "Edit MCQ" : "Add MCQ"}</h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <select value={questionForm.testId} onChange={(e) => setQuestionForm({ ...questionForm, testId: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none">
                        <option value="">Select Test *</option>
                        {adminTests.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                      </select>
                      <select value={questionForm.category} onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none">
                        <option value="hr">HR</option>
                        <option value="technical">Technical</option>
                        <option value="aptitude">Aptitude</option>
                      </select>
                      <select value={questionForm.difficulty} onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none">
                        <option>Easy</option><option>Medium</option><option>Hard</option>
                      </select>
                    </div>
                    <textarea required placeholder="Question Text *" value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} rows={2} className="min-h-14 w-full rounded-xl bg-white dark:bg-white/10 px-3 py-2 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      {questionForm.options.map((opt, i) => (
                        <input key={i} required placeholder={`Option ${String.fromCharCode(65 + i)} *`} value={opt} onChange={(e) => {
                          const opts = [...questionForm.options];
                          opts[i] = e.target.value;
                          setQuestionForm({ ...questionForm, options: opts });
                        }} className="min-h-9 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                      ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input required placeholder="Correct Option Text (Must match one option exactly) *" value={questionForm.correctAnswer} onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                      <input type="number" placeholder="Marks" value={questionForm.marks} onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })} className="min-h-10 rounded-xl bg-white dark:bg-white/10 px-3 text-xs border border-slate-100 dark:border-white/5 outline-none" />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <Button type="button" variant="secondary" onClick={() => { setShowQuestionForm(false); setQuestionEditId(null); }}>Cancel</Button>
                      <Button type="submit">Save MCQ</Button>
                    </div>
                  </form>
                )}

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-1">
                  {loadingQuestions ? (
                    <div className="py-6 text-center text-xs text-slate-500">Loading questions...</div>
                  ) : adminQuestions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">No questions found. Add some!</div>
                  ) : adminQuestions.map((q) => (
                    <div key={q._id} className="rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{q.question}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Test: {q.testId?.title || "None"} • Correct: {q.correctAnswer}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => handleAqEdit(q)} className="p-2 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-xl" title="Edit"><Check size={14} /></button>
                        <button onClick={() => handleAqDelete(q._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Logs panel */}
            <div className="mt-8 glass rounded-3xl p-6 border border-slate-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-4">Assessment Submissions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500">
                      <th className="py-3 px-4 font-semibold">User</th>
                      <th className="py-3 px-4 font-semibold">Assessment</th>
                      <th className="py-3 px-4 font-semibold text-center">Score</th>
                      <th className="py-3 px-4 font-semibold text-center">Percentage</th>
                      <th className="py-3 px-4 font-semibold text-center">Status</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingResults ? (
                      <tr><td colSpan="6" className="text-center py-6 text-slate-500">Loading results...</td></tr>
                    ) : adminResults.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-6 text-slate-500">No assessment logs recorded.</td></tr>
                    ) : adminResults.map((r) => (
                      <tr key={r._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all">
                        <td className="py-3 px-4 font-semibold">
                          <p className="text-slate-950 dark:text-white">{r.userId?.name || "Unknown"}</p>
                          <p className="text-[10px] text-slate-500">{r.userId?.email || "Unknown"}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{r.testId?.title || "Assessment"}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-white">{r.score}/20</td>
                        <td className="py-3 px-4 text-center font-bold text-teal-600 dark:text-teal-400">{r.percentage}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "PASSED" ? "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300" : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{new Date(r.submittedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Container>
    </motion.section>
  );
};

export default Admin;

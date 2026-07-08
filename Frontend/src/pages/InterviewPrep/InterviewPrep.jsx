import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Award,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Plus,
  Search,
  ClipboardCopy, // using ClipboardCopy as it is common and represents a sheet/assessment
} from "lucide-react";
import toast from "react-hot-toast";

import { prepApi, interviewQuestionsApi, testsApi } from "../../services/api";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";

import "./InterviewPrep.css";

// ─── Tab map: tab id → backend category ────────────────────────────────────
const TAB_CATEGORY = {
  top: "hr",
  technical: "technical",
  aptitude: "aptitude",
  experiences: "experiences",
};

// ─── Skeleton loader ───────────────────────────────────────────────────────
const QuestionSkeleton = () => (
  <div className="space-y-4 max-w-4xl">
    {[1, 2, 3, 4].map((n) => (
      <div
        key={n}
        className="glass rounded-2xl border border-slate-100 dark:border-white/5 p-5 animate-pulse"
      >
        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-3" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/4" />
      </div>
    ))}
  </div>
);

const ExperienceSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {[1, 2].map((n) => (
      <div
        key={n}
        className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 animate-pulse"
      >
        <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-1/2 mb-3" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-3/4 mb-2" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-full mb-2" />
        <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-5/6" />
      </div>
    ))}
  </div>
);

// ─── Accordion question card ───────────────────────────────────────────────
const QuestionCard = ({ item, isOpen, onToggle, showCategory, categoryTone = "teal" }) => (
  <article className="glass rounded-2xl border border-slate-100 dark:border-white/5 transition-all">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left p-5 font-bold text-slate-900 dark:text-white text-base gap-4"
    >
      <span className="flex flex-col sm:flex-row sm:items-center gap-2">
        {showCategory && item.tags?.[0] && (
          <Badge tone={categoryTone}>{item.tags[0]}</Badge>
        )}
        <span>{item.question}</span>
      </span>
      <span className="flex items-center gap-2 shrink-0">
        {item.difficulty && (
          <Badge
            tone={
              item.difficulty === "Easy" ? "teal" : item.difficulty === "Hard" ? "rose" : "amber"
            }
          >
            {item.difficulty}
          </Badge>
        )}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </span>
    </button>

    {isOpen && (
      <div className="px-5 pb-5 pt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 whitespace-pre-line mt-1">
        {item.answer}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 px-2.5 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )}
  </article>
);

// ─── Main page ─────────────────────────────────────────────────────────────
const InterviewPrep = () => {
  const user = useSelector((state) => state.auth.user);

  const [activeTab, setActiveTab] = useState("top");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  // Questions data per tab (cached to avoid refetching)
  const [tabData, setTabData] = useState({ top: [], technical: [], aptitude: [] });
  const [tabLoading, setTabLoading] = useState({ top: false, technical: false, aptitude: false });

  // Company experiences
  const [experiences, setExperiences] = useState([]);
  const [loadingExp, setLoadingExp] = useState(true);

  // Online Assessments State
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  // Share experience modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    difficulty: "Medium",
    verdict: "Selected",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Search debounce
  const searchTimer = useRef(null);
  const [searchResults, setSearchResults] = useState(null); // null = no active search
  const [searchLoading, setSearchLoading] = useState(false);

  // ── Fetch questions for a tab ──────────────────────────────────────────
  const fetchTab = useCallback(async (tabId) => {
    if (tabId === "experiences") return; // handled separately
    if (tabData[tabId]?.length > 0) return; // already cached

    const category = TAB_CATEGORY[tabId];
    setTabLoading((prev) => ({ ...prev, [tabId]: true }));
    try {
      const { data } = await interviewQuestionsApi.getByCategory(category);
      setTabData((prev) => ({ ...prev, [tabId]: data.questions || [] }));
    } catch {
      toast.error("Could not load interview questions. Please try again.");
    } finally {
      setTabLoading((prev) => ({ ...prev, [tabId]: false }));
    }
  }, [tabData]);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoadingExp(true);
      const { data } = await prepApi.getExperiences();
      setExperiences(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load company experiences.");
    } finally {
      setLoadingExp(false);
    }
  }, []);

  const fetchTests = useCallback(async () => {
    try {
      setLoadingTests(true);
      const { data } = await testsApi.list();
      setTests(data.tests || []);
    } catch {
      toast.error("Could not load assessments.");
    } finally {
      setLoadingTests(false);
    }
  }, []);

  // Load initial tab on mount
  useEffect(() => { fetchTab("top"); }, []); // eslint-disable-line

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "experiences") {
      fetchExperiences();
    } else if (activeTab === "assessments") {
      fetchTests();
    } else {
      fetchTab(activeTab);
    }
    // Clear search when switching tabs
    setSearchQuery("");
    setSearchResults(null);
    setExpandedItems({});
  }, [activeTab]); // eslint-disable-line

  // ── Debounced search ───────────────────────────────────────────────────
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const currentCategory =
          activeTab === "experiences" ? undefined : TAB_CATEGORY[activeTab];
        const { data } = await interviewQuestionsApi.search(searchQuery.trim(), currentCategory);
        setSearchResults(data.questions || []);
      } catch {
        // fall back to client-side filtering silently
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(searchTimer.current);
  }, [searchQuery, activeTab]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const toggleExpand = (id) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const getDifficultyTone = (diff) => {
    if (diff === "Easy") return "teal";
    if (diff === "Hard") return "rose";
    return "amber";
  };

  const getVerdictTone = (verdict) => {
    if (verdict === "Selected") return "teal";
    if (verdict === "Rejected") return "rose";
    return "cyan";
  };

  // Client-side experience filtering
  const filteredExp = experiences.filter((exp) => {
    const q = searchQuery.toLowerCase();
    return (
      exp.companyName?.toLowerCase().includes(q) ||
      exp.role?.toLowerCase().includes(q) ||
      exp.content?.toLowerCase().includes(q)
    );
  });

  // Active questions for non-experience tabs
  const activeQuestions =
    searchResults !== null
      ? searchResults
      : tabData[activeTab] || [];

  // ── Share experience form ──────────────────────────────────────────────
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmitExperience = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Please login to share your experience!"); return; }
    if (!formData.companyName.trim() || !formData.role.trim() || !formData.content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await prepApi.createExperience(formData);
      setExperiences([data, ...experiences]);
      toast.success("Thank you for sharing your experience!");
      setShowModal(false);
      setFormData({ companyName: "", role: "", difficulty: "Medium", verdict: "Selected", content: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit experience");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen"
    >
      <Container>
        <SectionHeader
          eyebrow="Preparation Hub"
          title="Ace Your Next Interview"
          description="Access curated questions, practice quantitative & logical reasoning, and read real interview reviews shared by candidates."
          action={
            activeTab === "experiences" && user ? (
              <Button onClick={() => setShowModal(true)}>
                <Plus size={16} /> Share Experience
              </Button>
            ) : null
          }
        />

        {/* Search Bar */}
        <div className="glass max-w-xl rounded-2xl p-2 mb-8 flex items-center gap-3 border border-slate-100 dark:border-white/5 bg-white/70 backdrop-blur-xl">
          <Search className="text-teal-700 ml-2" size={20} />
          <input
            type="text"
            placeholder="Search questions, companies, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm p-2"
          />
          {searchLoading && (
            <span className="text-xs text-slate-400 mr-2 shrink-0">Searching…</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 overflow-x-auto gap-2 pb-px mb-8 scrollbar-none">
          {[
            { id: "top", label: "Top HR Questions", icon: HelpCircle },
            { id: "technical", label: "Technical Prep", icon: BookOpen },
            { id: "aptitude", label: "Aptitude & Logic", icon: Brain },
            { id: "experiences", label: "Company Experiences", icon: MessageSquare },
            { id: "assessments", label: "Assessments", icon: ClipboardCopy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-teal-700 text-teal-700 dark:text-teal-300 dark:border-teal-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <main className="mt-6">

          {/* HR Questions */}
          {activeTab === "top" && (
            tabLoading.top ? (
              <QuestionSkeleton />
            ) : (
              <div className="space-y-4 max-w-4xl">
                {activeQuestions.length > 0 ? (
                  activeQuestions.map((item) => (
                    <QuestionCard
                      key={item._id}
                      item={item}
                      isOpen={!!expandedItems[item._id]}
                      onToggle={() => toggleExpand(item._id)}
                      showCategory={false}
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-6">No interview questions found.</p>
                )}
              </div>
            )
          )}

          {/* Technical Questions */}
          {activeTab === "technical" && (
            tabLoading.technical ? (
              <QuestionSkeleton />
            ) : (
              <div className="space-y-4 max-w-4xl">
                {activeQuestions.length > 0 ? (
                  activeQuestions.map((item) => (
                    <QuestionCard
                      key={item._id}
                      item={item}
                      isOpen={!!expandedItems[item._id]}
                      onToggle={() => toggleExpand(item._id)}
                      showCategory
                      categoryTone="teal"
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-6">No interview questions found.</p>
                )}
              </div>
            )
          )}

          {/* Aptitude Questions */}
          {activeTab === "aptitude" && (
            tabLoading.aptitude ? (
              <QuestionSkeleton />
            ) : (
              <div className="space-y-4 max-w-4xl">
                {activeQuestions.length > 0 ? (
                  activeQuestions.map((item) => (
                    <QuestionCard
                      key={item._id}
                      item={item}
                      isOpen={!!expandedItems[item._id]}
                      onToggle={() => toggleExpand(item._id)}
                      showCategory
                      categoryTone="cyan"
                    />
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-6">No interview questions found.</p>
                )}
              </div>
            )
          )}

          {/* Company Experiences */}
          {activeTab === "experiences" && (
            <div className="space-y-6">
              {!user && (
                <div className="glass rounded-2xl p-5 mb-6 border border-teal-500/20 bg-teal-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Do you want to share your interview experience? Sign in to your account.
                  </p>
                  <Button to="/login" className="px-4 shrink-0">Sign In</Button>
                </div>
              )}

              {loadingExp ? (
                <ExperienceSkeleton />
              ) : filteredExp.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredExp.map((exp) => (
                    <article
                      key={exp._id}
                      className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">
                              {exp.companyName}
                            </h3>
                            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300 mt-0.5">
                              {exp.role}
                            </p>
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            <Badge tone={getDifficultyTone(exp.difficulty)}>{exp.difficulty}</Badge>
                            <Badge tone={getVerdictTone(exp.verdict)}>{exp.verdict}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 whitespace-pre-line">
                          {exp.content}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {exp.user?.name ? exp.user.name[0].toUpperCase() : "U"}
                          </span>
                          Shared by {exp.user?.name || "Anonymous Student"}
                        </span>
                        <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 glass rounded-3xl p-8 max-w-md mx-auto">
                  <Award size={40} className="mx-auto text-slate-400 mb-3" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">No experiences shared yet</h3>
                  <p className="text-xs text-slate-500 mt-1">Be the first to share your interview rounds & questions!</p>
                  {user && (
                    <Button onClick={() => setShowModal(true)} className="mt-4 px-4">
                      Share Experience
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === "assessments" && (
            loadingTests ? (
              <QuestionSkeleton />
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {tests.map((test) => (
                  <article
                    key={test._id}
                    className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-500/30 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h3 className="font-extrabold text-slate-950 dark:text-white text-lg">
                          {test.title}
                        </h3>
                        <Badge tone={test.difficulty === "Easy" ? "teal" : test.difficulty === "Hard" ? "rose" : "amber"}>
                          {test.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[60px]">
                        {test.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{test.totalQuestions} Questions</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{test.duration} Minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passing Marks:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{test.passingMarks} Correct Answers (60%)</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button
                        to={user ? `/assessment/${test._id}` : "/login"}
                        className="w-full text-center"
                      >
                        Start Test
                      </Button>
                    </div>
                  </article>
                ))}
                {tests.length === 0 && (
                  <p className="text-sm text-slate-500 py-6 text-center col-span-3">No assessments found.</p>
                )}
              </div>
            )
          )}
        </main>

        {/* Share Experience Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="glass w-full max-w-xl rounded-3xl p-6 sm:p-8 animate-fade-in relative border border-white/10 bg-white dark:bg-slate-950">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Share Interview Experience</h2>
              <p className="text-xs text-slate-500 mb-6">
                Describe the selection process, rounds, questions asked, and your tips.
              </p>

              <form onSubmit={handleSubmitExperience} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name *</span>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Google"
                      className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Role / Title *</span>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Associate Software Engineer"
                      className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Difficulty Level</span>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interview Verdict</span>
                    <select
                      name="verdict"
                      value={formData.verdict}
                      onChange={handleInputChange}
                      className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500"
                    >
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Landed next round">Landed next round</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interview Details *</span>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe how many rounds there were, what coding/technical questions were asked, design patterns covered, or general tips."
                    className="mt-2 min-h-36 w-full rounded-xl bg-white dark:bg-white/10 px-4 py-3 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500"
                  />
                </label>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Sharing..." : "Post Review"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </motion.section>
  );
};

export default InterviewPrep;

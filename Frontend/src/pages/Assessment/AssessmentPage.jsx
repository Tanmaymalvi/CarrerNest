import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Timer, AlertCircle, ArrowLeft, ArrowRight, Award, RefreshCw, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { testsApi } from "../../services/api";
import { Container, Button, Badge } from "../../components/ui";

const AssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Test state
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionText }
  const [loading, setLoading] = useState(true);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const timerRef = useRef(null);

  // Result state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [certificate, setCertificate] = useState(null);

  // Fetch test questions
  const loadTest = async () => {
    try {
      setLoading(true);
      const { data } = await testsApi.start(id);
      if (data.success) {
        setTest(data.test);
        setQuestions(data.questions);
        setTimeLeft(data.test.duration * 60 || 1800);
      } else {
        toast.error("Failed to load assessment.");
        navigate("/interview-prep");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error starting assessment.");
      navigate("/interview-prep");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTest();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // Start countdown timer once test loads
  useEffect(() => {
    if (!loading && !result && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true); // Auto-submit when timer hits 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, result, timeLeft]);

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Option selection
  const handleSelectOption = (option) => {
    const questionId = questions[currentIdx]._id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Submit test
  const handleSubmit = async (isAuto = false) => {
    if (submitting) return;
    if (!isAuto && !window.confirm("Are you sure you want to submit your answers?")) {
      return;
    }

    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Format answers for API: [{ questionId, selectedAnswer }]
    const formattedAnswers = questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: answers[q._id] || "", // Empty string if unattempted
    }));

    try {
      const { data } = await testsApi.submit(id, formattedAnswers);
      if (data.success) {
        setResult(data.result);
        setCertificate(data.certificate);
        toast.success("Assessment submitted successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="section-pad min-h-screen bg-slate-50 dark:bg-slate-900">
        <Container className="max-w-3xl">
          <div className="glass rounded-3xl p-8 text-center animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2 mx-auto" />
            <div className="h-40 bg-slate-200/50 dark:bg-white/5 rounded-2xl" />
          </div>
        </Container>
      </section>
    );
  }

  // Result screen rendering
  if (result) {
    const isPassed = result.status === "PASSED";
    return (
      <section className="section-pad min-h-screen bg-slate-50 dark:bg-slate-900">
        <Container className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-6"
          >
            <div className="text-center space-y-3">
              {isPassed ? (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                  <Award size={48} />
                </div>
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                  <AlertCircle size={48} />
                </div>
              )}
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">Assessment Result</h1>
              <p className="text-sm text-slate-500">{test?.title}</p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs text-slate-500 font-semibold">Correct Answers</p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{result.correctAnswers}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs text-slate-500 font-semibold">Wrong Answers</p>
                  <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{result.wrongAnswers}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs text-slate-500 font-semibold">Final Score</p>
                  <p className="text-xl font-bold">{result.score}/20</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                  <p className="text-xs text-slate-500 font-semibold">Percentage</p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{result.percentage}%</p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold ${
                  isPassed 
                    ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                }`}>
                  {isPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  STATUS: {result.status}
                </span>
              </div>
            </div>

            {/* Certificate Area */}
            {isPassed ? (
              certificate && (
                <div className="glass p-5 rounded-2xl border border-teal-500/20 bg-teal-50/30 dark:bg-teal-950/10 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-teal-100">🎉 Congratulations! You cleared the passing threshold.</p>
                  <p className="text-xs text-slate-500">Your Certificate of Completion (ID: {certificate.certificateId}) is ready for download.</p>
                  <a
                    href={certificate.certificateUrl}
                    download={`CareerNest-${test?.title.replace(/\s+/g, "-")}-Certificate.pdf`}
                    className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-teal-900/15 hover:bg-teal-800 w-full"
                  >
                    <FileText size={15} /> Download Certificate (PDF)
                  </a>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-50/20 dark:bg-rose-950/10 text-center text-sm font-medium text-rose-700 dark:text-rose-400">
                You need at least 60% marks to earn the certificate. Try preparing more and retake the test.
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={loadTest} variant="secondary" className="flex-1 gap-2">
                <RefreshCw size={14} /> Retake Test
              </Button>
              <Button to="/interview-prep" className="flex-1">
                Back to Prep Hub
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    );
  }

  const currentQuestion = questions[currentIdx];
  const attemptedCount = Object.keys(answers).length;

  return (
    <section className="section-pad min-h-screen bg-slate-50 dark:bg-slate-900">
      <Container className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass p-4 rounded-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white">{test?.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Attempted {attemptedCount} of {questions.length} questions</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 font-bold text-sm">
              <Timer size={16} className="text-teal-700" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <Button onClick={() => handleSubmit(false)} disabled={submitting}>
              Submit Test
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-teal-600 h-full transition-all duration-300"
            style={{ width: `${(attemptedCount / questions.length) * 100}%` }}
          />
        </div>

        {/* Main Grid: Question Card & Question Navigation */}
        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          {/* Question Card */}
          <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <span className="text-sm font-bold text-teal-700 dark:text-teal-400">Question {currentIdx + 1} of {questions.length}</span>
              <Badge tone={currentQuestion.difficulty === "Easy" ? "teal" : currentQuestion.difficulty === "Hard" ? "rose" : "amber"}>
                {currentQuestion.difficulty}
              </Badge>
            </div>

            <p className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </p>

            <div className="grid gap-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion._id] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-200 ${
                      isSelected
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-300 ring-2 ring-teal-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      isSelected ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 dark:border-white/10"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
              <Button
                variant="secondary"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => prev - 1)}
                className="gap-2"
              >
                <ArrowLeft size={14} /> Previous
              </Button>
              <Button
                variant="secondary"
                disabled={currentIdx === questions.length - 1}
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                className="gap-2"
              >
                Next <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Quick Question Navigation Panel */}
          <aside className="glass rounded-3xl p-5 border border-slate-200 dark:border-white/10 h-max space-y-4">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Question Navigation</h2>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAttempted = !!answers[q._id];
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-teal-700 text-white shadow-md ring-2 ring-teal-500/30"
                        : isAttempted
                        ? "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-900/30"
                        : "bg-white text-slate-500 border border-slate-200 dark:bg-white/5 dark:border-white/5 dark:text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded bg-teal-700" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded bg-teal-50 border border-teal-200 dark:bg-teal-900/20 dark:border-teal-900/30" />
                <span>Attempted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 rounded bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5" />
                <span>Unattempted</span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
};

export default AssessmentPage;

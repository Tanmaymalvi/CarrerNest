import { useEffect, useState } from "react";
import { BookmarkX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import JobCard from "../../components/JobCard/JobCard";
import { Button, Container, SectionHeader } from "../../components/ui";
import { savedJobsApi } from "../../services/api";

import "./SavedJobs.css";
const SavedJobs = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedJobs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await savedJobsApi.list(user.id || user._id);
        setSavedJobs((data.savedJobs || []).map((item) => item.jobId).filter(Boolean));
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load saved jobs");
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, [user]);

  if (!user) {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Login to view saved jobs</h1>
            <Button onClick={() => navigate("/login")} className="mt-5">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <Container>
        <SectionHeader eyebrow="Saved Jobs" title="Jobs you saved" description="Revisit saved opportunities and apply when you are ready." />
        {loading ? (
          <div className="glass rounded-3xl p-8 text-center">Loading saved jobs...</div>
        ) : savedJobs.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((job) => <JobCard key={job._id || job.id} job={job} />)}
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <BookmarkX size={44} className="mx-auto text-slate-400" />
            <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">No saved jobs yet</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Save jobs from listings to build your shortlist.</p>
            <Button to="/jobs" className="mt-5">Browse jobs</Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default SavedJobs;

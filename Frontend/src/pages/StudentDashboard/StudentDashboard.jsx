import { Activity, Bookmark, CheckCircle2, Send } from "lucide-react";
import JobCard from "../../components/JobCard/JobCard";
import { jobs } from "../../data/mockData";
import { Button, Container, SectionHeader, StatCard } from "../../components/ui";
import { motion } from "framer-motion";

import "./StudentDashboard.css";
const StudentDashboard = () => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="section-pad"
  >
    <Container>
      <SectionHeader eyebrow="Student dashboard" title="Your career command center" description="Track applications, saved roles, recommended jobs, and profile actions." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Send} value="12" label="Applications sent" />
        <StatCard icon={CheckCircle2} value="3" label="Shortlisted" />
        <StatCard icon={Bookmark} value="8" label="Saved jobs" />
        <StatCard icon={Activity} value="76%" label="Profile strength" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-white">Recommended jobs</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {jobs.slice(0, 4).map((job) => <JobCard key={job.id} job={job} compact />)}
          </div>
        </div>
        <aside className="glass h-max rounded-3xl p-6">
          <h3 className="font-bold text-slate-950 dark:text-white">Quick actions</h3>
          <div className="mt-4 grid gap-3">
            <Button to="/profile">Update profile</Button>
            <Button to="/applied-jobs" variant="secondary">View applications</Button>
            <Button to="/jobs" variant="secondary">Browse jobs</Button>
          </div>
        </aside>
      </div>
    </Container>
  </motion.section>
);

export default StudentDashboard;

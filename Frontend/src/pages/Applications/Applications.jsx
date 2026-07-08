import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { applications as demoApplications } from "../../data/mockData";
import { applicationsApi } from "../../services/api";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";

import "./Applications.css";
const tones = {
  pending: "amber",
  reviewing: "cyan",
  shortlisted: "teal",
  interview_scheduled: "cyan",
  "interview scheduled": "cyan",
  on_hold: "amber",
  "on hold": "amber",
  accepted: "teal",
  rejected: "rose",
  withdrawn: "slate",
};

const friendlyStatus = {
  pending: "Pending",
  reviewing: "Reviewed",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  "interview scheduled": "Interview Scheduled",
  on_hold: "On Hold",
  "on hold": "On Hold",
  accepted: "Selected",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      const { data } = await applicationsApi.mine();
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const withdraw = async (applicationId) => {
    if (!applicationId) {
      toast.success("Demo application withdrawn");
      return;
    }
    await applicationsApi.updateStatus(applicationId, "withdrawn");
    toast.success("Application withdrawn");
    loadApplications();
  };

  const rows = applications.length
    ? applications.map((application) => ({
        id: application._id,
        jobId: application.job?._id,
        title: application.job?.title || "Job",
        company: application.job?.company?.name || "Company",
        date: new Date(application.createdAt).toLocaleDateString(),
        status: application.status,
      }))
    : demoApplications.map((application) => ({ ...application, status: application.status.toLowerCase() }));

  return (
    <section className="section-pad">
      <Container>
        <SectionHeader eyebrow="Applications" title="Track every application" description="Review status, revisit job details, and withdraw applications when needed." />
        <div className="glass overflow-hidden rounded-3xl">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-200 px-6 py-4 text-sm font-bold text-slate-500 md:grid dark:border-white/10">
            <span>Role</span><span>Company</span><span>Date</span><span>Status</span><span>Action</span>
          </div>
          {loading ? (
            <div className="p-8 text-center">Loading applications...</div>
          ) : rows.length ? rows.map((application) => (
            <div key={application.id} className="grid gap-3 border-b border-slate-100 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center dark:border-white/10">
              <Link to={`/job/${application.jobId}`} className="font-bold text-slate-950 hover:text-teal-700 dark:text-white">{application.title}</Link>
              <span className="text-sm text-slate-600 dark:text-slate-300">{application.company}</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">{application.date}</span>
              <Badge tone={tones[application.status] || "slate"}>{friendlyStatus[application.status] || application.status}</Badge>
              <Button onClick={() => withdraw(application.id)} variant="secondary" className="px-4">Withdraw</Button>
            </div>
          )) : (
            <div className="p-10 text-center">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">No applications yet</h2>
              <Button to="/jobs" className="mt-5">Browse jobs</Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Applications;

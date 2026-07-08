import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Building2, Globe, MapPin, Star } from "lucide-react";
import toast from "react-hot-toast";
import JobCard from "../../components/JobCard/JobCard";
import { Badge, Button, Container } from "../../components/ui";
import { companiesApi, jobsApi } from "../../services/api";
import { companies as demoCompanies, jobs as demoJobs } from "../../data/mockData";

import "./CompanyDetails.css";
const CompanyDetails = () => {
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [companiesRes, jobsRes] = await Promise.all([companiesApi.list(), jobsApi.list({ status: "all" })]);
        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data.jobs || []);
      } catch {
        toast("Showing demo company details because the API is unavailable");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sourceCompanies = companies.length ? companies : demoCompanies;
  const sourceJobs = jobs.length ? jobs : demoJobs;
  const company = sourceCompanies.find((item) => (item._id || item.id)?.toString() === id);
  const companyJobs = useMemo(() => {
    if (!company) return [];
    return sourceJobs.filter((job) => {
      const companyId = typeof job.company === "object" ? job.company?._id : null;
      const companyName = typeof job.company === "object" ? job.company?.name : job.company;
      return companyId === company._id || companyName === company.name;
    });
  }, [company, sourceJobs]);

  if (loading) {
    return <section className="section-pad"><Container><div className="glass rounded-3xl p-8 text-center">Loading company...</div></Container></section>;
  }

  if (!company) return <Navigate to="/companies" replace />;

  return (
    <section className="section-pad">
      <Container>
        <Button to="/companies" variant="secondary" className="mb-6">Back to companies</Button>
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-700 text-3xl font-bold text-white">
              {company.logo ? <img src={company.logo} alt="" className="h-full w-full rounded-2xl object-cover" /> : company.name?.slice(0, 2)}
            </div>
            <div>
              <Badge>{company.industry || company.category || "Company"}</Badge>
              <h1 className="mt-3 text-4xl font-extrabold text-slate-950 dark:text-white">{company.name}</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{company.description || "Explore company details, open roles, and hiring activity."}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 dark:bg-white/10"><MapPin size={18} /><p className="mt-2 font-semibold">{company.location || "India"}</p></div>
            <div className="rounded-2xl bg-white p-4 dark:bg-white/10"><Building2 size={18} /><p className="mt-2 font-semibold">{company.openJobs || companyJobs.length} open jobs</p></div>
            <div className="rounded-2xl bg-white p-4 dark:bg-white/10"><Star size={18} /><p className="mt-2 font-semibold">{company.rating || "4.5"} rating</p></div>
          </div>
          {company.website ? (
            <a href={company.website} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-300">
              <Globe size={17} /> Visit website
            </a>
          ) : null}
        </div>

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-950 dark:text-white">Open roles at {company.name}</h2>
          {companyJobs.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {companyJobs.map((job) => <JobCard key={job._id || job.id} job={job} compact />)}
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-slate-600 dark:text-slate-300">No active jobs from this company right now.</p>
              <Button to="/jobs" className="mt-5">Browse all jobs</Button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CompanyDetails;

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { jobs as mockJobs } from "../../../data/mockData";
import JobCard from "../../../components/JobCard/JobCard";
import { Button, Container, SectionHeader } from "../../../components/ui";
import { jobsApi } from "../../../services/api";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await jobsApi.list({ status: "active" });
        const list = Array.isArray(data) ? data : data?.jobs || [];
        // Filter out food-related if any slip through the API
        const filtered = list.filter(
          (j) => {
            const companyName = (typeof j.company === "object" ? j.company?.name : j.company || "").toLowerCase();
            return !companyName.includes("swiggy") && !companyName.includes("zomato") && !companyName.includes("food");
          }
        );
        setJobs(filtered.length ? filtered : mockJobs);
      } catch (error) {
        console.log("Featured jobs loading fallback to mock data");
        setJobs(mockJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const displayedJobs = jobs.filter((job) => job.featured).slice(0, 6);
  const finalJobs = displayedJobs.length ? displayedJobs : jobs.slice(0, 6);

  return (
    <section className="section-pad bg-white/55 dark:bg-slate-950/40">
      <Container>
        <SectionHeader
          eyebrow="Featured Jobs"
          title="Fresh Opportunities from Top Teams"
          description="Build your profile, review job requirements, and submit applications with a single click."
          action={<Button to="/jobs" variant="secondary">View all <ArrowRight size={17} /></Button>}
        />
        {loading ? (
          <div className="text-center py-10 font-medium text-slate-500">Loading open roles...</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {finalJobs.map((job, index) => (
              <motion.div
                key={job._id || job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedJobs;

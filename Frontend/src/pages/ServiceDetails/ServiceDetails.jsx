import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Award, Brain, Check, Eye, FileText, Users, Zap } from "lucide-react";
import { Button, Container } from "../../components/ui";
import { servicesApi } from "../../services/api";

import "./ServiceDetails.css";
const serviceDetails = {
  "resume-display": {
    icon: Eye,
    title: "Resume Display",
    price: "Rs 499",
    description: "Show your resume prominently to recruiters searching for active candidates.",
    benefits: ["Higher recruiter visibility", "Premium candidate badge", "30-day listing boost"],
  },
  "priority-applicant": {
    icon: Zap,
    title: "Priority Applicant",
    price: "Rs 699",
    description: "Move your job applications higher in employer review queues.",
    benefits: ["Priority application tag", "Faster recruiter review", "Status tracking"],
  },
  "ai-mock-interview": {
    icon: Brain,
    title: "AI Mock Interview",
    price: "Rs 999",
    description: "Practice role-specific interviews with instant AI feedback.",
    benefits: ["Role-based questions", "Communication feedback", "Readiness score"],
  },
  "resume-writing": {
    icon: FileText,
    title: "Resume Writing",
    price: "Rs 1,999",
    description: "Get a professionally written ATS-friendly resume.",
    benefits: ["Expert writer", "ATS optimization", "Two revision rounds"],
  },
  "resume-builder": {
    icon: FileText,
    title: "Resume Builder",
    price: "Rs 0",
    description: "Create, preview, and manage resumes inside CareerNest.",
    benefits: ["Templates", "PDF-ready layout", "Resume dashboard"],
  },
  "resume-review": {
    icon: Award,
    title: "Resume Review",
    price: "Rs 1,999",
    description: "Receive expert suggestions to improve your resume.",
    benefits: ["Scorecard", "Improvement checklist", "24-hour turnaround"],
  },
  "recruiter-connection": {
    icon: Users,
    title: "Recruiter Connection",
    price: "Rs 4,999",
    description: "Connect directly with recruiters matching your target roles.",
    benefits: ["Recruiter outreach", "Custom matches", "Priority support"],
  },
};

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const getServiceDetail = (idOrTitle) => serviceDetails[idOrTitle] || serviceDetails[slugify(idOrTitle || "")];
const isMongoId = (value) => /^[a-f\d]{24}$/i.test(value || "");
const normalizeApiService = (service) => service ? ({
  icon: FileText,
  title: service.name,
  price: `Rs ${Number(service.price || 0).toLocaleString("en-IN")}`,
  description: service.description,
  benefits: service.features || [],
}) : null;

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiService, setApiService] = useState(null);
  const [loading, setLoading] = useState(isMongoId(id));
  const service = apiService || getServiceDetail(id);

  useEffect(() => {
    const loadService = async () => {
      if (!isMongoId(id)) return;
      try {
        const { data } = await servicesApi.get(id);
        setApiService(normalizeApiService(data.service));
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (loading) return <section className="section-pad"><Container><div className="glass rounded-3xl p-8 text-center">Loading service...</div></Container></section>;
  if (!service) return <Navigate to="/services" replace />;
  const Icon = service.icon;

  return (
    <section className="section-pad">
      <Container className="max-w-4xl">
        <Button to="/services" variant="secondary" className="mb-6">Back to services</Button>
        <div className="glass rounded-3xl p-6 sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-white">
            <Icon size={30} />
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-slate-950 dark:text-white">{service.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{service.description}</p>
          <p className="mt-6 text-3xl font-bold text-slate-950 dark:text-white">{service.price}</p>
          <div className="mt-8 grid gap-3">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-xl bg-white p-4 dark:bg-white/10">
                <Check className="text-teal-600" size={18} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => navigate(`/services/${id}/checkout`)}>Buy Now</Button>
            <Button to={service.title === "Resume Builder" ? "/resume" : "/services"} variant="secondary">
              {service.title === "Resume Builder" ? "Open Resume Dashboard" : "Compare Services"}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ServiceDetails;

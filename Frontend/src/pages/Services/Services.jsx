import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  Check,
  Zap,
  FileText,
  Users,
  Brain,
  Award,
  Eye,
} from "lucide-react";

import { Container, Button } from "../../components/ui";
import { servicesApi } from "../../services/api";
import "./Services.css";

const services = [
  {
    id: 1,
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create a professional resume with AI-powered suggestions and premium templates.",
    benefits: [
      "ATS-optimized",
      "Multiple templates",
      "Instant download",
    ],
    price: "₹0",
    badge: "Free",
    color: "from-blue-500 to-cyan-500",
  },

  {
    id: 2,
    icon: Eye,
    title: "Resume Display",
    description:
      "Display your resume prominently to top recruiters on CareerNest.",
    benefits: [
      "Higher visibility",
      "More applications",
      "Premium badge",
    ],
    price: "₹499",
    badge: "Popular",
    color: "from-purple-500 to-pink-500",
  },

  {
    id: 3,
    icon: Zap,
    title: "Priority Applicant",
    description:
      "Get your applications seen first by employers and stand out from the crowd.",
    benefits: [
      "Faster review",
      "Top placement",
      "30-day validity",
    ],
    price: "₹699",
    badge: "Best Value",
    color: "from-orange-500 to-red-500",
  },

  {
    id: 4,
    icon: Brain,
    title: "AI Mock Interview",
    description:
      "Practice with AI-powered mock interviews tailored to your target role.",
    benefits: [
      "Instant feedback",
      "Multiple scenarios",
      "Score tracking",
    ],
    price: "₹999",
    badge: "Popular",
    color: "from-green-500 to-teal-500",
  },

  {
    id: 5,
    icon: Award,
    title: "Resume Review",
    description:
      "Get expert feedback and personalized improvements to your resume.",
    benefits: [
      "Expert feedback",
      "24-hour turnaround",
      "Unlimited edits",
    ],
    price: "₹1,999",
    badge: "Premium",
    color: "from-yellow-500 to-orange-500",
  },

  {
    id: 6,
    icon: Users,
    title: "Recruiter Connection",
    description:
      "Direct access to top recruiters for personalized job matching.",
    benefits: [
      "Dedicated recruiter",
      "Custom matches",
      "Priority support",
    ],
    price: "₹4,999",
    badge: "Exclusive",
    color: "from-indigo-500 to-purple-500",
  },
];

const isMongoId = (value) => /^[a-f\d]{24}$/i.test(value || "");

const iconMap = {
  FileText,
  Eye,
  Zap,
  Brain,
  Award,
  Users,
};

const normalizeService = (service) => ({
  id: service._id || service.id,
  icon: iconMap[service.icon] || service.icon || FileText,
  title: service.name || service.title,
  description: service.description,
  benefits: service.features || service.benefits || [],
  price: typeof service.price === "number" ? `Rs ${service.price.toLocaleString("en-IN")}` : service.price,
  badge: service.badge || "Career Service",
  color: service.color || "from-teal-500 to-cyan-500",
});

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ServiceCard = ({ service, index, onBuy, onLearnMore }) => {
  const [isHovered, setIsHovered] = useState(false);

  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900">
        
        {/* Badge */}
        <div className="absolute right-6 top-6">
          <span
            className={`inline-block rounded-full bg-gradient-to-r ${service.color} px-3 py-1 text-xs font-bold text-white`}
          >
            {service.badge}
          </span>
        </div>

        {/* Icon */}
        <div
          className={`mb-6 inline-flex rounded-xl bg-gradient-to-r ${service.color} p-4 text-white transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={28} />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
          {service.title}
        </h3>

        {/* Description */}
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          {service.description}
        </p>

        {/* Benefits */}
        <div className="mb-8 space-y-3">
          {service.benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check
                size={18}
                className="text-teal-600 dark:text-teal-400"
              />

              <span className="text-sm text-slate-700 dark:text-slate-200">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="border-t border-slate-200 pt-6 dark:border-white/10">
          <div className="mb-5">
            <h4 className="text-3xl font-bold text-slate-900 dark:text-white">
              {service.price}
            </h4>

            <p className="text-sm text-slate-500">
              One-time payment
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => onBuy(service)} className="w-full">
              Buy Now
            </Button>

            <button onClick={() => onLearnMore(service)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [apiServices, setApiServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await servicesApi.list();
        setApiServices(Array.isArray(data) ? data : data.services || []);
      } catch {
        toast("Showing demo services because the API is unavailable");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const visibleServices = (apiServices.length ? apiServices : services).map(normalizeService);

  const handleBuy = async (service) => {
    const routeId = isMongoId(service.id) ? service.id : slugify(service.title);
    navigate(`/services/${routeId}/checkout`);
  };

  const handleLearnMore = (service) => {
    const routeId = isMongoId(service.id) ? service.id : slugify(service.title);
    navigate(`/services/${routeId}`);
  };

  const handleModalBuy = async (service) => {
    if (!user) {
      toast.error("Please login to buy services");
      navigate("/login");
      return;
    }
    if (!isMongoId(service.id)) {
      toast.success("Demo service selected. Add this service in the admin panel to create a real order.");
      return;
    }

    try {
      await servicesApi.purchase(service.id);
      toast.success("Order created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-5xl font-bold text-white">
              Premium Career Services
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-cyan-100">
              Accelerate your career growth with AI tools,
              expert guidance and recruiter support.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Cards */}
      <Container className="py-20">
        {loading ? (
          <div className="mb-8 rounded-2xl bg-white p-6 text-center text-slate-600 shadow dark:bg-slate-900 dark:text-slate-300">
            Loading career services...
          </div>
        ) : null}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onBuy={handleBuy}
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>
      </Container>

      {selectedService ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-r ${selectedService.color} p-3 text-white`}>
              {(() => {
                const ModalIcon = selectedService.icon;
                return <ModalIcon size={24} />;
              })()}
            </div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{selectedService.title}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{selectedService.description}</p>
            <div className="mt-5 space-y-3">
              {selectedService.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <Check size={18} className="text-teal-600" />
                  {benefit}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => handleModalBuy(selectedService)} className="flex-1">Buy Now</Button>
              <Button onClick={() => setSelectedService(null)} variant="secondary" className="flex-1">Close</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Services;

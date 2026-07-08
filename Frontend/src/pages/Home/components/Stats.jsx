import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Building2, Users, Zap } from "lucide-react";
import { Container, SectionHeader } from "../../../components/ui";
import { statsApi } from "../../../services/api";

// Fallback values shown if the API call fails
const FALLBACKS = {
  totalJobs: 0,
  totalCompanies: 0,
  totalUsers: 0,
  satisfactionRate: 98,
};

// Animated counter that counts from 0 to `target` over `duration` ms
const AnimatedCounter = ({ target, suffix = "", duration = 1500, isLoading }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (isLoading || target === 0) {
      setDisplay(target);
      return;
    }

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress); // ease-out quad
      setDisplay(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, isLoading]);

  if (isLoading) {
    return (
      <span className="inline-block h-10 w-20 animate-pulse rounded-xl bg-teal-100 dark:bg-teal-900/30" />
    );
  }

  return (
    <>{display.toLocaleString("en-IN")}{suffix}</>
  );
};

const statCards = [
  {
    key: "totalJobs",
    label: "Active Jobs",
    icon: BriefcaseBusiness,
    suffix: "+",
    iconBg: "bg-teal-600",
    iconText: "text-white",
  },
  {
    key: "totalCompanies",
    label: "Verified Companies",
    icon: Building2,
    suffix: "+",
    iconBg: "bg-cyan-600",
    iconText: "text-white",
  },
  {
    key: "totalUsers",
    label: "Registered Users",
    icon: Users,
    suffix: "+",
    iconBg: "bg-teal-700",
    iconText: "text-white",
  },
  {
    key: "satisfactionRate",
    label: "Satisfaction Rate",
    icon: Zap,
    suffix: "%",
    iconBg: "bg-cyan-700",
    iconText: "text-white",
  },
];

const Stats = () => {
  const [stats, setStats] = useState(FALLBACKS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await statsApi.get();
        setStats({
          totalJobs: data.totalJobs ?? FALLBACKS.totalJobs,
          totalCompanies: data.totalCompanies ?? FALLBACKS.totalCompanies,
          totalUsers: data.totalUsers ?? FALLBACKS.totalUsers,
          satisfactionRate: data.satisfactionRate ?? FALLBACKS.satisfactionRate,
        });
        setHasError(false);
      } catch {
        // API unreachable — keep fallback values, flag the error
        setStats(FALLBACKS);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="section-pad bg-white/55 dark:bg-slate-950/40">
      <Container>
        <SectionHeader
          eyebrow="Platform at a Glance"
          title="Real numbers, updated live"
          description={
            hasError
              ? "Could not load live data — showing default values."
              : "Every number reflects the current state of our platform, fetched directly from the database."
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon, suffix, iconBg, iconText }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass flex flex-col items-center rounded-2xl border border-slate-100 p-6 text-center hover:border-teal-300 hover:shadow-lg dark:border-white/5 dark:hover:border-teal-500/30 transition-all cursor-default"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} ${iconText} shadow-md`}
              >
                <Icon size={22} />
              </div>

              <p className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                <AnimatedCounter
                  target={stats[key]}
                  suffix={suffix}
                  isLoading={isLoading}
                />
              </p>

              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Stats;

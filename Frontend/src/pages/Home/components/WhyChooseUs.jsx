import { motion } from "framer-motion";
import { FileCheck2, LockKeyhole, MessagesSquare, ShieldCheck } from "lucide-react";
import { Container, SectionHeader } from "../../../components/ui";

const items = [
  ["Role-based workflows", "Separate dashboards for students, employers, and administrators.", ShieldCheck],
  ["Resume-ready profiles", "Skills, education, uploads, and application history stay organized.", FileCheck2],
  ["Secure by default", "JWT cookies, validation, upload checks, and permission gates on the API.", LockKeyhole],
  ["Actionable hiring", "Employers can review applicants and move them through decisions.", MessagesSquare],
];

const WhyChooseUs = () => (
  <section className="section-pad bg-white/55 dark:bg-slate-950/40">
    <Container>
      <SectionHeader
        eyebrow="Why CareerNest"
        title="Built for serious hiring operations"
        description="A polished marketplace experience with practical controls for every role."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([title, text, Icon], index) => (
          <motion.article 
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass rounded-2xl p-6 hover:shadow-lg border border-slate-100 hover:border-teal-300 dark:border-white/5 dark:hover:border-teal-500/30 transition-all cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md shadow-cyan-600/10">
              <Icon size={21} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
          </motion.article>
        ))}
      </div>
    </Container>
  </section>
);

export default WhyChooseUs;

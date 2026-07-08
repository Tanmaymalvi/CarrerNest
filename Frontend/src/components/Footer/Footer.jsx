import { BriefcaseBusiness, Globe2, Mail, Users } from "lucide-react";
import { Container } from "../ui";
import "./Footer.css";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white/80 py-12 dark:border-white/10 dark:bg-slate-950/80">
    <Container className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700 text-white">
            <BriefcaseBusiness size={21} />
          </span>
          <span className="text-xl font-extrabold text-slate-950 dark:text-white">CareerNest</span>
        </div>
        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
          A secure role-based job portal for students, employers, and administrators.
        </p>
        <div className="mt-5 flex gap-3">
          {[Globe2, Users, Mail].map((Icon) => (
            <button
              key={Icon.displayName || Icon.name}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              aria-label="Social link"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
      {[
        ["Platform", "Jobs", "Companies", "Career resources"],
        ["Roles", "Students", "Employers", "Administrators"],
        ["Trust", "Privacy", "Security", "Terms"],
      ].map(([title, ...items]) => (
        <div key={title}>
          <h3 className="font-bold text-slate-950 dark:text-white">{title}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </Container>
  </footer>
);

export default Footer;

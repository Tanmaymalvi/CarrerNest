import { Mail } from "lucide-react";
import { Container } from "../ui";
import logoImg from "../../assets/images/logo.png";
import "./Footer.css";

const Linkedin = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white/80 py-12 dark:border-white/10 dark:bg-slate-950/80">
    <Container className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
      <div>
        <div className="flex items-center">
          <img 
            src={logoImg} 
            alt="CareerNest Logo" 
            className="h-10 w-auto object-contain transition-transform duration-200 hover:scale-105" 
          />
        </div>
        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
          A secure role-based job portal for students, employers, and administrators.
        </p>
        <div className="mt-5 flex gap-3">
          {[
            { Icon: Linkedin, href: "https://www.linkedin.com/in/carrernest-company-70b595420", label: "LinkedIn" },
            { Icon: Instagram, href: "https://www.instagram.com/careernest.platform", label: "Instagram" },
            { Icon: Mail, href: "mailto:careernestofficial@gmail.com", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
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

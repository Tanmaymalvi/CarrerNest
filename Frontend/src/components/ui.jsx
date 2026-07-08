import { Link } from "react-router-dom";

export const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
    {action}
  </div>
);

export const Badge = ({ children, tone = "teal" }) => {
  const tones = {
    teal: "bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-400/10 dark:text-teal-200 dark:ring-teal-400/20",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-400/20",
    slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10",
    amber: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20",
    rose: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-400/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const Button = ({ to, children, variant = "primary", size = "sm", className = "", ...props }) => {
  const variants = {
    primary:
      "bg-teal-700 text-white shadow-lg shadow-teal-900/15 hover:bg-teal-800",
    secondary:
      "border border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-white",
    ghost:
      "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
  };
  const sizes = {
    sm: "min-h-[38px] px-4 py-2 text-xs rounded-xl",
    md: "min-h-11 px-5 py-3 text-sm rounded-xl",
  };
  const classes = `inline-flex items-center justify-center gap-2 font-semibold transition-all ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export const StatCard = ({ label, value, icon: Icon }) => (
  <div className="glass rounded-2xl p-5">
    {Icon ? (
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
        <Icon size={20} />
      </div>
    ) : null}
    <p className="text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{label}</p>
  </div>
);

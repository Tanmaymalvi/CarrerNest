import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Code2, Database, Landmark, Megaphone, Palette, Users } from "lucide-react";
import { Container, SectionHeader } from "../../../components/ui";

const categories = [
  { name: "IT & Software", count: 1240, icon: Code2, color: "teal" },
  { name: "Data Science", count: 420, icon: Database, color: "cyan" },
  { name: "Human Resources", count: 310, icon: Users, color: "amber" },
  { name: "Finance", count: 275, icon: Landmark, color: "teal" },
  { name: "Marketing", count: 530, icon: Megaphone, color: "rose" },
  { name: "Management", count: 460, icon: Briefcase, color: "cyan" },
  { name: "Design", count: 380, icon: Palette, color: "rose" },
];

const colors = {
  teal: "text-teal-600 bg-teal-50 dark:bg-teal-900/10 dark:text-teal-400 border-teal-100 dark:border-teal-950",
  cyan: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/10 dark:text-cyan-400 border-cyan-100 dark:border-cyan-950",
  amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 border-amber-100 dark:border-amber-950",
  rose: "text-rose-600 bg-rose-50 dark:bg-rose-900/10 dark:text-rose-400 border-rose-100 dark:border-rose-950",
};

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?search=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="section-pad">
      <Container>
        <SectionHeader
          eyebrow="Popular Categories"
          title="Browse Jobs by Specialization"
          description="Explore high-intent job listings across top departments, verified directly by recruiters."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.article
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleCategoryClick(cat.name)}
                className="glass cursor-pointer rounded-2xl p-6 border border-slate-100 hover:border-teal-300 dark:border-white/5 dark:hover:border-teal-500/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${colors[cat.color]}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                    {cat.count} Jobs
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white group-hover:text-teal-700">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Find engineering, support, management, or executive opportunities.
                </p>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Categories;

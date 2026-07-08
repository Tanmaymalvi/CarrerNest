import { Quote, Star } from "lucide-react";
import { Container, SectionHeader } from "../../../components/ui";

const testimonials = [
  {
    text: "Career Nest made my placement journey incredibly smooth. I built my resume using the ATS generator, applied to Google, and got shortlisted within a week!",
    name: "Ananya Sharma",
    role: "Frontend Developer at Google",
    rating: 5,
  },
  {
    text: "The platform's direct status updates are amazing. I knew exactly when Microsoft reviewed my application and scheduled my interview rounds.",
    name: "Rohan Verma",
    role: "Data Analyst at Microsoft",
    rating: 5,
  },
  {
    text: "Being able to upload projects, verify my degree details, and showcase my GitHub links in a clean profile got me hired by Adobe as a UI/UX designer.",
    name: "Meera Nair",
    role: "UI/UX Designer at Adobe",
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="section-pad bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/10">
    <Container>
      <SectionHeader eyebrow="Success Stories" title="Student Testimonials" description="Hear from students who successfully launched their careers through Career Nest." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, index) => (
          <figure key={index} className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 hover:border-teal-300 dark:hover:border-teal-500/20 hover:shadow-lg transition-all relative flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <Quote className="text-teal-700 dark:text-teal-300 absolute right-6 top-6 opacity-20" size={32} />
              <blockquote className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                "{t.text}"
              </blockquote>
            </div>
            <figcaption className="mt-6 border-t border-slate-100 dark:border-white/5 pt-4">
              <p className="font-bold text-slate-950 dark:text-white text-sm">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);

export default Testimonials;

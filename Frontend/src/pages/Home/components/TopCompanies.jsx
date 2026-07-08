import { motion } from "framer-motion";
import { Container, SectionHeader } from "../../../components/ui";
import { getCompanyLogo } from "../../../utils/logos";

const slidingCompanies = [
  { name: "Google" },
  { name: "Microsoft" },
  { name: "Amazon" },
  { name: "Adobe" },
  { name: "Paytm" },
  { name: "TCS" },
  { name: "Infosys" },
  { name: "Wipro" },
  { name: "Accenture" },
  { name: "Deloitte" },
  { name: "IBM" },
  { name: "Cognizant" },
  { name: "Capgemini" },
  { name: "Flipkart" },
];

const TopCompanies = () => {
  const doubleList = [...slidingCompanies, ...slidingCompanies, ...slidingCompanies];

  return (
    <section className="section-pad overflow-hidden bg-slate-50/50 dark:bg-slate-900/10">
      <Container>
        <SectionHeader
          eyebrow="Partnerships"
          title="Top Companies Slider"
          description="Leading global firms and tech innovators hiring actively on Career Nest."
        />
      </Container>
      
      {/* Slider Wrapper */}
      <div className="relative mt-5 flex w-full overflow-x-hidden py-4">
        {/* Gradients to fade out edges */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-white to-transparent dark:from-slate-950 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white to-transparent dark:from-slate-950 pointer-events-none" />

        <motion.div 
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{
            repeat: Infinity,
            duration: 35,
            ease: "linear",
          }}
        >
          {doubleList.map((company, index) => {
            const logoUrl = getCompanyLogo(company.name);
            return (
              <div 
                key={`${company.name}-${index}`}
                className="glass inline-flex items-center gap-4 rounded-2xl px-6 py-4 border border-slate-100 dark:border-white/5 shadow-sm hover:border-teal-300 dark:hover:border-teal-500/20 hover:shadow-md transition-all shrink-0 cursor-pointer"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-100 overflow-hidden p-1.5 shadow-sm">
                  {logoUrl ? (
                    <img src={logoUrl} alt={company.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-teal-800 font-extrabold text-sm">{company.name[0]}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">{company.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Hiring Partner</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default TopCompanies;

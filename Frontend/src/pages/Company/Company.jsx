import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Filter, Search } from "lucide-react";
import toast from "react-hot-toast";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import { Container, Button } from "../../components/ui";
import { companies as demoCompanies } from "../../data/mockData";
import { companiesApi } from "../../services/api";

import "./Company.css";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const { data } = await companiesApi.list();
        setCompanies(Array.isArray(data) ? data : []);
      } catch {
        toast("Showing demo companies because the API is unavailable");
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const sourceCompanies = companies.length ? companies : demoCompanies;
  const categories = ["All", ...new Set(sourceCompanies.map((company) => company.industry || company.category || "Technology"))];
  const filteredCompanies = sourceCompanies.filter((company) => {
    const text = `${company.name} ${company.description || ""}`.toLowerCase();
    const category = company.industry || company.category || "Technology";
    return text.includes(searchTerm.toLowerCase()) && (selectedCategory === "All" || category === selectedCategory);
  });

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-16 sm:py-20 border-b border-slate-100 dark:border-white/5">
        <motion.div 
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/5" 
        />
        <motion.div 
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" 
        />
        
        <Container>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/30">
              🏢 Partner Companies
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Discover <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">Top Companies</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Explore leading organizations hiring on CareerNest.</p>
            <div className="mx-auto mt-8 max-w-2xl px-4">
              <div className="glass grid gap-3 sm:grid-cols-[1fr_auto] rounded-2xl bg-white border border-slate-200 dark:bg-white/10 dark:border-white/5 p-2 shadow-xl">
                <div className="flex items-center gap-3 px-2">
                  <Search className="text-teal-700 dark:text-teal-400" size={20} />
                  <input 
                    value={searchTerm} 
                    onChange={(event) => setSearchTerm(event.target.value)} 
                    type="text" 
                    placeholder="Search companies..." 
                    className="w-full bg-transparent border-0 py-2 text-slate-900 dark:text-white placeholder-slate-400 outline-none" 
                  />
                </div>
                <Button 
                  variant="secondary"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-teal-700 text-white hover:bg-teal-800" : ""}
                >
                  <Filter size={17} /> Filters
                </Button>
              </div>

              {/* Collapsible Industry Filters */}
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 glass rounded-2xl p-4 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5"
                >
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Industry Sector</span>
                    <button 
                      onClick={() => setSelectedCategory("All")} 
                      className="font-bold text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      Clear filter
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">

        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">{loading ? "Loading companies..." : `Showing ${filteredCompanies.length} companies`}</p>
        {filteredCompanies.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company, index) => <CompanyCard key={company._id || company.id} company={company} index={index} />)}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-white/10 dark:bg-slate-900">
            <Briefcase size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">No companies found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Companies;

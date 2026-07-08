import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Filter, Search } from "lucide-react";
import toast from "react-hot-toast";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import { Container } from "../../components/ui";
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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-16">
        <Container>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Discover Top Companies</h1>
            <p className="mx-auto max-w-2xl text-lg text-cyan-100">Explore leading organizations hiring on CareerNest.</p>
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} type="text" placeholder="Search companies..." className="w-full rounded-xl border-0 bg-white px-12 py-4 text-slate-900 placeholder-slate-500 shadow-lg outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="mb-8">
          <button onClick={() => setShowFilters(!showFilters)} className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 md:hidden dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            <Filter size={18} />Filters
          </button>
          <div className={`grid gap-3 ${showFilters ? "" : "hidden md:grid"} grid-cols-2 md:grid-cols-5`}>
            {categories.map((category) => (
              <motion.button key={category} whileHover={{ scale: 1.05 }} onClick={() => setSelectedCategory(category)} className={`rounded-lg px-4 py-2 font-medium transition-all ${selectedCategory === category ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg" : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"}`}>
                {category}
              </motion.button>
            ))}
          </div>
        </div>

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

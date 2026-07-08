import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import { Button, Container } from "../../../components/ui";

const popularTags = [
  "Frontend Developer",
  "Data Analyst",
  "Software Engineer",
  "UI/UX Designer",
  "Business Analyst",
  "HR Manager",
];

const Hero = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTitle.trim()) queryParams.set("search", searchTitle.trim());
    if (searchLocation.trim()) queryParams.set("location", searchLocation.trim());
    navigate(`/jobs?${queryParams.toString()}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24 bg-gradient-to-b from-teal-50/50 to-transparent dark:from-slate-950/20 dark:to-transparent">
      {/* Background Floating Decorative Blobs */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-800/10 animate-pulse duration-[8s]" />
      <div className="absolute bottom-10 left-10 -z-10 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-800/10 animate-pulse duration-[6s]" />

      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm dark:border-teal-400/20 dark:bg-white/10 dark:text-teal-200">
            <Sparkles size={16} className="text-yellow-500 animate-spin" />
            Find Your Dream Career Nest
          </div>
          
          <h1 className="mt-7 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Find the Right Career <br />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">
              That Feels Right
            </span> for You
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Explore thousands of job opportunities and build your future.
          </p>

          <form onSubmit={handleSearch} className="glass mt-8 rounded-3xl p-3 shadow-lg hover:shadow-xl transition-all border border-teal-100 dark:border-white/5">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-white px-4 dark:bg-white/10 border border-slate-100 dark:border-white/5 focus-within:ring-2 focus-within:ring-teal-500/20">
                <Search className="text-teal-600 shrink-0" size={20} />
                <input 
                  value={searchTitle} 
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-slate-800 dark:text-slate-100" 
                  placeholder="Job Title (e.g. Developer, Designer)" 
                />
              </label>
              
              <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-white px-4 dark:bg-white/10 border border-slate-100 dark:border-white/5 focus-within:ring-2 focus-within:ring-teal-500/20">
                <MapPin className="text-cyan-500 shrink-0" size={20} />
                <input 
                  value={searchLocation} 
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none text-slate-800 dark:text-slate-100" 
                  placeholder="Location (e.g. Bengaluru, Remote)" 
                />
              </label>
              
              <Button type="submit" className="min-h-14 px-8 text-base shadow-teal-500/10">
                Search <ArrowRight size={18} />
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 block mb-3">Popular Searches:</span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button 
                  type="button"
                  key={tag} 
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-teal-500 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:border-teal-400 dark:hover:text-teal-300 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Main Hero Image */}
          <div className="glass rounded-[2rem] p-4 border border-teal-100 dark:border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              alt="Professionals collaborating on matching candidates"
              className="aspect-[4/3] w-full rounded-[1.5rem] object-cover shadow-inner"
            />
          </div>
          
          {/* Interactive Floating Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="glass absolute -bottom-6 left-6 max-w-xs rounded-2xl p-4 shadow-xl border border-teal-100 dark:border-white/10 bg-white/95 dark:bg-slate-900/95"
          >
            <p className="text-xs uppercase tracking-wider font-extrabold text-teal-700 dark:text-teal-300">ATS Match Algorithm</p>
            <div className="mt-3 flex items-center justify-between gap-6">
              <div>
                <p className="text-2xl font-black text-slate-950 dark:text-white">96%</p>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Match score for Software Engineers</p>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};

export default Hero;

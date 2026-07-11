import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import { Button, Container } from "../../../components/ui";
import heroVideo from "../../../assets/Untitled design.mp4";

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
    <section className="relative flex min-h-[85vh] lg:min-h-[90vh] items-center justify-start overflow-hidden py-20 z-0">
      {/* Background Video */}
      <video
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          objectFit: "cover", 
          zIndex: -2,
          transform: "scale(1.03)"
        }}
      />

      {/* Dark Overlay */}
      <div 
        className="absolute inset-0"
        style={{ 
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,.68) 0%, rgba(0,0,0,.48) 45%, rgba(0,0,0,.18) 100%)",
          zIndex: -1
        }}
      />

      {/* Background Floating Decorative Blobs (Motion-animated, placed between video and overlay for subtle depth) */}
      <motion.div 
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-1/4 -z-25 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-800/5" 
      />
      <motion.div 
        animate={{
          x: [0, -35, 0],
          y: [0, 40, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 left-10 -z-25 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-800/5" 
      />

      <Container className="relative z-10 w-full">
        <div className="max-w-3xl flex flex-col items-center text-center lg:items-start lg:text-left mx-auto lg:mx-0 w-full">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-semibold text-teal-200 shadow-sm cursor-default self-center lg:self-start"
          >
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            ✨ Find Your Dream Career
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-7 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7.5xl leading-tight text-center lg:text-left"
          >
            Find Your Dream Job with{" "}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm font-black">
              CareerNest
            </span>
          </motion.h1>
          
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 text-center lg:text-left mx-auto lg:mx-0">
            Explore verified jobs, internships, remote opportunities, and top companies. Build your career with confidence.
          </p>

          {/* Primary and Secondary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start w-full"
          >
            <Button 
              to="/jobs" 
              variant="primary" 
              size="md"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg px-6 py-3 font-bold"
            >
              Search Jobs
            </Button>
            <Button 
              to="/companies" 
              variant="secondary" 
              size="md"
              className="backdrop-blur-sm bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 px-6 py-3 font-bold"
            >
              Explore Companies
            </Button>
          </motion.div>

          <form onSubmit={handleSearch} className="glass mt-8 w-full rounded-3xl p-4 shadow-2xl transition-all border border-white/10 bg-slate-900/80 backdrop-blur-xl focus-within:ring-4 focus-within:ring-teal-500/10 focus-within:border-teal-500/30">
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
              
              <Button type="submit" className="min-h-14 px-8 text-base bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300 font-bold tracking-wide rounded-2xl shadow-teal-500/20">
                Search <ArrowRight size={18} />
              </Button>
            </div>
          </form>

          <div className="mt-6 w-full text-center lg:text-left">
            <span className="text-sm font-semibold text-slate-300 block mb-3">Popular Searches:</span>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {popularTags.map((tag) => (
                <button 
                  type="button"
                  key={tag} 
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-slate-200 hover:border-teal-400 hover:text-teal-300 transition-all shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;


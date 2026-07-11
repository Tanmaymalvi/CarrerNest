import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Filter, Heart, Search, Share2, User } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Container } from "../../components/ui";
import { articles } from "../../data/careerArticles";

import "./CareerAdvice.css";
const ArticleCard = ({ article, index }) => {
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/career-advice/${article.id}`);
    toast.success("Article link copied");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:border-teal-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 dark:hover:border-teal-500/50"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30">
        <BookOpen size={56} className="text-teal-700 dark:text-teal-200" />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
            {article.category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{article.date}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">{article.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
              #{tag}
            </span>
          ))}
        </div>

        <div className="border-t border-slate-200 pt-4 dark:border-white/10">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1"><Clock size={14} />{article.readTime}</span>
            <span className="flex items-center gap-1"><User size={14} />{article.author}</span>
          </div>

          <div className="flex items-center justify-between">
            <Button to={`/career-advice/${article.id}`} className="flex-1 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20">
              Read Article
              <ArrowRight size={16} />
            </Button>
            <button
              onClick={() => setLiked(!liked)}
              className={`ml-2 flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                liked
                  ? "border-red-400 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10"
                  : "border-slate-200 bg-white text-slate-400 hover:border-red-400 dark:border-white/10 dark:bg-white/10 dark:text-slate-500"
              }`}
              aria-label="Like article"
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-all hover:border-teal-400 dark:border-white/10 dark:bg-white/10 dark:text-slate-500"
              aria-label="Share article"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const CareerAdvice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");

  const categories = ["All", "Interview Prep", "Career Growth", "Work Culture", "Networking"];
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = `${article.title} ${article.excerpt}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = () => {
    if (!email.trim()) {
      toast.error("Enter your email to subscribe");
      return;
    }
    toast.success("Subscribed to career tips");
    setEmail("");
  };

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
              💡 Learning & Growth
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Career Advice & <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-cyan-400">Resources</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Expert tips, strategies, and insights to advance your career.</p>
            <div className="mx-auto mt-8 max-w-2xl px-4">
              <div className="glass grid gap-3 sm:grid-cols-[1fr_auto] rounded-2xl bg-white border border-slate-200 dark:bg-white/10 dark:border-white/5 p-2 shadow-xl">
                <div className="flex items-center gap-3 px-2">
                  <Search className="text-teal-700 dark:text-teal-400" size={20} />
                  <input 
                    value={searchTerm} 
                    onChange={(event) => setSearchTerm(event.target.value)} 
                    type="text" 
                    placeholder="Search articles..." 
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

              {/* Collapsible Category Filters */}
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 glass rounded-2xl p-4 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5"
                >
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Article Category</span>
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

        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredArticles.length}</span> articles
        </p>

        {filteredArticles.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => <ArticleCard key={article.id} article={article} index={index} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-white/10 dark:bg-slate-900">
            <BookOpen size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">No articles found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </Container>

      <div className="border-t border-slate-200 bg-white px-4 py-16 dark:border-white/10 dark:bg-slate-950">
        <Container>
          <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-center text-white sm:p-12">
            <h2 className="mb-4 text-3xl font-bold">Get Career Tips in Your Inbox</h2>
            <p className="mb-8 text-cyan-100">Subscribe for weekly career advice, job tips, and industry insights.</p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-lg border-0 bg-white/20 px-4 py-3 text-white placeholder-cyan-100 outline-none focus:bg-white/30"
              />
              <Button type="button" onClick={handleSubscribe} className="bg-white text-teal-600 hover:bg-cyan-50">Subscribe</Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CareerAdvice;

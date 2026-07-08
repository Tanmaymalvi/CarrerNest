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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-16">
        <Container>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Career Advice & Resources</h1>
            <p className="mx-auto max-w-2xl text-lg text-cyan-100">Expert tips, strategies, and insights to advance your career.</p>
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border-0 bg-white px-12 py-4 text-slate-900 placeholder-slate-500 shadow-lg outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 md:hidden dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
          >
            <Filter size={18} />
            Filters
          </button>

          <div className={`grid gap-3 ${showFilters ? "" : "hidden md:grid"} grid-cols-2 md:grid-cols-5`}>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-4 py-2 font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500/50"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

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

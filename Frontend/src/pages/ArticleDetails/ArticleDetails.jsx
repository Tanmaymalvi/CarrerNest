import { Navigate, useParams } from "react-router-dom";
import { BookOpen, Clock, User } from "lucide-react";
import { Badge, Button, Container } from "../../components/ui";
import { articles } from "../../data/careerArticles";

import "./ArticleDetails.css";
const ArticleDetails = () => {
  const { id } = useParams();
  const article = articles.find((item) => item.id === id);

  if (!article) return <Navigate to="/career-advice" replace />;

  return (
    <article className="section-pad">
      <Container className="max-w-4xl">
        <Button to="/career-advice" variant="secondary" className="mb-6">Back to advice</Button>
        <div className="glass rounded-3xl p-6 sm:p-10">
          <Badge>{article.category}</Badge>
          <h1 className="mt-5 text-4xl font-extrabold text-slate-950 dark:text-white sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2"><User size={16} />{article.author}</span>
            <span className="flex items-center gap-2"><Clock size={16} />{article.readTime}</span>
            <span className="flex items-center gap-2"><BookOpen size={16} />{article.date}</span>
          </div>
          <div className="mt-8 space-y-5 text-base leading-8 text-slate-700 dark:text-slate-200">
            {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => <Badge key={tag} tone="slate">#{tag}</Badge>)}
          </div>
        </div>
      </Container>
    </article>
  );
};

export default ArticleDetails;

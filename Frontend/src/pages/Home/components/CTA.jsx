import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Container } from "../../../components/ui";

const CTA = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Simulate API subscription
    toast.success(`Subscribed successfully! Weekly insights sent to ${email}`);
    setEmail("");
  };

  return (
    <section className="px-4 pb-20">
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-teal-950 p-6 text-white shadow-2xl shadow-slate-950/20 sm:p-10 lg:p-12 border border-white/5">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Newsletter Subscription</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Get weekly hiring insights in your inbox.</h2>
              <p className="mt-4 max-w-2xl text-slate-300 text-sm leading-relaxed">
                Stay updated with the latest job trends, career resources, resume building hacks, and verified openings curated just for you.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="flex min-h-12 items-center gap-3 rounded-xl bg-white/10 px-4 ring-1 ring-white/10 focus-within:ring-teal-400">
                <Mail size={18} className="text-teal-300 shrink-0" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400" 
                  placeholder="Enter your email address" 
                  required
                />
              </label>
              <Button type="submit" className="bg-teal-500 text-slate-950 hover:bg-teal-400 border-none transition-all shadow-md">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;

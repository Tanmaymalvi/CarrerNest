import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader } from "lucide-react";

import "./AIAssistant.css";
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your CareerNest AI Assistant. I can help you with job search, resume tips, interview preparation, and career guidance. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    resume: "I can help you improve your resume! Here are some tips:\n• Keep it to 1 page\n• Use action verbs\n• Highlight achievements\n• Add keywords from the job description\n\nWould you like specific advice?",
    interview: "Interview preparation is key! Here's my advice:\n• Practice common questions\n• Research the company\n• Prepare examples using STAR method\n• Get a good night's sleep\n\nWhich type of interview are you preparing for?",
    job: "Finding the right job takes time. Here's my recommendation:\n• Set clear job preferences\n• Use filters and saved searches\n• Tailor your applications\n• Follow up after applying\n\nWhat type of role are you looking for?",
    skills: "Building skills is important for career growth:\n• Identify in-demand skills\n• Take online courses\n• Practice projects\n• Get certifications\n\nWhich skills would you like to develop?",
    salary: "Salary negotiation tips:\n• Research market rates\n• Highlight your value\n• Be confident but realistic\n• Consider total compensation\n\nWould you like tips for your specific role?",
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      let botResponse = "I'm here to help! Could you provide more details?";

      const lowerInput = inputValue.toLowerCase();

      if (lowerInput.includes("resume")) {
        botResponse = predefinedResponses.resume;
      } else if (lowerInput.includes("interview")) {
        botResponse = predefinedResponses.interview;
      } else if (lowerInput.includes("job") || lowerInput.includes("position")) {
        botResponse = predefinedResponses.job;
      } else if (lowerInput.includes("skill")) {
        botResponse = predefinedResponses.skills;
      } else if (lowerInput.includes("salary") || lowerInput.includes("pay")) {
        botResponse = predefinedResponses.salary;
      } else if (lowerInput.includes("hi") || lowerInput.includes("hello")) {
        botResponse = "Hello! 👋 How can I assist you with your career today?";
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 h-96 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4 text-white rounded-t-2xl dark:border-white/10">
              <div>
                <h3 className="font-semibold">Career Assistant</h3>
                <p className="text-xs text-teal-100">Online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                      message.sender === "user"
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce delay-200"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4 dark:border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder-slate-500 outline-none focus:border-teal-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder-slate-400"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
                >
                  {isLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-xl"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default AIAssistant;

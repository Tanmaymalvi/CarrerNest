import InterviewQuestion from "../models/InterviewQuestion.js";

// ─── Seed Data ─────────────────────────────────────────────────────────────
const seedQuestions = [
  // HR
  {
    category: "hr",
    question: "Tell me about yourself.",
    answer:
      "Focus on your recent academic or professional highlights, key skills, and how they align with the job you are applying for. Use the Present-Past-Future formula:\n• Present: Talk about your current status, recent project, or studies.\n• Past: Mention key internships, achievements, or tech stack learned.\n• Future: Explain why you are excited about this specific opportunity and how it matches your career goal.",
    difficulty: "Easy",
    tags: ["introduction", "self-assessment"],
  },
  {
    category: "hr",
    question: "What are your strengths and weaknesses?",
    answer:
      "• Strength: Share a genuine, work-related strength (e.g., quick learner, problem solver, team player) and back it up with a brief example.\n• Weakness: Share a real but non-critical weakness, and immediately explain how you are working to improve it (e.g., 'I used to struggle with public speaking, so I joined a club to practice').",
    difficulty: "Easy",
    tags: ["self-assessment", "behavioural"],
  },
  {
    category: "hr",
    question: "Why should we hire you?",
    answer:
      "Connect your specific skills, experience, and passion directly to the job requirements. Emphasize that you can start contributing quickly and are enthusiastic about the company's domain and values.",
    difficulty: "Medium",
    tags: ["motivation", "value-proposition"],
  },
  {
    category: "hr",
    question: "Where do you see yourself in 5 years?",
    answer:
      "Align your answer with the company's growth path. Be honest about wanting to grow technically and take on more responsibility, while showing commitment to the role and the organisation.",
    difficulty: "Medium",
    tags: ["career-goals", "long-term"],
  },
  {
    category: "hr",
    question: "Why do you want to work here?",
    answer:
      "Research the company's products, culture, and recent news before the interview. Mention specific reasons — technology stack, company culture, mission — that resonate with your career goals.",
    difficulty: "Easy",
    tags: ["motivation", "research"],
  },
  {
    category: "hr",
    question: "Describe a challenging situation and how you overcame it.",
    answer:
      "Use the STAR method: Situation — briefly describe the context. Task — explain your responsibility. Action — describe the specific steps you took. Result — share the positive outcome and what you learned.",
    difficulty: "Medium",
    tags: ["behavioural", "STAR", "problem-solving"],
  },

  // TECHNICAL
  {
    category: "technical",
    question: "What is the difference between let, const, and var?",
    answer:
      "• var is function-scoped, can be redeclared, and is hoisted with undefined initialization.\n• let is block-scoped, cannot be redeclared in the same block, and is hoisted to a 'Temporal Dead Zone'.\n• const is block-scoped like let, but its binding cannot be reassigned. Object/array properties can still be mutated.",
    difficulty: "Easy",
    tags: ["JavaScript", "variables", "scope"],
  },
  {
    category: "technical",
    question: "Explain React hooks and give examples.",
    answer:
      "Hooks let you use state and lifecycle features in functional components. Common hooks:\n• useState — manage local state.\n• useEffect — run side effects after render.\n• useContext — consume context without HOCs.\n• useRef — hold a mutable ref without triggering re-renders.\n• useMemo / useCallback — memoize values and callbacks for performance.",
    difficulty: "Medium",
    tags: ["React", "hooks", "frontend"],
  },
  {
    category: "technical",
    question: "Difference between SQL and NoSQL databases.",
    answer:
      "SQL databases are relational, use structured schemas, and support ACID transactions (e.g., MySQL, PostgreSQL). NoSQL databases are non-relational, schema-flexible, and scale horizontally easily (e.g., MongoDB, Redis). Choose SQL for complex queries and strong consistency; NoSQL for high-volume, flexible or hierarchical data.",
    difficulty: "Medium",
    tags: ["database", "SQL", "NoSQL", "MongoDB"],
  },
  {
    category: "technical",
    question: "What is JWT and how does it work?",
    answer:
      "JWT (JSON Web Token) is a compact, URL-safe token used for securely transmitting information. It has three parts: Header (algorithm), Payload (claims), and Signature (verification). The server signs the token with a secret; the client sends it on every request. The server verifies the signature without storing session data — making it stateless.",
    difficulty: "Medium",
    tags: ["security", "authentication", "JWT", "backend"],
  },
  {
    category: "technical",
    question: "What are the four pillars of Object-Oriented Programming?",
    answer:
      "1. Encapsulation: Binding data and methods within a class and restricting direct access.\n2. Abstraction: Hiding complex implementation details and exposing only essentials.\n3. Inheritance: Reusing properties and methods from a parent class in a child class.\n4. Polymorphism: A function or object behaving differently based on context (overloading / overriding).",
    difficulty: "Easy",
    tags: ["OOP", "concepts", "Java", "Python"],
  },
  {
    category: "technical",
    question: "What is normalization in databases?",
    answer:
      "Normalization organizes data to reduce redundancy and improve integrity by dividing large tables into smaller related ones. Common normal forms: 1NF (atomic values), 2NF (remove partial dependencies on composite keys), 3NF (remove transitive dependencies).",
    difficulty: "Medium",
    tags: ["DBMS", "database", "normalization"],
  },
  {
    category: "technical",
    question: "Explain the difference between a stack and a queue.",
    answer:
      "• Stack: LIFO (Last In First Out) — elements are pushed and popped from the same end (top). Used in undo operations, recursion call stacks.\n• Queue: FIFO (First In First Out) — elements are enqueued at the rear and dequeued from the front. Used in task scheduling, BFS.",
    difficulty: "Easy",
    tags: ["DSA", "data-structures", "stack", "queue"],
  },

  // APTITUDE
  {
    category: "aptitude",
    question: "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    answer:
      "Formula: Distance = Speed × Time\n1. Convert speed: 60 km/hr = 60 × (5/18) = 50/3 m/sec.\n2. Length = (50/3) × 9 = 150 meters.",
    difficulty: "Easy",
    tags: ["Quantitative", "trains", "speed"],
  },
  {
    category: "aptitude",
    question: "Look at this series: 2, 1, 1/2, 1/4, … What number comes next?",
    answer:
      "Each term is half the previous one (geometric progression with ratio 1/2).\n• 1/4 ÷ 2 = 1/8.\nAnswer: 1/8.",
    difficulty: "Easy",
    tags: ["Logical", "series", "patterns"],
  },
  {
    category: "aptitude",
    question: "The average of 5 consecutive numbers is 20. What is the largest number?",
    answer:
      "Let the numbers be x, x+1, x+2, x+3, x+4.\nSum = 5x + 10; Average = (5x + 10)/5 = x + 2 = 20 → x = 18.\nLargest = x + 4 = 22.",
    difficulty: "Easy",
    tags: ["Quantitative", "averages", "consecutive-numbers"],
  },
  {
    category: "aptitude",
    question: "If A can do a work in 10 days and B in 15 days, how long will they take working together?",
    answer:
      "A's rate = 1/10, B's rate = 1/15 per day.\nCombined = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 per day.\nTime together = 6 days.",
    difficulty: "Medium",
    tags: ["Quantitative", "work-and-time"],
  },
  {
    category: "aptitude",
    question: "Find the synonym of 'Candid'.",
    answer:
      "Candid means truthful, straightforward, and frank.\nSynonyms: Honest, Outspoken, Sincere, Blunt.\nAntonyms: Deceitful, Artful, Insincere.",
    difficulty: "Easy",
    tags: ["Verbal", "synonyms", "vocabulary"],
  },

  // EXPERIENCE
  {
    category: "experience",
    question: "TCS NQT Interview Experience — Software Engineer",
    answer:
      "Round 1 – NQT Exam: Verbal, Logical, Quantitative, and Programming sections. Coding questions focused on arrays and strings.\nRound 2 – Technical Interview: Questions on OOP, DBMS normalization, SQL queries, and one DSA problem (reverse a linked list).\nRound 3 – HR Interview: Tell me about yourself, situational questions, relocation flexibility.\nTip: Practice aptitude on PrepInsta and Leetcode Easy questions. TCS values communication as much as coding.",
    difficulty: "Medium",
    tags: ["TCS", "NQT", "software-engineer"],
    company: "TCS",
    role: "Software Engineer",
  },
  {
    category: "experience",
    question: "Infosys Systems Engineer Interview Experience",
    answer:
      "Round 1 – Aptitude + Coding: Two medium DSA problems (array manipulation + string matching). 90-minute window.\nRound 2 – Technical: Deep dive into OOPS, Java/Python basics, REST API concepts, and project explanation.\nRound 3 – HR: Career goals, work culture preferences, flexibility.\nTip: Focus on fundamentals — Infosys rarely asks hard algorithms. Your project explanation matters a lot.",
    difficulty: "Easy",
    tags: ["Infosys", "systems-engineer", "fresher"],
    company: "Infosys",
    role: "Systems Engineer",
  },
  {
    category: "experience",
    question: "Wipro WILP Interview Experience — Project Engineer",
    answer:
      "Round 1 – Online Test: Aptitude, English, and two coding questions (Easy level on HackerEarth).\nRound 2 – Technical: Basics of networking, OS, DBMS, and cloud concepts. Also asked about internship projects.\nRound 3 – HR: Standard HR questions. Focus is on attitude and learning mindset.\nTip: Wipro values attitude. Be confident about what you know and honest about what you don't.",
    difficulty: "Easy",
    tags: ["Wipro", "WILP", "project-engineer"],
    company: "Wipro",
    role: "Project Engineer",
  },
];

// ─── Seed if empty ─────────────────────────────────────────────────────────
const seedIfEmpty = async () => {
  const count = await InterviewQuestion.countDocuments();
  if (count === 0) {
    await InterviewQuestion.insertMany(seedQuestions);
    console.log("✅ Interview questions seeded successfully");
  }
};

// ─── GET /api/interview-questions ──────────────────────────────────────────
export const getAllQuestions = async (req, res) => {
  try {
    await seedIfEmpty();
    const questions = await InterviewQuestion.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch interview questions" });
  }
};

// ─── GET /api/interview-questions/category/:category ──────────────────────
export const getByCategory = async (req, res) => {
  try {
    await seedIfEmpty();
    const { category } = req.params;
    const valid = ["hr", "technical", "aptitude", "experience"];
    if (!valid.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }
    const questions = await InterviewQuestion.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Error fetching by category:", error);
    res.status(500).json({ success: false, message: "Failed to fetch questions" });
  }
};

// ─── GET /api/interview-questions/search?query= ───────────────────────────
export const searchQuestions = async (req, res) => {
  try {
    const { query, category } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: "Query parameter is required" });
    }

    const regex = new RegExp(query.trim(), "i");

    const filter = {
      $or: [
        { question: regex },
        { answer: regex },
        { tags: regex },
        { company: regex },
        { category: regex },
      ],
    };

    if (category && ["hr", "technical", "aptitude", "experience"].includes(category)) {
      filter.category = category;
    }

    const questions = await InterviewQuestion.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("Error searching questions:", error);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

// ─── POST /api/interview-questions ────────────────────────────────────────
export const createQuestion = async (req, res) => {
  try {
    const { category, question, answer, difficulty, tags, company, role } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({ success: false, message: "Category, question, and answer are required" });
    }

    const newQ = await InterviewQuestion.create({
      category,
      question,
      answer,
      difficulty: difficulty || "Medium",
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t) => t.trim()) : []),
      company: company || "",
      role: role || "",
    });

    res.status(201).json({ success: true, message: "Question created", question: newQ });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ success: false, message: "Failed to create question" });
  }
};

// ─── PUT /api/interview-questions/:id ─────────────────────────────────────
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, question, answer, difficulty, tags, company, role } = req.body;

    const update = {
      ...(category && { category }),
      ...(question && { question }),
      ...(answer && { answer }),
      ...(difficulty && { difficulty }),
      ...(company !== undefined && { company }),
      ...(role !== undefined && { role }),
    };

    if (tags !== undefined) {
      update.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    }

    const updated = await InterviewQuestion.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.status(200).json({ success: true, message: "Question updated", question: updated });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ success: false, message: "Failed to update question" });
  }
};

// ─── DELETE /api/interview-questions/:id ──────────────────────────────────
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InterviewQuestion.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ success: false, message: "Failed to delete question" });
  }
};

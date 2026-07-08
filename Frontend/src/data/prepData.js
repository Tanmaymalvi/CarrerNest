export const technicalQuestions = [
  {
    id: "tech-1",
    category: "JavaScript",
    question: "What is the difference between let, const, and var?",
    answer: "• var is function-scoped, can be redeclared, and is hoisted with undefined initialization.\n• let is block-scoped, cannot be redeclared in the same block, and is hoisted to a 'Temporal Dead Zone' (cannot be accessed before declaration).\n• const is also block-scoped like let, but its value cannot be reassigned once declared. However, properties of const objects or arrays can still be mutated.",
  },
  {
    id: "tech-2",
    category: "JavaScript",
    question: "What is a closure in JavaScript?",
    answer: "A closure is a combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In simple terms, a closure gives an inner function access to the outer function's scope even after the outer function has finished executing.",
  },
  {
    id: "tech-3",
    category: "React",
    question: "What are the rules of Hooks in React?",
    answer: "There are two main rules for using Hooks:\n1. Only call Hooks at the top level: Don't call Hooks inside loops, conditions, or nested functions to ensure they execute in the same order on every render.\n2. Only call Hooks from React Functions: Call them from React function components or from custom Hooks; do not call them from regular JavaScript functions.",
  },
  {
    id: "tech-4",
    category: "DBMS",
    question: "What is normalization and why is it used?",
    answer: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller tables and defining relationships between them. Common forms include 1NF (atomic values), 2NF (remove partial dependencies), and 3NF (remove transitive dependencies).",
  },
  {
    id: "tech-5",
    category: "DSA",
    question: "Explain the difference between a stack and a queue.",
    answer: "• Stack: Follows the LIFO (Last In First Out) principle. Elements are inserted (push) and removed (pop) from the same end (top). Example: Undo mechanism in text editors.\n• Queue: Follows the FIFO (First In First Out) principle. Elements are inserted at the rear (enqueue) and removed from the front (dequeue). Example: Printing queue.",
  },
  {
    id: "tech-6",
    category: "OOPs",
    question: "What are the four pillars of Object-Oriented Programming?",
    answer: "1. Encapsulation: Binding data and methods that operate on them within a single unit (class) and restricting direct access (using private variables/getters/setters).\n2. Abstraction: Hiding complex implementation details and showing only the essential features.\n3. Inheritance: Reusing properties and methods of an existing parent class in a new child class.\n4. Polymorphism: The ability of a message or function to be processed in more than one form (e.g., method overloading and method overriding).",
  },
];

export const aptitudeQuestions = [
  {
    id: "apt-1",
    category: "Quantitative",
    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    answer: "Formula: Distance = Speed × Time\n1. Speed = 60 km/hr = 60 × (5/18) m/sec = 50/3 m/sec.\n2. Time = 9 seconds.\n3. Distance (length of train) = (50/3) × 9 = 150 meters.",
  },
  {
    id: "apt-2",
    category: "Logical",
    question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    answer: "This is a geometric progression where each number is half of the previous number.\n• 2 / 2 = 1\n• 1 / 2 = 1/2\n• (1/2) / 2 = 1/4\n• (1/4) / 2 = 1/8\nAnswer: 1/8.",
  },
  {
    id: "apt-3",
    category: "Verbal",
    question: "Find the synonym of 'Candid'.",
    answer: "Candid means truthful, straightforward, and frank.\nSynonyms include: Honest, Outspoken, Sincere, Blunt.\nAntonyms include: Deceitful, Artful, Insincere.",
  },
  {
    id: "apt-4",
    category: "Quantitative",
    question: "The average of 5 consecutive numbers is 20. What is the largest of these numbers?",
    answer: "Let the 5 consecutive numbers be x, x+1, x+2, x+3, x+4.\nAverage = (Sum of numbers) / 5\nAverage = (5x + 10) / 5 = x + 2 = 20.\nx = 18.\nLargest number = x + 4 = 18 + 4 = 22.",
  },
];

export const topQuestions = [
  {
    id: "top-1",
    question: "Tell me about yourself.",
    answer: "Focus on your recent academic or professional highlights, key skills, and how they align with the job you are applying for. Use the Present-Past-Future formula:\n• Present: Talk about your current status, recent project, or studies.\n• Past: Mention key internships, achievements, or tech stack learned.\n• Future: Explain why you are excited about this specific opportunity and how it matches your career goal.",
  },
  {
    id: "top-2",
    question: "What are your strengths and weaknesses?",
    answer: "• Strength: Share a genuine, work-related strength (e.g., quick learner, problem solver, team player) and back it up with a brief example.\n• Weakness: Share a real but non-critical weakness, and immediately explain how you are working to improve it (e.g., 'I used to struggle with public speaking, so I joined a club to practice and feel more confident').",
  },
  {
    id: "top-3",
    question: "Why should we hire you?",
    answer: "Connect your specific skills, experience, and passion directly to the job requirements. Emphasize that you can start contributing quickly and are enthusiastic about the company's domain and values.",
  },
];

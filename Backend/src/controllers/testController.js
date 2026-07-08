import Test from "../models/Test.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import PDFDocument from "pdfkit";

// Helpers
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generate PDF Certificate in Base64
const generatePDFCertificate = (userName, testTitle, score, percentage, dateString, certId) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 40,
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(`data:application/pdf;base64,${pdfData.toString("base64")}`);
      });

      // Background Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(4)
         .stroke("#0d9488"); // Teal border

      doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52)
         .lineWidth(1)
         .stroke("#06b6d4"); // Cyan inner border

      // Decorative corners
      doc.fillColor("#0d9488").rect(20, 20, 15, 15).fill();
      doc.rect(doc.page.width - 35, 20, 15, 15).fill();
      doc.rect(20, doc.page.height - 35, 15, 15).fill();
      doc.rect(doc.page.width - 35, doc.page.height - 35, 15, 15).fill();

      // Logo/Branding
      doc.fillColor("#0f172a").fontSize(26).font("Helvetica-Bold").text("CareerNest", { align: "center", dy: 40 });
      doc.fontSize(10).font("Helvetica").fillColor("#64748b").text("ONLINE ASSESSMENT & CERTIFICATION", { align: "center" });

      doc.moveDown(2);

      // Certificate Title
      doc.fontSize(22).font("Times-Bold").fillColor("#0d9488").text("CERTIFICATE OF COMPLETION", { align: "center" });
      
      doc.moveDown(1.5);
      doc.fontSize(14).font("Helvetica-Oblique").fillColor("#334155").text("This is proudly presented to", { align: "center" });
      
      doc.moveDown(1);
      doc.fontSize(28).font("Helvetica-Bold").fillColor("#0f172a").text(userName, { align: "center" });
      
      doc.moveDown(1);
      doc.fontSize(14).font("Helvetica").fillColor("#334155").text(`for successfully clearing the online assessment for`, { align: "center" });
      doc.fontSize(16).font("Helvetica-Bold").fillColor("#0d9488").text(testTitle, { align: "center" });

      doc.moveDown(2);

      // Score and details
      doc.fontSize(12).font("Helvetica").fillColor("#334155").text(`Score: ${score}/20 (${percentage}%) | Status: PASSED`, { align: "center" });
      doc.fontSize(11).fillColor("#64748b").text(`Date of Issue: ${dateString}`, { align: "center" });
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#0f172a").text(`Certificate ID: ${certId}`, { align: "center" });

      // Signature area
      doc.moveDown(3);
      
      const sigLineY = doc.y;
      
      // Signature lines
      doc.moveTo(100, sigLineY).lineTo(280, sigLineY).lineWidth(1).stroke("#cbd5e1");
      doc.moveTo(doc.page.width - 280, sigLineY).lineTo(doc.page.width - 100, sigLineY).lineWidth(1).stroke("#cbd5e1");

      doc.fontSize(10).font("Helvetica").fillColor("#64748b");
      doc.text("CareerNest Coordinator", 100, sigLineY + 5, { width: 180, align: "center" });
      doc.text("Authorized Signature", doc.page.width - 280, sigLineY + 5, { width: 180, align: "center" });

      // Signatures
      doc.fontSize(14).font("Times-BoldItalic").fillColor("#0f172a");
      doc.text("Rohit Bramhe", 100, sigLineY - 18, { width: 180, align: "center" });
      doc.text("CareerNest Assessment Team", doc.page.width - 280, sigLineY - 18, { width: 180, align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

// Seed questions helper
const seedTestsAndQuestions = async () => {
  const testCount = await Test.countDocuments();
  if (testCount > 0) return;

  const hrTest = await Test.create({
    title: "HR Assessment",
    category: "hr",
    description: "Evaluate your workplace ethics, behavioral traits, leadership potential, and communication skills.",
    difficulty: "Easy",
    duration: 30,
    totalQuestions: 20,
    passingMarks: 12,
  });

  const technicalTest = await Test.create({
    title: "Technical Assessment",
    category: "technical",
    description: "Assess your programming fundamentals, database concepts, web technologies, and software engineering principles.",
    difficulty: "Medium",
    duration: 30,
    totalQuestions: 20,
    passingMarks: 12,
  });

  const aptitudeTest = await Test.create({
    title: "Aptitude Assessment",
    category: "aptitude",
    description: "Test your quantitative ability, logical reasoning, numerical problem-solving, and verbal reasoning skills.",
    difficulty: "Hard",
    duration: 30,
    totalQuestions: 20,
    passingMarks: 12,
  });

  // Seed 25 HR questions
  const hrQuestions = [
    { testId: hrTest._id, category: "hr", question: "If a coworker takes credit for your work, what should you do?", options: ["Confront them angrily in front of the team", "Ignore it and hope it does not happen again", "Discuss it privately with the coworker and seek an amicable resolution", "Complain to the CEO immediately"], correctAnswer: "Discuss it privately with the coworker and seek an amicable resolution" },
    { testId: hrTest._id, category: "hr", question: "How do you handle tight deadlines and high-pressure projects?", options: ["Panic and work long hours without break", "Prioritize tasks, manage time effectively, and communicate updates", "Ask coworkers to do your work", "Submit incomplete work on time"], correctAnswer: "Prioritize tasks, manage time effectively, and communicate updates" },
    { testId: hrTest._id, category: "hr", question: "What is active listening?", options: ["Hearing sounds while doing other work", "Focusing fully on the speaker, understanding, and responding thoughtfully", "Waiting for your turn to speak without listening", "Recording the conversation to listen later"], correctAnswer: "Focusing fully on the speaker, understanding, and responding thoughtfully" },
    { testId: hrTest._id, category: "hr", question: "What is the best way to deliver constructive feedback to a peer?", options: ["Criticize their personality openly", "Focus on specific behaviors, actions, and suggest positive improvements", "Send an anonymous email", "Avoid giving feedback completely"], correctAnswer: "Focus on specific behaviors, actions, and suggest positive improvements" },
    { testId: hrTest._id, category: "hr", question: "Why is diversity important in a workplace?", options: ["It is just a legal requirement", "It brings diverse perspectives, creativity, and better problem solving", "It makes hiring more complex", "It guarantees higher salary packages"], correctAnswer: "It brings diverse perspectives, creativity, and better problem solving" },
    { testId: hrTest._id, category: "hr", question: "What is professional integrity?", options: ["Following rules only when being watched", "Doing the right thing and holding yourself to high ethical standards", "Agreeing with everything your manager says", "Using company resources for personal use"], correctAnswer: "Doing the right thing and holding yourself to high ethical standards" },
    { testId: hrTest._id, category: "hr", question: "How should you respond to a customer complaint?", options: ["Defend yourself and argue", "Acknowledge the issue, apologize, and offer a swift solution", "Transfer them to another department immediately", "Ignore the message"], correctAnswer: "Acknowledge the issue, apologize, and offer a swift solution" },
    { testId: hrTest._id, category: "hr", question: "What does the term 'Emotional Intelligence' mean?", options: ["Being overly emotional at work", "The ability to recognize, understand, and manage own and others' emotions", "Hiding all emotions at work", "Testing candidates using AI"], correctAnswer: "The ability to recognize, understand, and manage own and others' emotions" },
    { testId: hrTest._id, category: "hr", question: "How would you handle a conflict between two team members?", options: ["Take sides and support one of them", "Encourage them to talk it out and mediate neutrally if needed", "Report both to HR for disciplinary action", "Ignore the conflict completely"], correctAnswer: "Encourage them to talk it out and mediate neutrally if needed" },
    { testId: hrTest._id, category: "hr", question: "What is the primary role of a team leader?", options: ["To dictate terms and monitor hours", "To guide, support, facilitate, and empower team members", "To do all the work themselves", "To blame the team for failures"], correctAnswer: "To guide, support, facilitate, and empower team members" },
    { testId: hrTest._id, category: "hr", question: "How do you stay motivated during repetitive or routine tasks?", options: ["Complain about the work constantly", "Find ways to optimize the task and focus on its contribution to the bigger picture", "Do the task slowly to pass time", "Delegate it to an intern without permission"], correctAnswer: "Find ways to optimize the task and focus on its contribution to the bigger picture" },
    { testId: hrTest._id, category: "hr", question: "What is the most professional response to a critical performance review?", options: ["Get defensive and blame others", "Listen actively, request specific examples, and build an improvement plan", "Resign immediately", "Argue with your manager"], correctAnswer: "Listen actively, request specific examples, and build an improvement plan" },
    { testId: hrTest._id, category: "hr", question: "What does alignment with company culture mean?", options: ["Losing your individuality", "Sharing the same core values, mission, and work practices as the organization", "Wearing the same clothes as everyone else", "Working overtime without pay"], correctAnswer: "Sharing the same core values, mission, and work practices as the organization" },
    { testId: hrTest._id, category: "hr", question: "How do you handle ambiguity in a project description?", options: ["Guess what needs to be done and proceed", "Proactively seek clarification from stakeholders or team lead", "Do nothing until someone notices", "Complain about the client"], correctAnswer: "Proactively seek clarification from stakeholders or team lead" },
    { testId: hrTest._id, category: "hr", question: "What is the main goal of performance appraisals?", options: ["To punish poor performers", "To evaluate progress, align goals, and foster career development", "To cut operational costs", "To rank employees from best to worst"], correctAnswer: "To evaluate progress, align goals, and foster career development" },
    { testId: hrTest._id, category: "hr", question: "Why is punctuality important in professional settings?", options: ["It proves you have no personal life", "It demonstrates respect for others' time and reliability", "It is only important for remote workers", "It guarantees a promotion"], correctAnswer: "It demonstrates respect for others' time and reliability" },
    { testId: hrTest._id, category: "hr", question: "What is the best way to handle work-related stress?", options: ["Keep it to yourself and suffer silently", "Practice healthy habits, manage time, and discuss workload with your lead if needed", "Quit the job instantly", "Venting on social media"], correctAnswer: "Practice healthy habits, manage time, and discuss workload with your lead if needed" },
    { testId: hrTest._id, category: "hr", question: "What does 'collaboration' mean?", options: ["Working individually without talking to anyone", "Working jointly with others to achieve a common goal", "Copying someone else's project", "Letting others do your work"], correctAnswer: "Working jointly with others to achieve a common goal" },
    { testId: hrTest._id, category: "hr", question: "How do you handle constructive criticism?", options: ["Accept it as personal attack", "Analyze objectively, learn from it, and improve performance", "Ignore it", "Report the person criticizing you"], correctAnswer: "Analyze objectively, learn from it, and improve performance" },
    { testId: hrTest._id, category: "hr", question: "What does 'professionalism' encompass?", options: ["Just wearing formal clothes", "Skill, good judgment, respectful behavior, and ethical conduct", "Working 15 hours a day", "Having a high-paying job"], correctAnswer: "Skill, good judgment, respectful behavior, and ethical conduct" },
    { testId: hrTest._id, category: "hr", question: "How should you prepare for an interview?", options: ["Do no research and wing it", "Research the company, practice coding/behavioral questions, and prepare queries", "Just read your resume once", "Memorize all answers"], correctAnswer: "Research the company, practice coding/behavioral questions, and prepare queries" },
    { testId: hrTest._id, category: "hr", question: "What is the purpose of a probation period in employment?", options: ["To pay the employee less", "To assess suitability and fit for the role before permanent confirmation", "To restrict employee benefits forever", "To force the employee to work harder"], correctAnswer: "To assess suitability and fit for the role before permanent confirmation" },
    { testId: hrTest._id, category: "hr", question: "What is the best practice for professional email communication?", options: ["Using casual text abbreviations", "Writing clear subject lines, concise text, and professional sign-offs", "Not checking spelling", "Sending huge attachments without context"], correctAnswer: "Writing clear subject lines, concise text, and professional sign-offs" },
    { testId: hrTest._id, category: "hr", question: "How do you show initiative in your job?", options: ["Waiting for tasks to be assigned", "Identifying problems and proposing/implementing constructive solutions proactively", "Doing only what is written in the contract", "Asking your manager for guidance every hour"], correctAnswer: "Identifying problems and proposing/implementing constructive solutions proactively" },
    { testId: hrTest._id, category: "hr", question: "What should you do if you notice a safety violation in the office?", options: ["Ignore it if it doesn't affect you", "Report it immediately to the safety officer or facility manager", "Take a picture and post it online", "Tell your coworkers but do nothing"], correctAnswer: "Report it immediately to the safety officer or facility manager" }
  ];

  // Seed 25 Technical questions
  const techQuestions = [
    { testId: technicalTest._id, category: "technical", question: "Which HTTP status code represents 'Unauthorized' access?", options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"], correctAnswer: "401 Unauthorized" },
    { testId: technicalTest._id, category: "technical", question: "What is the main advantage of using JSON Web Tokens (JWT) for authentication?", options: ["They are stateful and require database lookup", "They are stateless, self-contained, and easily scalable", "They encrypt all database traffic automatically", "They prevent SQL injection completely"], correctAnswer: "They are stateless, self-contained, and easily scalable" },
    { testId: technicalTest._id, category: "technical", question: "In React, what is the purpose of the useEffect hook?", options: ["To manage local state variables", "To perform side effects like fetching data, subscriptions, or manual DOM updates", "To memoize expensive calculations", "To force-reload the web page"], correctAnswer: "To perform side effects like fetching data, subscriptions, or manual DOM updates" },
    { testId: technicalTest._id, category: "technical", question: "Which SQL clause is used to filter records after aggregation using GROUP BY?", options: ["WHERE", "HAVING", "ORDER BY", "DISTINCT"], correctAnswer: "HAVING" },
    { testId: technicalTest._id, category: "technical", question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?", options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"], correctAnswer: "O(log N)" },
    { testId: technicalTest._id, category: "technical", question: "Which CSS property is used to change the text color of an element?", options: ["text-color", "color", "font-color", "background-color"], correctAnswer: "color" },
    { testId: technicalTest._id, category: "technical", question: "What is the primary role of a DNS (Domain Name System) server?", options: ["To encrypt web traffic", "To translate domain names (like google.com) into IP addresses", "To host website static files", "To serve backend APIs"], correctAnswer: "To translate domain names (like google.com) into IP addresses" },
    { testId: technicalTest._id, category: "technical", question: "What is the purpose of git merge?", options: ["To delete a local branch", "To join two or more development histories together", "To undo the last commit", "To upload local code to GitHub"], correctAnswer: "To join two or more development histories together" },
    { testId: technicalTest._id, category: "technical", question: "Which of the following database scaling techniques involves dividing data horizontally across multiple servers?", options: ["Vertical Scaling", "Replication", "Sharding", "Indexing"], correctAnswer: "Sharding" },
    { testId: technicalTest._id, category: "technical", question: "What is CORS in web development?", options: ["Cross-Origin Resource Sharing", "Client-Oriented Routing System", "Cached Object Recovery Protocol", "Computer-Optimized Recovery Server"], correctAnswer: "Cross-Origin Resource Sharing" },
    { testId: technicalTest._id, category: "technical", question: "What is the difference between double equals (==) and triple equals (===) in JavaScript?", options: ["No difference", "== compares only value; === compares both value and data type", "== compares data types; === compares only values", "== is for strings; === is for numbers"], correctAnswer: "== compares only value; === compares both value and data type" },
    { testId: technicalTest._id, category: "technical", question: "Which keyword is used to handle exceptions in Java/JavaScript?", options: ["catch", "try", "throw", "All of the above"], correctAnswer: "All of the above" },
    { testId: technicalTest._id, category: "technical", question: "What is a callback function in JavaScript?", options: ["A function passed as an argument to another function, to be executed later", "A function that calls itself recursively", "A function that runs immediately in the head section", "A function that has no return statement"], correctAnswer: "A function passed as an argument to another function, to be executed later" },
    { testId: technicalTest._id, category: "technical", question: "What is the primary purpose of Redux in a React application?", options: ["To build database APIs", "To serve as a global and predictable state container", "To manage CSS animations", "To navigate between routes"], correctAnswer: "To serve as a global and predictable state container" },
    { testId: technicalTest._id, category: "technical", question: "Which database model does MongoDB use?", options: ["Relational Model", "Document-oriented NoSQL Model", "Key-Value Model", "Graph Model"], correctAnswer: "Document-oriented NoSQL Model" },
    { testId: technicalTest._id, category: "technical", question: "What is the purpose of an index in a database table?", options: ["To encrypt sensitive column values", "To speed up data retrieval operations", "To validate integrity constraints", "To delete old data"], correctAnswer: "To speed up data retrieval operations" },
    { testId: technicalTest._id, category: "technical", question: "What does DOM stand for in web development?", options: ["Document Object Model", "Database Operating Manager", "Digital Object Media", "Distributed Origin Module"], correctAnswer: "Document Object Model" },
    { testId: technicalTest._id, category: "technical", question: "Which tag is used to create a hyperlink in HTML?", options: ["<link>", "<a>", "<href>", "<route>"], correctAnswer: "<a>" },
    { testId: technicalTest._id, category: "technical", question: "What is virtual DOM in React?", options: ["A complete copy of the operating system window", "A lightweight, in-memory representation of the real DOM", "A CSS styling framework", "An external routing service"], correctAnswer: "A lightweight, in-memory representation of the real DOM" },
    { testId: technicalTest._id, category: "technical", question: "Which of the following is NOT a fundamental concept of OOP?", options: ["Encapsulation", "Polymorphism", "Compilation", "Inheritance"], correctAnswer: "Compilation" },
    { testId: technicalTest._id, category: "technical", question: "What is the port number of the default HTTPS protocol?", options: ["80", "8080", "443", "3000"], correctAnswer: "443" },
    { testId: technicalTest._id, category: "technical", question: "What does REST stand for in API design?", options: ["Representational State Transfer", "Request-Event Service Terminal", "Reactive System Template", "Remote Storage Tracker"], correctAnswer: "Representational State Transfer" },
    { testId: technicalTest._id, category: "technical", question: "What is the purpose of Docker?", options: ["To compile Java programs", "To package applications into isolated, portable containers", "To serve databases globally", "To design graphics"], correctAnswer: "To package applications into isolated, portable containers" },
    { testId: technicalTest._id, category: "technical", question: "Which SQL keyword is used to remove duplicates from query results?", options: ["UNIQUE", "DISTINCT", "FILTER", "REDUCE"], correctAnswer: "DISTINCT" },
    { testId: technicalTest._id, category: "technical", question: "What does MVC stand for in software architecture?", options: ["Model-View-Controller", "Medium-Value-Computation", "Module-Vector-Collection", "Multiple-View-Channel"], correctAnswer: "Model-View-Controller" }
  ];

  // Seed 25 Aptitude questions
  const aptQuestions = [
    { testId: aptitudeTest._id, category: "aptitude", question: "A train running at 72 km/hr crosses a platform of length 200m in 15 seconds. What is the length of the train?", options: ["100 meters", "200 meters", "150 meters", "120 meters"], correctAnswer: "100 meters" },
    { testId: aptitudeTest._id, category: "aptitude", question: "If the ratio of present ages of A and B is 3:4 and the sum of their ages is 28 years, what will be A's age after 5 years?", options: ["12 years", "17 years", "21 years", "16 years"], correctAnswer: "17 years" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A shopkeeper sells an item for Rs. 480 making a profit of 20%. What was the cost price of the item?", options: ["Rs. 400", "Rs. 380", "Rs. 420", "Rs. 440"], correctAnswer: "Rs. 400" },
    { testId: aptitudeTest._id, category: "aptitude", question: "If 12 men can build a wall in 20 days, how many days will it take 15 men to build the same wall?", options: ["16 days", "15 days", "18 days", "24 days"], correctAnswer: "16 days" },
    { testId: aptitudeTest._id, category: "aptitude", question: "Find the odd one out of the series: 3, 5, 7, 9, 11, 13", options: ["5", "9", "11", "13"], correctAnswer: "9" },
    { testId: aptitudeTest._id, category: "aptitude", question: "Look at the series: 36, 34, 30, 28, 24, ... What number should come next?", options: ["22", "20", "18", "23"], correctAnswer: "22" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A sum of money doubles itself in 5 years at simple interest. In how many years will it become 4 times itself?", options: ["10 years", "15 years", "20 years", "12 years"], correctAnswer: "15 years" },
    { testId: aptitudeTest._id, category: "aptitude", question: "Two numbers are in the ratio 2:3. If their LCM is 48, what is their HCF?", options: ["8", "6", "4", "12"], correctAnswer: "8" }
  ];

  // Let's add remaining questions to reach 25
  const extraApt = [
    { testId: aptitudeTest._id, category: "aptitude", question: "If 'PENCIL' is coded as 'QFO DJM', how will 'PAPER' be coded?", options: ["QBQFS", "QBQES", "QCPFS", "QBPES"], correctAnswer: "QBQFS" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A and B start a business. A invests Rs. 2000 for 6 months and B invests Rs. 1500 for 8 months. What is their profit ratio?", options: ["1:1", "4:3", "3:4", "2:3"], correctAnswer: "1:1" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A person covers a distance of 12 km at 4 km/hr and another 15 km at 5 km/hr. What is their average speed?", options: ["4.5 km/hr", "5 km/hr", "4.8 km/hr", "4.6 km/hr"], correctAnswer: "4.5 km/hr" },
    { testId: aptitudeTest._id, category: "aptitude", question: "The average of 7 numbers is 30. If the average of first 3 is 25 and next 3 is 33, what is the last number?", options: ["36", "30", "42", "28"], correctAnswer: "36" },
    { testId: aptitudeTest._id, category: "aptitude", question: "What is the probability of getting an even number on rolling a single 6-sided die?", options: ["1/2", "1/3", "2/3", "1/6"], correctAnswer: "1/2" },
    { testId: aptitudeTest._id, category: "aptitude", question: "In a class of 60 students, 40% are girls. How many boys are there in the class?", options: ["36", "24", "40", "30"], correctAnswer: "36" },
    { testId: aptitudeTest._id, category: "aptitude", question: "If 10% of x is equal to 20% of y, what is the ratio of x to y?", options: ["2:1", "1:2", "10:20", "20:10"], correctAnswer: "2:1" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A card is drawn from a pack of 52 cards. What is the probability of drawing a King?", options: ["1/13", "1/52", "4/13", "1/4"], correctAnswer: "1/13" },
    { testId: aptitudeTest._id, category: "aptitude", question: "Find the simple interest on Rs. 5000 at 10% per annum for 3 years.", options: ["Rs. 1500", "Rs. 1000", "Rs. 500", "Rs. 2000"], correctAnswer: "Rs. 1500" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A boat goes 15 km downstream in 1 hour. If the speed of stream is 3 km/hr, what is the speed of boat in still water?", options: ["12 km/hr", "18 km/hr", "9 km/hr", "15 km/hr"], correctAnswer: "12 km/hr" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A can finish a work in 15 days, and B can do the same work in 10 days. How long will A and B take together?", options: ["6 days", "5 days", "7.5 days", "8 days"], correctAnswer: "6 days" },
    { testId: aptitudeTest._id, category: "aptitude", question: "What is the compound interest on Rs. 1000 for 2 years at 10% interest per annum compounded annually?", options: ["Rs. 210", "Rs. 200", "Rs. 110", "Rs. 220"], correctAnswer: "Rs. 210" },
    { testId: aptitudeTest._id, category: "aptitude", question: "A cube has a volume of 125 cm3. What is the total surface area of the cube?", options: ["150 cm2", "125 cm2", "100 cm2", "200 cm2"], correctAnswer: "150 cm2" },
    { testId: aptitudeTest._id, category: "aptitude", question: "In a map, 2cm represents 50 km. What distance is represented by 7.5cm?", options: ["187.5 km", "150 km", "200 km", "175 km"], correctAnswer: "187.5 km" },
    { testId: aptitudeTest._id, category: "aptitude", question: "The ratio of numbers of boys and girls in a school is 5:3. If there are 800 students in total, how many girls are there?", options: ["300", "500", "400", "250"], correctAnswer: "300" },
    { testId: aptitudeTest._id, category: "aptitude", question: "If the cost price of 10 articles is equal to the selling price of 8 articles, what is the profit percentage?", options: ["25%", "20%", "30%", "15%"], correctAnswer: "25%" },
    { testId: aptitudeTest._id, category: "aptitude", question: "What is the value of 15% of 200 + 20% of 150?", options: ["60", "30", "50", "45"], correctAnswer: "60" }
  ];

  await Question.insertMany([...hrQuestions, ...techQuestions, ...aptQuestions, ...extraApt]);
  console.log("✅ Seeded assessment tests and questions successfully.");
};

// GET /api/tests
export const getAllTests = async (req, res) => {
  try {
    await seedTestsAndQuestions();
    const tests = await Test.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch tests" });
  }
};

// GET /api/tests/:id
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }
    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch test" });
  }
};

// POST /api/tests/start
export const startTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // MongoDB aggregation with $sample to fetch 20 random questions
    const questions = await Question.aggregate([
      { $match: { testId: test._id } },
      { $sample: { size: 20 } }
    ]);

    // Shuffle questions and options to ensure random sequence for every user
    const preparedQuestions = questions.map((q) => {
      return {
        _id: q._id,
        question: q.question,
        options: shuffleArray(q.options),
        difficulty: q.difficulty,
        marks: q.marks,
      };
    });

    res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        duration: test.duration,
        totalQuestions: test.totalQuestions,
      },
      questions: preparedQuestions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to start test" });
  }
};

// POST /api/tests/submit
export const submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body; // answers: [{ questionId, selectedAnswer }]
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const questionIds = (answers || []).map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let score = 0;

    const answersMap = {};
    (answers || []).forEach((a) => {
      answersMap[a.questionId] = a.selectedAnswer;
    });

    questions.forEach((q) => {
      const selected = answersMap[q._id.toString()];
      if (selected === q.correctAnswer) {
        correctAnswers++;
        score += q.marks;
      } else {
        wrongAnswers++;
      }
    });

    const totalQ = test.totalQuestions;
    const percentage = Math.round((correctAnswers / totalQ) * 100);
    const status = percentage >= 60 ? "PASSED" : "FAILED";

    const result = new Result({
      userId,
      testId,
      score,
      correctAnswers,
      wrongAnswers: totalQ - correctAnswers, // Force to match totalQ
      percentage,
      status,
    });
    await result.save();

    let certificate = null;
    if (status === "PASSED") {
      const user = await User.findById(userId);
      const count = await Certificate.countDocuments();
      const certificateId = `CN-2026-${String(count + 1).padStart(6, "0")}`;
      const dateString = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Generate PDF certificate as base64 data url
      const pdfBase64 = await generatePDFCertificate(
        user.name || "CareerNest Candidate",
        test.title,
        correctAnswers,
        percentage,
        dateString,
        certificateId
      );

      certificate = new Certificate({
        userId,
        testId,
        certificateId,
        score: correctAnswers,
        percentage,
        certificateUrl: pdfBase64,
      });
      await certificate.save();
    }

    res.status(201).json({
      success: true,
      message: "Test submitted successfully",
      result,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Submission failed" });
  }
};

// GET /api/results/my
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate("testId", "title category difficulty")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

// GET /api/certificates/my
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .populate("testId", "title category difficulty")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch certificates" });
  }
};

// Admin: Create Test
export const createTest = async (req, res) => {
  try {
    const { title, category, description, difficulty, duration, totalQuestions, passingMarks } = req.body;
    const test = await Test.create({ title, category, description, difficulty, duration, totalQuestions, passingMarks });
    res.status(201).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to create test" });
  }
};

// Admin: Update Test
export const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    res.status(200).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to update test" });
  }
};

// Admin: Delete Test
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });
    // Also clean up questions associated with this test
    await Question.deleteMany({ testId: test._id });
    res.status(200).json({ success: true, message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to delete test" });
  }
};

// Admin: Get all Questions for a Test or Category
export const getQuestionsForAdmin = async (req, res) => {
  try {
    const filter = {};
    if (req.query.testId) filter.testId = req.query.testId;
    if (req.query.category) filter.category = req.query.category;
    const questions = await Question.find(filter).populate("testId", "title").sort({ createdAt: -1 });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to fetch questions" });
  }
};

// Admin: Create Question
export const createAssessmentQuestion = async (req, res) => {
  try {
    const { testId, category, question, options, correctAnswer, difficulty, marks } = req.body;
    const newQ = await Question.create({ testId, category, question, options, correctAnswer, difficulty, marks });
    res.status(201).json({ success: true, question: newQ });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to create question" });
  }
};

// Admin: Update Question
export const updateAssessmentQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Question not found" });
    res.status(200).json({ success: true, question: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to update question" });
  }
};

// Admin: Delete Question
export const deleteAssessmentQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Question not found" });
    res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to delete question" });
  }
};

// Admin: Get all results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("userId", "name email")
      .populate("testId", "title category")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import { Award, Briefcase, Download, Eye, FileText, Globe, GraduationCap, Layout, Link2, Plus, RefreshCw, Save, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";
import { resumesApi } from "../../services/api";

const ResumeDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumesList, setResumesList] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);

  // Resume Form Fields
  const [title, setTitle] = useState("My Professional Resume");
  const [template, setTemplate] = useState("classic");

  // Data Schema Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [careerObjective, setCareerObjective] = useState("");
  
  // Lists
  const [educationList, setEducationList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [internshipsList, setInternshipsList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [certificationsList, setCertificationsList] = useState([]);
  const [achievementsList, setAchievementsList] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  
  // Social Links
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [hackerrankUrl, setHackerrankUrl] = useState("");

  // Input states for item adding
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduBranch, setEduBranch] = useState("");
  const [eduYear, setEduYear] = useState("");

  const [projTitle, setProjTitle] = useState("");
  const [projTech, setProjTech] = useState("");
  const [projDesc, setProjDesc] = useState("");

  const [internRole, setInternRole] = useState("");
  const [internCompany, setInternCompany] = useState("");
  const [internDuration, setInternDuration] = useState("");
  const [internDesc, setInternDesc] = useState("");

  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");

  const [newSkill, setNewSkill] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newAch, setNewAch] = useState("");

  // Sidebar sections selector inside the form
  const [formSection, setFormSection] = useState("personal");

  const loadResumes = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await resumesApi.list(userId);
      const list = data.resumes || [];
      setResumesList(list);

      // Select primary or first resume
      const primary = list.find((r) => r.isPrimary) || list[0];
      if (primary) {
        setActiveResumeId(primary._id);
        populateForm(primary);
      } else {
        // Initialize with user profile defaults
        setFullName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.phone || "");
        setLocation(user?.location || "");
        setSkillsList(user?.skills || []);
      }
    } catch (error) {
      toast.error("Could not fetch resume records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, [userId]);

  const populateForm = (resume) => {
    setTitle(resume.title || "My Professional Resume");
    setTemplate(resume.template || "classic");

    const rData = resume.data || {};
    const personal = rData.personalDetails || {};
    
    setFullName(personal.fullName || user?.name || "");
    setEmail(personal.email || user?.email || "");
    setPhone(personal.phone || user?.phone || "");
    setLocation(personal.location || user?.location || "");
    setCareerObjective(rData.careerObjective || "");

    setEducationList(rData.education || []);
    setSkillsList(rData.skills || []);
    setProjectsList(rData.projects || []);
    setInternshipsList(rData.internships || []);
    setExperienceList(rData.experience || []);
    setCertificationsList(rData.certifications || []);
    setAchievementsList(rData.achievements || []);
    setLanguagesList(rData.languages || []);

    // Social Links
    const social = rData.socialLinks || [];
    setLinkedinUrl(social.find((s) => s.platform === "LinkedIn")?.url || "");
    setGithubUrl(social.find((s) => s.platform === "GitHub")?.url || "");
    setPortfolioUrl(social.find((s) => s.platform === "Portfolio")?.url || "");
    setLeetcodeUrl(social.find((s) => s.platform === "LeetCode")?.url || "");
    setHackerrankUrl(social.find((s) => s.platform === "HackerRank")?.url || "");
  };

  const handleSelectResume = (resumeId) => {
    const selected = resumesList.find((r) => r._id === resumeId);
    if (selected) {
      setActiveResumeId(resumeId);
      populateForm(selected);
      toast.success(`Loaded resume: ${selected.title}`);
    }
  };

  // List adding helpers
  const addEducation = () => {
    if (!eduSchool || !eduDegree) {
      toast.error("School and Degree are required");
      return;
    }
    setEducationList([...educationList, { school: eduSchool, degree: eduDegree, branch: eduBranch, year: eduYear }]);
    setEduSchool(""); setEduDegree(""); setEduBranch(""); setEduYear("");
  };

  const addProject = () => {
    if (!projTitle) return;
    setProjectsList([...projectsList, { title: projTitle, technologies: projTech, description: projDesc }]);
    setProjTitle(""); setProjTech(""); setProjDesc("");
  };

  const addInternship = () => {
    if (!internRole || !internCompany) return;
    setInternshipsList([...internshipsList, { role: internRole, company: internCompany, duration: internDuration, description: internDesc }]);
    setInternRole(""); setInternCompany(""); setInternDuration(""); setInternDesc("");
  };

  const addCertification = () => {
    if (!certTitle) return;
    setCertificationsList([...certificationsList, { title: certTitle, issuer: certIssuer, year: certYear }]);
    setCertTitle(""); setCertIssuer(""); setCertYear("");
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addLanguage = (e) => {
    e.preventDefault();
    if (newLang.trim() && !languagesList.includes(newLang.trim())) {
      setLanguagesList([...languagesList, newLang.trim()]);
      setNewLang("");
    }
  };

  const addAchievement = (e) => {
    e.preventDefault();
    if (newAch.trim() && !achievementsList.includes(newAch.trim())) {
      setAchievementsList([...achievementsList, newAch.trim()]);
      setNewAch("");
    }
  };

  const handleSaveResume = async () => {
    try {
      setSaving(true);
      const socialLinksArray = [
        { platform: "LinkedIn", url: linkedinUrl },
        { platform: "GitHub", url: githubUrl },
        { platform: "Portfolio", url: portfolioUrl },
        { platform: "LeetCode", url: leetcodeUrl },
        { platform: "HackerRank", url: hackerrankUrl },
      ].filter((item) => item.url.trim() !== "");

      const resumePayload = {
        title,
        template,
        data: {
          personalDetails: { fullName, email, phone, location },
          careerObjective,
          education: educationList,
          skills: skillsList,
          projects: projectsList,
          internships: internshipsList,
          experience: experienceList,
          certifications: certificationsList,
          achievements: achievementsList,
          languages: languagesList,
          socialLinks: socialLinksArray,
        },
      };

      if (activeResumeId) {
        await resumesApi.update(activeResumeId, resumePayload);
        toast.success("Resume saved successfully!");
      } else {
        const { data } = await resumesApi.create(resumePayload);
        if (data?.resume?._id) {
          setActiveResumeId(data.resume._id);
          // Set primary if it's the first
          if (resumesList.length === 0) {
            await resumesApi.setPrimary(data.resume._id, userId);
          }
        }
        toast.success("New resume record generated!");
      }
      loadResumes();
    } catch (error) {
      toast.error("Failed to generate and save resume");
    } finally {
      setSaving(false);
    }
  };

  // Generate ATS PDF using jsPDF
  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const primaryColor = "#0f766e"; // Teal
      const darkColor = "#1e293b"; // Charcoal
      const grayColor = "#64748b"; // Muted gray

      doc.setTextColor(darkColor);

      // Name & Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text(fullName || "Applicant Name", 15, 20);

      // Contact Details
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(grayColor);
      let contactString = `Email: ${email || "N/A"} | Phone: ${phone || "N/A"} | Location: ${location || "N/A"}`;
      doc.text(contactString, 15, 26);

      // Social Links Row
      let socialString = "";
      if (linkedinUrl) socialString += `LinkedIn: ${linkedinUrl}   `;
      if (githubUrl) socialString += `GitHub: ${githubUrl}   `;
      if (portfolioUrl) socialString += `Portfolio: ${portfolioUrl}`;
      if (socialString) {
        doc.text(socialString, 15, 31);
      }

      let yPos = 40;

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 34, 195, 34);

      // Bio / Objective
      if (careerObjective) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text("CAREER OBJECTIVE", 15, yPos);
        yPos += 5;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(darkColor);
        const splitBio = doc.splitTextToSize(careerObjective, 180);
        doc.text(splitBio, 15, yPos);
        yPos += splitBio.length * 5 + 5;
      }

      // Education Section
      if (educationList.length > 0) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text("EDUCATION", 15, yPos);
        yPos += 5;
        educationList.forEach((edu) => {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(darkColor);
          doc.text(`${edu.degree || "Degree"} in ${edu.branch || "Specialization"}`, 15, yPos);
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(grayColor);
          doc.text(edu.year || "", 195 - doc.getTextWidth(edu.year || ""), yPos);
          yPos += 5;
          doc.text(edu.school || "School / University", 15, yPos);
          yPos += 7;
        });
      }

      // Experience & Internships Section
      const allJobs = [...internshipsList, ...experienceList];
      if (allJobs.length > 0) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text("EXPERIENCE & INTERNSHIPS", 15, yPos);
        yPos += 5;
        allJobs.forEach((job) => {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(darkColor);
          doc.text(`${job.role || job.title || "Job Title"} at ${job.company || "Company"}`, 15, yPos);
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(grayColor);
          doc.text(job.duration || "", 195 - doc.getTextWidth(job.duration || ""), yPos);
          yPos += 5;
          if (job.description) {
            doc.setTextColor(darkColor);
            const splitDesc = doc.splitTextToSize(job.description, 180);
            doc.text(splitDesc, 15, yPos);
            yPos += splitDesc.length * 4.5;
          }
          yPos += 5;
        });
      }

      // Projects Section
      if (projectsList.length > 0) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text("PROJECTS", 15, yPos);
        yPos += 5;
        projectsList.forEach((proj) => {
          doc.setFont("Helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(darkColor);
          doc.text(proj.title || "Project Title", 15, yPos);
          yPos += 4;
          if (proj.technologies) {
            doc.setFont("Helvetica", "italic");
            doc.setTextColor(grayColor);
            doc.text(`Technologies: ${proj.technologies}`, 15, yPos);
            yPos += 4;
          }
          if (proj.description) {
            doc.setFont("Helvetica", "normal");
            doc.setTextColor(darkColor);
            const splitDesc = doc.splitTextToSize(proj.description, 180);
            doc.text(splitDesc, 15, yPos);
            yPos += splitDesc.length * 4.5;
          }
          yPos += 5;
        });
      }

      // Skills Section
      if (skillsList.length > 0) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text("TECHNICAL SKILLS", 15, yPos);
        yPos += 5;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(darkColor);
        const skillsString = skillsList.join(", ");
        const splitSkills = doc.splitTextToSize(skillsString, 180);
        doc.text(splitSkills, 15, yPos);
        yPos += splitSkills.length * 5 + 5;
      }

      // Certifications & Achievements
      const hasCerts = certificationsList.length > 0;
      const hasAchs = achievementsList.length > 0;
      if (hasCerts || hasAchs) {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryColor);
        doc.text("ADDITIONAL AWARDS & CERTIFICATIONS", 15, yPos);
        yPos += 5;
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(darkColor);
        
        certificationsList.forEach((c) => {
          doc.text(`\u2022 Certified ${c.title} by ${c.issuer || "Issuer"} (${c.year || ""})`, 15, yPos);
          yPos += 5;
        });

        achievementsList.forEach((ach) => {
          doc.text(`\u2022 ${ach}`, 15, yPos);
          yPos += 5;
        });
      }

      doc.save(`${fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("ATS PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF resume");
    }
  };

  // Generate DOCX using Word HTML Blob format
  const generateDOCX = () => {
    try {
      const socialLinksHtml = [
        linkedinUrl ? `LinkedIn: ${linkedinUrl}` : "",
        githubUrl ? `GitHub: ${githubUrl}` : "",
        portfolioUrl ? `Portfolio: ${portfolioUrl}` : "",
        leetcodeUrl ? `LeetCode: ${leetcodeUrl}` : "",
        hackerrankUrl ? `HackerRank: ${hackerrankUrl}` : "",
      ].filter(Boolean).join(" | ");

      const resumeHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>${fullName || "Resume"}</title>
          <style>
            body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.4; color: #333333; margin: 30px; }
            h1 { text-align: center; color: #0f766e; margin-bottom: 2px; font-size: 24pt; }
            .contacts { text-align: center; color: #555555; font-size: 10pt; margin-bottom: 20px; border-bottom: 2px solid #0f766e; padding-bottom: 8px; }
            .section-header { font-size: 13pt; font-weight: bold; color: #0f766e; text-transform: uppercase; margin-top: 15px; margin-bottom: 8px; }
            .entry-title { font-weight: bold; font-size: 11pt; color: #111111; }
            .entry-meta { float: right; font-style: italic; color: #666666; font-size: 10pt; }
            .entry-school { font-style: italic; color: #555555; font-size: 10pt; }
            .description { font-size: 10pt; color: #444444; margin-top: 3px; margin-bottom: 8px; }
            .skills-list { font-size: 10pt; font-weight: bold; color: #222222; }
          </style>
        </head>
        <body>
          <h1>${fullName || "Applicant Name"}</h1>
          <div class="contacts">
            Email: ${email || "N/A"} | Phone: ${phone || "N/A"} | Location: ${location || "N/A"} <br/>
            ${socialLinksHtml}
          </div>

          ${careerObjective ? `
            <div class="section-header">Career Objective</div>
            <p class="description">${careerObjective}</p>
          ` : ""}

          ${educationList.length > 0 ? `
            <div class="section-header">Education</div>
            ${educationList.map((edu) => `
              <div style="margin-bottom: 8px;">
                <span class="entry-title">${edu.degree || "Degree"} in ${edu.branch || "Specialization"}</span>
                <span class="entry-meta">${edu.year || ""}</span>
                <div class="entry-school">${edu.school || "School / University"}</div>
              </div>
            `).join("")}
          ` : ""}

          ${[...internshipsList, ...experienceList].length > 0 ? `
            <div class="section-header">Experience & Internships</div>
            ${[...internshipsList, ...experienceList].map((job) => `
              <div style="margin-bottom: 10px;">
                <span class="entry-title">${job.role || job.title} &middot; ${job.company}</span>
                <span class="entry-meta">${job.duration || ""}</span>
                <p class="description">${job.description || ""}</p>
              </div>
            `).join("")}
          ` : ""}

          ${projectsList.length > 0 ? `
            <div class="section-header">Projects</div>
            ${projectsList.map((proj) => `
              <div style="margin-bottom: 10px;">
                <span class="entry-title">${proj.title}</span>
                <div style="font-size: 9pt; font-style: italic; color: #777777;">Tech Stack: ${proj.technologies || ""}</div>
                <p class="description">${proj.description || ""}</p>
              </div>
            `).join("")}
          ` : ""}

          ${skillsList.length > 0 ? `
            <div class="section-header">Technical Skills</div>
            <p class="skills-list">${skillsList.join(", ")}</p>
          ` : ""}

          ${(certificationsList.length > 0 || achievementsList.length > 0) ? `
            <div class="section-header">Certifications & Achievements</div>
            <ul>
              ${certificationsList.map((c) => `<li>Certified ${c.title} from ${c.issuer || "Issuer"} (${c.year || ""})</li>`).join("")}
              ${achievementsList.map((ach) => `<li>${ach}</li>`).join("")}
            </ul>
          ` : ""}
        </body>
        </html>
      `;

      const blob = new Blob(["\ufeff" + resumeHtml], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fullName.replace(/\s+/g, "_")}_Resume.doc`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("DOCX file downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate DOCX file");
    }
  };

  if (!user) {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-10 text-center max-w-lg mx-auto">
            <FileText size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Authentication Required</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Log in as a student to access the Internshala-Style Resume Builder tool.</p>
            <Button to="/login" className="mt-6">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <Container>
        <SectionHeader 
          eyebrow="ATS Tool" 
          title="Resume Builder" 
          description="Build professional resumes automatically matching Internshala and ATS standard layouts."
          action={
            <div className="flex gap-2">
              <Button onClick={handleSaveResume} disabled={saving} className="min-h-11 shadow-teal-500/10">
                <Save size={16} /> {saving ? "Saving..." : "Generate Resume"}
              </Button>
              <Button onClick={generatePDF} variant="secondary" className="min-h-11">
                <Download size={16} /> PDF
              </Button>
              <Button onClick={generateDOCX} variant="secondary" className="min-h-11">
                <FileText size={16} /> DOCX
              </Button>
            </div>
          }
        />

        {/* Existing Draft Selector */}
        {resumesList.length > 0 && (
          <div className="glass p-4 rounded-2xl mb-6 flex items-center gap-3 border border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold uppercase text-slate-500">Draft Selection:</span>
            <select 
              value={activeResumeId || ""}
              onChange={(e) => handleSelectResume(e.target.value)}
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-slate-900 outline-none"
            >
              {resumesList.map((res) => (
                <option key={res._id} value={res._id}>
                  {res.title} {res.isPrimary ? "(Primary)" : ""}
                </option>
              ))}
            </select>
            <Button onClick={() => {
              setActiveResumeId(null);
              setFullName(user?.name || "");
              setEmail(user?.email || "");
              setPhone(user?.phone || "");
              setLocation(user?.location || "");
              setCareerObjective("");
              setEducationList([]);
              setSkillsList([]);
              setProjectsList([]);
              setInternshipsList([]);
              setExperienceList([]);
              setCertificationsList([]);
              setAchievementsList([]);
              setLanguagesList([]);
              setLinkedinUrl("");
              setGithubUrl("");
              setPortfolioUrl("");
              setLeetcodeUrl("");
              setHackerrankUrl("");
              setTitle("My Professional Resume");
              toast.success("Cleared inputs for new draft");
            }} variant="ghost" className="px-3 min-h-10 text-xs">
              Create New Draft
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_480px] mt-6">
          {/* Form Editing Columns */}
          <main className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm space-y-6">
            
            {/* Title / Template */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume Title</span>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Form Section</span>
                <select 
                  value={formSection} 
                  onChange={(e) => setFormSection(e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/10 px-3 text-sm border border-slate-100 dark:border-white/5 outline-none"
                >
                  <option value="personal">1. Personal & Socials</option>
                  <option value="education">2. Education details</option>
                  <option value="skills">3. Skills & Languages</option>
                  <option value="projects">4. Projects & Internships</option>
                  <option value="certifications">5. Certs & Achievements</option>
                </select>
              </label>
            </div>

            {/* Section: Personal & Socials */}
            {formSection === "personal" && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Personal Contact</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Full Name</span>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Phone</span>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Location</span>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" />
                  </label>
                </div>
                <label className="block mt-3">
                  <span className="text-xs font-semibold text-slate-600">Career Objective / Bio</span>
                  <textarea value={careerObjective} onChange={(e) => setCareerObjective(e.target.value)} className="mt-2 min-h-20 w-full rounded-xl bg-white dark:bg-white/5 px-4 py-2 text-sm border border-slate-100 dark:border-white/5" />
                </label>

                <h4 className="text-base font-bold text-teal-800 dark:text-teal-300 mt-6">Social Links</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">LinkedIn URL</span>
                    <input type="text" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" placeholder="https://linkedin.com/in/user" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">GitHub URL</span>
                    <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" placeholder="https://github.com/user" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">Portfolio URL</span>
                    <input type="text" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" placeholder="https://portfolio.com" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-600">LeetCode URL</span>
                    <input type="text" value={leetcodeUrl} onChange={(e) => setLeetcodeUrl(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" placeholder="https://leetcode.com/user" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-600">HackerRank URL</span>
                    <input type="text" value={hackerrankUrl} onChange={(e) => setHackerrankUrl(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-white/5 px-4 text-sm border border-slate-100 dark:border-white/5" placeholder="https://hackerrank.com/user" />
                  </label>
                </div>
              </div>
            )}

            {/* Section: Education details */}
            {formSection === "education" && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Add School / University</h4>
                <div className="grid gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold">School/College</span>
                      <input type="text" value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="BITS Pilani" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold">Degree</span>
                      <input type="text" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="B.Tech" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold">Branch</span>
                      <input type="text" value={eduBranch} onChange={(e) => setEduBranch(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Computer Science" />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold">Year of Graduation</span>
                      <input type="text" value={eduYear} onChange={(e) => setEduYear(e.target.value)} className="mt-2 min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="2027" />
                    </label>
                  </div>
                  <Button type="button" onClick={addEducation} variant="secondary" className="mt-2 ml-auto py-2 px-4 min-h-10">Add Education</Button>
                </div>

                <div className="mt-4 space-y-2">
                  {educationList.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div>
                        <p className="font-semibold text-sm">{edu.degree} in {edu.branch} ({edu.year})</p>
                        <p className="text-xs text-slate-500">{edu.school}</p>
                      </div>
                      <button onClick={() => setEducationList(educationList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Skills & Languages */}
            {formSection === "skills" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Technical Skills</h4>
                  <form onSubmit={addSkill} className="flex gap-2 mt-3">
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1 min-h-10 rounded-xl bg-white dark:bg-white/5 px-3 text-sm border border-slate-100 dark:border-white/5 outline-none" placeholder="ReactJS" />
                    <Button type="submit" variant="secondary" className="min-h-10 py-2">Add</Button>
                  </form>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skillsList.map((s) => (
                      <Badge key={s}>
                        {s} <button type="button" onClick={() => setSkillsList(skillsList.filter((sk) => sk !== s))} className="ml-1 text-slate-400 hover:text-red-500 font-extrabold">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Languages</h4>
                  <form onSubmit={addLanguage} className="flex gap-2 mt-3">
                    <input type="text" value={newLang} onChange={(e) => setNewLang(e.target.value)} className="flex-1 min-h-10 rounded-xl bg-white dark:bg-white/5 px-3 text-sm border border-slate-100 dark:border-white/5 outline-none" placeholder="English" />
                    <Button type="submit" variant="secondary" className="min-h-10 py-2">Add</Button>
                  </form>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {languagesList.map((lang) => (
                      <Badge key={lang} tone="cyan">
                        {lang} <button type="button" onClick={() => setLanguagesList(languagesList.filter((l) => l !== lang))} className="ml-1 text-slate-400 hover:text-red-500 font-extrabold">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section: Projects & Internships */}
            {formSection === "projects" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Add Project</h4>
                  <div className="grid gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                    <input type="text" value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Project Name" />
                    <input type="text" value={projTech} onChange={(e) => setProjTech(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Tech stack used (e.g. React, Node)" />
                    <textarea value={projDesc} onChange={(e) => setProjDesc(e.target.value)} className="min-h-16 w-full rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm border border-slate-100 dark:border-white/5" placeholder="Short description..." />
                    <Button type="button" onClick={addProject} variant="secondary" className="min-h-10 py-2 ml-auto">Add Project</Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {projectsList.map((proj, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div>
                          <p className="font-semibold text-sm">{proj.title}</p>
                          <p className="text-xs text-slate-400 font-medium">{proj.technologies}</p>
                        </div>
                        <button onClick={() => setProjectsList(projectsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 dark:border-white/5 pt-6">
                  <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Add Internship / Experience</h4>
                  <div className="grid gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                    <input type="text" value={internRole} onChange={(e) => setInternRole(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Role / Position" />
                    <input type="text" value={internCompany} onChange={(e) => setInternCompany(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Company Name" />
                    <input type="text" value={internDuration} onChange={(e) => setInternDuration(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Duration (e.g. Jun 2025 - Aug 2025)" />
                    <textarea value={internDesc} onChange={(e) => setInternDesc(e.target.value)} className="min-h-16 w-full rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm border border-slate-100 dark:border-white/5" placeholder="Job accomplishments..." />
                    <Button type="button" onClick={addInternship} variant="secondary" className="min-h-10 py-2 ml-auto">Add Internship</Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {internshipsList.map((intern, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div>
                          <p className="font-semibold text-sm">{intern.role} at {intern.company}</p>
                          <p className="text-xs text-slate-500 font-medium">{intern.duration}</p>
                        </div>
                        <button onClick={() => setInternshipsList(internshipsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section: Certifications & Achievements */}
            {formSection === "certifications" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Add Certification</h4>
                  <div className="grid gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl">
                    <input type="text" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Certification Name" />
                    <input type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Issuing Organization" />
                    <input type="text" value={certYear} onChange={(e) => setCertYear(e.target.value)} className="min-h-10 w-full rounded-xl bg-white dark:bg-slate-900 px-3 text-sm border border-slate-100 dark:border-white/5" placeholder="Year" />
                    <Button type="button" onClick={addCertification} variant="secondary" className="min-h-10 py-2 ml-auto">Add Cert</Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {certificationsList.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                        <div>
                          <p className="font-semibold text-sm">{c.title} by {c.issuer} ({c.year})</p>
                        </div>
                        <button onClick={() => setCertificationsList(certificationsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 dark:border-white/5 pt-6">
                  <h4 className="text-base font-bold text-teal-800 dark:text-teal-300">Key Achievements</h4>
                  <form onSubmit={addAchievement} className="flex gap-2 mt-3">
                    <input type="text" value={newAch} onChange={(e) => setNewAch(e.target.value)} className="flex-1 min-h-10 rounded-xl bg-white dark:bg-white/5 px-3 text-sm border border-slate-100 dark:border-white/5 outline-none" placeholder="Secured Rank 1 in national code hackathon" />
                    <Button type="submit" variant="secondary" className="min-h-10 py-2">Add</Button>
                  </form>
                  <ul className="mt-4 space-y-2">
                    {achievementsList.map((ach, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 text-sm">
                        <span>{ach}</span>
                        <button onClick={() => setAchievementsList(achievementsList.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                          <Trash2 size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </main>

          {/* ATS Real-time Preview Panel */}
          <aside className="glass rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-sm max-h-[800px] overflow-y-auto bg-white dark:bg-slate-900">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-teal-800 dark:text-teal-300 mb-6 flex items-center gap-2 border-b pb-3">
              <Eye size={16} /> ATS-Friendly Resume Preview
            </h3>

            <div className="text-slate-800 dark:text-slate-100 text-xs font-sans leading-relaxed space-y-4">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h4 className="text-lg font-bold text-slate-950 dark:text-white uppercase tracking-wide">{fullName || "Your Name"}</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {email || "email@example.com"} &middot; {phone || "Phone Number"}
                </p>
                <p className="text-slate-400 mt-0.5">{location || "City, India"}</p>
                
                {/* Socials */}
                <div className="mt-2 flex flex-wrap gap-x-3 justify-center text-teal-700 dark:text-teal-400 font-semibold text-[10px]">
                  {linkedinUrl && <span>LinkedIn</span>}
                  {githubUrl && <span>GitHub</span>}
                  {portfolioUrl && <span>Portfolio</span>}
                  {leetcodeUrl && <span>LeetCode</span>}
                  {hackerrankUrl && <span>HackerRank</span>}
                </div>
              </div>

              {/* Bio */}
              {careerObjective && (
                <div>
                  <h5 className="font-bold text-[10px] uppercase text-teal-800 dark:text-teal-300 tracking-widest mb-1">Career Objective</h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-normal">{careerObjective}</p>
                </div>
              )}

              {/* Education */}
              {educationList.length > 0 && (
                <div>
                  <h5 className="font-bold text-[10px] uppercase text-teal-800 dark:text-teal-300 tracking-widest mb-2 border-b pb-0.5">Education</h5>
                  <div className="space-y-3">
                    {educationList.map((edu, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{edu.degree} &middot; {edu.branch}</p>
                          <p className="text-slate-500 mt-0.5">{edu.school}</p>
                        </div>
                        <span className="text-slate-400 italic">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internships & Experience */}
              {[...internshipsList, ...experienceList].length > 0 && (
                <div>
                  <h5 className="font-bold text-[10px] uppercase text-teal-800 dark:text-teal-300 tracking-widest mb-2 border-b pb-0.5">Work History</h5>
                  <div className="space-y-3">
                    {[...internshipsList, ...experienceList].map((job, index) => (
                      <div key={index}>
                        <div className="flex justify-between">
                          <p className="font-bold text-slate-900 dark:text-white">{job.role || job.title} at {job.company}</p>
                          <span className="text-slate-400 italic">{job.duration}</span>
                        </div>
                        {job.description && <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal">{job.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projectsList.length > 0 && (
                <div>
                  <h5 className="font-bold text-[10px] uppercase text-teal-800 dark:text-teal-300 tracking-widest mb-2 border-b pb-0.5">Academic Projects</h5>
                  <div className="space-y-3">
                    {projectsList.map((proj, index) => (
                      <div key={index}>
                        <p className="font-bold text-slate-900 dark:text-white">{proj.title}</p>
                        {proj.technologies && <p className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 mt-0.5">Tech stack: {proj.technologies}</p>}
                        {proj.description && <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal">{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skillsList.length > 0 && (
                <div>
                  <h5 className="font-bold text-[10px] uppercase text-teal-800 dark:text-teal-300 tracking-widest mb-1.5 border-b pb-0.5">Skills Matrix</h5>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{skillsList.join(", ")}</p>
                </div>
              )}

              {/* Certs & Achievements */}
              {(certificationsList.length > 0 || achievementsList.length > 0) && (
                <div>
                  <h5 className="font-bold text-[10px] uppercase text-teal-800 dark:text-teal-300 tracking-widest mb-1.5 border-b pb-0.5">Awards & Certifications</h5>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-600 dark:text-slate-300">
                    {certificationsList.map((c, index) => (
                      <li key={index}>Certified {c.title} by {c.issuer || "Issuer"} ({c.year || ""})</li>
                    ))}
                    {achievementsList.map((ach, index) => (
                      <li key={index}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
};

export default ResumeDashboard;

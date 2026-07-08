import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Award, Briefcase, GraduationCap, MapPin, Plus, Save, Trash2, Upload, User as UserIcon, Star, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Badge, Button, Container, SectionHeader } from "../../components/ui";
import { resumesApi, certificatesApi } from "../../services/api";
import { fetchCurrentUser } from "../../redux/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [primaryResume, setPrimaryResume] = useState(null);
  
  // Profile States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Education Fields
  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [educationList, setEducationList] = useState([]);
  
  // Skills
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  
  // Experience List
  const [experienceList, setExperienceList] = useState([]);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expDescription, setExpDescription] = useState("");

  // Resume Upload
  const [uploadTitle, setUploadTitle] = useState("My Resume File");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // My Certificates State
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);

  const userId = user?.id || user?._id;

  const loadProfileData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await resumesApi.list(userId);
      const list = data.resumes || [];
      setResumes(list);

      // Find primary resume
      let primary = list.find((r) => r.isPrimary);
      if (!primary && list.length > 0) {
        // Fallback to first resume as primary
        primary = list[0];
      }

      if (primary) {
        setPrimaryResume(primary);
        const resumeData = primary.data || {};
        const personal = resumeData.personalDetails || {};
        
        setFullName(personal.fullName || user?.name || "");
        setEmail(personal.email || user?.email || "");
        setPhone(personal.phone || user?.phone || "");
        setLocation(personal.location || user?.location || "");
        setBio(resumeData.careerObjective || "");
        setAvatar(personal.avatar || "");
        
        // Education
        const edu = resumeData.education || [];
        setEducationList(edu);
        if (edu.length > 0) {
          setCollegeName(edu[0].collegeName || edu[0].school || "");
          setDegree(edu[0].degree || "");
          setBranch(edu[0].branch || edu[0].fieldOfStudy || "");
        }
        
        // Skills
        setSkills(resumeData.skills || user?.skills || []);
        
        // Experience
        setExperienceList(resumeData.experience || []);
      } else {
        // No resume exists, initialize form fields from User account details
        setFullName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.phone || "");
        setLocation(user?.location || "");
        setSkills(user?.skills || []);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Could not fetch profile details from database");
    } finally {
      setLoading(false);
    }
  };

  const loadCertificates = async () => {
    try {
      setLoadingCertificates(true);
      const { data } = await certificatesApi.my();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error("Load certificates error:", error);
      toast.error("Failed to load certificates.");
    } finally {
      setLoadingCertificates(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  useEffect(() => {
    if (activeTab === "certificates") {
      loadCertificates();
    }
  }, [activeTab]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        toast.error("Profile photo must be less than 1.5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addExperience = (e) => {
    e.preventDefault();
    if (!expTitle || !expCompany) {
      toast.error("Role and Company are required to add experience");
      return;
    }
    const newExp = {
      title: expTitle,
      company: expCompany,
      duration: expDuration,
      description: expDescription,
    };
    setExperienceList([...experienceList, newExp]);
    setExpTitle("");
    setExpCompany("");
    setExpDuration("");
    setExpDescription("");
    toast.success("Experience block added locally. Remember to save changes!");
  };

  const removeExperience = (index) => {
    setExperienceList(experienceList.filter((_, idx) => idx !== index));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Update first education block details
      const updatedEduList = [...educationList];
      if (collegeName || degree || branch) {
        const primaryEdu = { collegeName, degree, branch };
        if (updatedEduList.length > 0) {
          updatedEduList[0] = { ...updatedEduList[0], ...primaryEdu };
        } else {
          updatedEduList.push(primaryEdu);
        }
      }

      const payloadData = {
        personalDetails: {
          fullName,
          email,
          phone,
          location,
          avatar,
        },
        careerObjective: bio,
        education: updatedEduList,
        skills,
        experience: experienceList,
        projects: primaryResume?.data?.projects || [],
        internships: primaryResume?.data?.internships || [],
        certifications: primaryResume?.data?.certifications || [],
        achievements: primaryResume?.data?.achievements || [],
        languages: primaryResume?.data?.languages || [],
        socialLinks: primaryResume?.data?.socialLinks || [],
      };

      if (primaryResume) {
        // Update existing primary resume object
        await resumesApi.update(primaryResume._id, {
          title: primaryResume.title,
          template: primaryResume.template,
          data: payloadData,
        });
        toast.success("Profile saved successfully");
      } else {
        // Create new primary resume to store profile
        const { data } = await resumesApi.create({
          title: "My Profile Resume",
          template: "classic",
          data: payloadData,
        });
        // Make primary
        if (data?.resume?._id) {
          await resumesApi.setPrimary(data.resume._id, userId);
        }
        toast.success("Profile created and saved successfully");
      }
      
      // Reload profile
      loadProfileData();
      dispatch(fetchCurrentUser());
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error(error.response?.data?.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please choose a PDF or DOCX file to upload");
      return;
    }
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append("resume", uploadFile);
      formData.append("title", uploadTitle);
      formData.append("userId", userId);
      
      await resumesApi.upload(formData);
      toast.success("Resume file uploaded successfully!");
      setUploadFile(null);
      setUploadTitle("My Resume File");
      loadProfileData();
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload resume file");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSetPrimary = async (resumeId) => {
    try {
      await resumesApi.setPrimary(resumeId, userId);
      toast.success("Primary profile resume updated");
      loadProfileData();
    } catch (error) {
      toast.error("Failed to set primary resume");
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await resumesApi.remove(resumeId);
      toast.success("Resume deleted");
      loadProfileData();
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  if (!user) {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
            <UserIcon size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Access Denied</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Please login as a student to view and edit your profile details.</p>
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
          eyebrow="Profile Management" 
          title="Student Profile" 
          description="Keep your personal details, education records, experience timeline, and resume files updated."
          action={
            <Button onClick={handleSaveProfile} disabled={saving} className="shadow-teal-500/20">
              <Save size={16} /> {saving ? "Saving Changes..." : "Save Profile Changes"}
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] mt-8">
          {/* Sidebar / Photo Card */}
          <aside className="space-y-6">
            <div className="glass rounded-3xl p-6 text-center border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="relative mx-auto h-28 w-28 rounded-full border-4 border-teal-500 overflow-hidden bg-slate-100 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Profile Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-extrabold text-teal-800">
                    {fullName ? fullName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "ME"}
                  </span>
                )}
              </div>
              <h2 className="mt-5 text-lg font-bold text-slate-950 dark:text-white truncate">{fullName || "Your Name"}</h2>
              <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold tracking-wider mt-1 uppercase">
                {degree ? `${degree} in ${branch || "Branch"}` : "Student Profile"}
              </p>
              
              <label className="mt-5 block">
                <span className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 hover:border-teal-400 dark:hover:border-teal-500/30 hover:text-teal-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all">
                  <Upload size={14} /> Upload photo
                </span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>

            {/* Navigation Tabs */}
            <div className="glass rounded-3xl p-3 border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-1">
              {[
                { id: "personal", label: "Personal Details", icon: UserIcon },
                { id: "education", label: "Education & Skills", icon: GraduationCap },
                { id: "experience", label: "Work Experience", icon: Briefcase },
                { id: "resumes", label: "Resume Files", icon: Award },
                { id: "certificates", label: "My Certificates", icon: Star }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all ${
                      activeTab === tab.id 
                        ? "bg-teal-700 text-white shadow-md shadow-teal-900/10" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Form Content Panel */}
          <main className="glass rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-white/5 shadow-sm">
            {loading ? (
              <div className="py-12 text-center font-medium text-slate-500">Retrieving profile data...</div>
            ) : (
              <>
                {/* Tab: Personal Details */}
                {activeTab === "personal" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">Personal Details</h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</span>
                        <input 
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="Aarav Mehta"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="email@example.com"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</span>
                        <input 
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="+91 9876543210"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Location</span>
                        <input 
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="Mumbai, India"
                        />
                      </label>
                    </div>
                    <label className="block mt-4">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Bio</span>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-2 min-h-24 w-full rounded-xl bg-white dark:bg-white/10 px-4 py-3 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                        placeholder="Tell recruiters about your skills, passion, and what fields you are exploring."
                      />
                    </label>
                  </div>
                )}

                {/* Tab: Education & Skills */}
                {activeTab === "education" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">Education details</h3>
                    <div className="grid gap-5 sm:grid-cols-3">
                      <label className="block sm:col-span-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Degree Program</span>
                        <input 
                          type="text"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="B.Tech"
                        />
                      </label>
                      <label className="block sm:col-span-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branch / Specialization</span>
                        <input 
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="Computer Science"
                        />
                      </label>
                      <label className="block sm:col-span-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">College Name</span>
                        <input 
                          type="text"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          className="mt-2 min-h-12 w-full rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500" 
                          placeholder="BITS Pilani"
                        />
                      </label>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">Skills Tags</h3>
                      <form onSubmit={addSkill} className="flex gap-2 mt-4 max-w-md">
                        <input 
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="min-h-11 flex-1 rounded-xl bg-white dark:bg-white/10 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none focus:border-teal-500"
                          placeholder="Add skill (e.g. React, NodeJS)"
                        />
                        <Button type="submit" variant="secondary" className="min-h-11 px-4">
                          <Plus size={16} /> Add
                        </Button>
                      </form>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                          skills.map((skill) => (
                            <Badge key={skill} tone="teal">
                              <span className="flex items-center gap-1">
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 font-extrabold text-xs ml-1">×</button>
                              </span>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">No skills added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Work Experience */}
                {activeTab === "experience" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">Add Experience Block</h3>
                    <form onSubmit={addExperience} className="grid gap-4 bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role / Title</span>
                          <input 
                            type="text"
                            value={expTitle}
                            onChange={(e) => setExpTitle(e.target.value)}
                            className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none"
                            placeholder="Frontend Intern"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company</span>
                          <input 
                            type="text"
                            value={expCompany}
                            onChange={(e) => setExpCompany(e.target.value)}
                            className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none"
                            placeholder="Google"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</span>
                          <input 
                            type="text"
                            value={expDuration}
                            onChange={(e) => setExpDuration(e.target.value)}
                            className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none"
                            placeholder="Jun 2025 - Dec 2025"
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</span>
                        <textarea 
                          value={expDescription}
                          onChange={(e) => setExpDescription(e.target.value)}
                          className="mt-2 min-h-20 w-full rounded-xl bg-white dark:bg-slate-900 px-4 py-2 text-sm border border-slate-100 dark:border-white/5 outline-none"
                          placeholder="Describe your impacts, tech stack, and key responsibilities..."
                        />
                      </label>
                      <Button type="submit" variant="secondary" className="w-max ml-auto">
                        <Plus size={16} /> Add to Profile List
                      </Button>
                    </form>

                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3 mt-8">Experience Timeline</h3>
                    <div className="space-y-4">
                      {experienceList.length > 0 ? (
                        experienceList.map((exp, idx) => (
                          <div key={idx} className="glass flex items-start justify-between p-4 rounded-xl border border-slate-100 dark:border-white/5">
                            <div>
                              <h4 className="font-bold text-slate-950 dark:text-white">{exp.title}</h4>
                              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">{exp.company} &middot; <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{exp.duration}</span></p>
                              {exp.description && <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{exp.description}</p>}
                            </div>
                            <button onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-700 p-1">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No work experience listed yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Resumes (PDF Uploads) */}
                {activeTab === "resumes" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">Upload New Resume File</h3>
                    <form onSubmit={handleFileUpload} className="glass p-5 rounded-2xl grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end border border-slate-100 dark:border-white/5 bg-slate-50/50">
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">File Title / Tag</span>
                        <input 
                          type="text"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                          className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-4 text-sm border border-slate-100 dark:border-white/5 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select File (.pdf, .doc, .docx)</span>
                        <input 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setUploadFile(e.target.files?.[0])}
                          className="mt-2 min-h-11 w-full rounded-xl bg-white dark:bg-slate-900 px-4 py-2 text-sm border border-slate-100 dark:border-white/5"
                        />
                      </label>
                      <Button type="submit" disabled={uploadingFile} className="min-h-11">
                        <Upload size={16} /> {uploadingFile ? "Uploading..." : "Upload File"}
                      </Button>
                    </form>

                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3 mt-8">My Resumes</h3>
                    <div className="grid gap-4 mt-4">
                      {resumes.length > 0 ? (
                        resumes.map((resume) => (
                          <article key={resume._id} className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between border border-slate-100 dark:border-white/5 shadow-sm hover:border-teal-300 dark:hover:border-teal-500/20">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-slate-950 dark:text-white text-base">{resume.title}</h4>
                                {resume.isPrimary ? <Badge tone="teal">Primary Profile</Badge> : null}
                              </div>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Uploaded {new Date(resume.uploadedAt || resume.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {resume.pdfUrl && (
                                <a 
                                  href={resume.pdfUrl.startsWith("data:") ? resume.pdfUrl : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${resume.pdfUrl}`}
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
                                >
                                  Download / View
                                </a>
                              )}
                              {!resume.isPrimary && (
                                <Button onClick={() => handleSetPrimary(resume._id)} variant="secondary" className="px-3">
                                  Set Primary
                                </Button>
                              )}
                              <button onClick={() => handleDeleteResume(resume._id)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </article>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab: Certificates */}
                {activeTab === "certificates" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">🏆 My Certificates</h3>
                    <div className="grid gap-4 mt-4">
                      {loadingCertificates ? (
                        <div className="py-6 text-center text-sm text-slate-500 animate-pulse">Loading certificates…</div>
                      ) : certificates.length > 0 ? (
                        certificates.map((cert) => (
                          <article key={cert._id} className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between border border-slate-100 dark:border-white/5 shadow-sm hover:border-teal-300 dark:hover:border-teal-500/20">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-slate-950 dark:text-white text-base">{cert.testId?.title || "Assessment Certificate"}</h4>
                                <Badge tone="teal">Score: {cert.score}/20 ({cert.percentage}%)</Badge>
                              </div>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                                ID: {cert.certificateId} | Issued {new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <a 
                                href={cert.certificateUrl}
                                download={`CareerNest-${cert.testId?.title.replace(/\s+/g, "-")}-Certificate.pdf`}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:text-teal-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
                              >
                                Download Certificate
                              </a>
                              {cert.testId?._id && (
                                <Button to={`/assessment/${cert.testId._id}`} variant="secondary" className="gap-1 px-3">
                                  <RefreshCw size={14} /> Reattempt Test
                                </Button>
                              )}
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-slate-500">No certificates earned yet.</p>
                          <p className="text-xs text-slate-400 mt-1">Complete assessment tests with at least 60% score to earn certificates.</p>
                          <Button to="/interview-prep" className="mt-4 px-4 text-xs">Browse Assessments</Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </Container>
    </section>
  );
};

export default Profile;

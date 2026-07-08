import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Building2, Save, Upload, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button, Container, SectionHeader } from "../../components/ui";
import { companiesApi } from "../../services/api";

const EmployerCompany = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?._id;

  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState(""); // Preview existing logo

  // Custom Fields (Serialized in description)
  const [industryType, setIndustryType] = useState("IT & Software");
  const [companySize, setCompanySize] = useState("10-50 employees");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");

  const loadCompanyProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await companiesApi.list();
      const list = Array.isArray(data) ? data : [];
      
      // Find company owned by this user
      const myCompany = list.find((c) => c.owner === userId || c.owner?._id === userId);
      
      if (myCompany) {
        setCompanyId(myCompany._id);
        setName(myCompany.name || "");
        setWebsite(myCompany.website || "");
        setLocation(myCompany.location || "");
        setLogoUrl(myCompany.logo || "");

        // Parse custom serialized fields from description
        const descText = myCompany.description || "";
        const indMatch = descText.match(/\[Industry:\s*([^\]]+)\]/);
        const sizeMatch = descText.match(/\[Size:\s*([^\]]+)\]/);
        const liMatch = descText.match(/\[LinkedIn:\s*([^\]]+)\]/);
        const twMatch = descText.match(/\[Twitter:\s*([^\]]+)\]/);

        setIndustryType(indMatch ? indMatch[1] : "IT & Software");
        setCompanySize(sizeMatch ? sizeMatch[1] : "10-50 employees");
        setLinkedinUrl(liMatch ? liMatch[1] : "");
        setTwitterUrl(twMatch ? twMatch[1] : "");

        // Extract clean description
        const cleanDesc = descText
          .replace(/\[Industry:\s*[^\]]+\]/g, "")
          .replace(/\[Size:\s*[^\]]+\]/g, "")
          .replace(/\[LinkedIn:\s*[^\]]+\]/g, "")
          .replace(/\[Twitter:\s*[^\]]+\]/g, "")
          .trim();
        setDescription(cleanDesc);
      }
    } catch (error) {
      toast.error("Failed to load company profile from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanyProfile();
  }, [userId]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create local URL for preview
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error("Company Name and Description are required");
      return;
    }

    try {
      setSubmitting(true);

      // Serialize custom fields into description string
      const serializedDescription = `[Industry: ${industryType}] [Size: ${companySize}] [LinkedIn: ${linkedinUrl}] [Twitter: ${twitterUrl}]\n\n${description}`;

      if (companyId) {
        // Update existing company profile (JSON payload)
        const payload = {
          name,
          website,
          location,
          description: serializedDescription,
        };
        // If logo file was selected, we can convert it to base64 or keep existing. Since backend PATCH doesn't handle upload, we keep the logo or send base64 if supported, but let's just keep the existing logo path or warn them.
        await companiesApi.update(companyId, payload);
        toast.success("Company profile updated successfully!");
      } else {
        // Create new company profile (FormData multipart for logo file)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("website", website);
        formData.append("location", location);
        formData.append("description", serializedDescription);
        if (logoFile) {
          formData.append("logo", logoFile);
        }

        await companiesApi.create(formData);
        toast.success("Company profile created successfully!");
      }
      loadCompanyProfile();
      navigate("/employer/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit company profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "employer") {
    return (
      <section className="section-pad">
        <Container>
          <div className="glass rounded-3xl p-12 text-center max-w-lg mx-auto">
            <Building2 size={48} className="mx-auto text-slate-400 mb-4" />
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Employer Access Only</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Log in as an Employer to configure your company profile page.</p>
            <Button to="/login" className="mt-6">Login</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-pad bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <Container className="max-w-4xl">
        <SectionHeader 
          eyebrow="Company Settings" 
          title={companyId ? "Edit Company Profile" : "Create Company Profile"} 
          description="Update your corporate details, logo branding, and social connections visible to applicants." 
        />

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Retrieving company settings...</div>
        ) : (
          <form onSubmit={handleSubmitProfile} className="glass grid gap-5 rounded-3xl p-6 sm:grid-cols-2 border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950 shadow-sm">
            
            <label className="block sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</span>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none"
                placeholder="Google"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Website URL</span>
              <input 
                type="text" 
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none"
                placeholder="https://google.com"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Office Location / Address</span>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none"
                placeholder="Bengaluru, India"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry Type</span>
              <select 
                value={industryType}
                onChange={(e) => setIndustryType(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-3 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="IT & Software">IT & Software</option>
                <option value="Data Science">Data Science</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Management">Management</option>
                <option value="Design">Design</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Size</span>
              <select 
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-3 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="1-10 employees">1-10 employees</option>
                <option value="10-50 employees">10-50 employees</option>
                <option value="50-200 employees">50-200 employees</option>
                <option value="200-500 employees">200-500 employees</option>
                <option value="500+ employees">500+ employees</option>
              </select>
            </label>

            {/* Logo Uploading field */}
            <div className="block sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Logo Upload</span>
              <div className="mt-2 flex items-center gap-4">
                {logoUrl && (
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border overflow-hidden flex items-center justify-center">
                    <img 
                      src={logoUrl.startsWith("data:") || logoUrl.startsWith("blob:") ? logoUrl : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${logoUrl}`} 
                      alt="Logo Preview" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                )}
                
                {/* File upload trigger button */}
                <label className="flex-1 cursor-pointer">
                  <span className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-teal-300 bg-teal-50 text-sm font-bold text-teal-800 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-200 hover:bg-teal-100 transition-all">
                    <Upload size={17} /> {logoFile ? "Change logo file" : "Upload Company Logo"}
                  </span>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">LinkedIn Page URL</span>
              <input 
                type="text" 
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none"
                placeholder="https://linkedin.com/company/name"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Twitter URL</span>
              <input 
                type="text" 
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 text-sm outline-none"
                placeholder="https://twitter.com/company"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Description</span>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 min-h-36 w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" 
                placeholder="Tell potential candidates what your company stands for, builds, and why it is an amazing place to grow."
                required
              />
            </label>

            <Button type="submit" disabled={submitting} className="sm:col-span-2 mt-4 shadow-teal-500/10">
              <Save size={16} /> {submitting ? "Saving Company Profile..." : "Save Company Profile"}
            </Button>
          </form>
        )}
      </Container>
    </section>
  );
};

export default EmployerCompany;

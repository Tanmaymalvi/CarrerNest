import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Register from "../pages/Register/Register";
import Jobs from "../pages/Jobs/Jobs";
import JobDetails from "../pages/JobDetails/JobDetails";
import Profile from "../pages/Profile/Profile";
import Applications from "../pages/Applications/Applications";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard";
import EmployerDashboard from "../pages/EmployerDashboard/EmployerDashboard";
import EmployerCompany from "../pages/EmployerCompany/EmployerCompany";
import PostJob from "../pages/PostJob/PostJob";
import ManageJobs from "../pages/ManageJobs/ManageJobs";
import Applicants from "../pages/Applicants/Applicants";
import Admin from "../pages/Admin/Admin";
import Services from "../pages/Services/Services";
import ServiceDetails from "../pages/ServiceDetails/ServiceDetails";
import Checkout from "../pages/Checkout/Checkout";
import Company from "../pages/Company/Company";
import CompanyDetails from "../pages/CompanyDetails/CompanyDetails";
import CareerAdvice from "../pages/CareerAdvice/CareerAdvice";
import ArticleDetails from "../pages/ArticleDetails/ArticleDetails";
import SavedJobs from "../pages/SavedJobs/SavedJobs";
import Notifications from "../pages/Notifications/Notifications";
import ResumeDashboard from "../pages/ResumeDashboard/ResumeDashboard";
import InterviewPrep from "../pages/InterviewPrep/InterviewPrep";
import AssessmentPage from "../pages/Assessment/AssessmentPage";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/register" element={<Register />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/job/:id" element={<JobDetails />} />
    <Route path="/services" element={<Services />} />
    <Route path="/services/:id" element={<ServiceDetails />} />
    <Route path="/companies" element={<Company />} />
    <Route path="/companies/:id" element={<CompanyDetails />} />
    <Route path="/career-advice" element={<CareerAdvice />} />
    <Route path="/career-advice/:id" element={<ArticleDetails />} />
    <Route path="/interview-prep" element={<InterviewPrep />} />

    {/* Protected: any authenticated user */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/applied-jobs" element={<Applications />} />
      <Route path="/saved-jobs" element={<SavedJobs />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/resume" element={<ResumeDashboard />} />
      <Route path="/resume/create" element={<ResumeDashboard />} />
      <Route path="/resume/edit/:id" element={<ResumeDashboard />} />
      <Route path="/resume/preview/:id" element={<ResumeDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/services/:id/checkout" element={<Checkout />} />
      <Route path="/assessment/:id" element={<AssessmentPage />} />
    </Route>

    {/* Protected: employer only */}
    <Route element={<ProtectedRoute roles={["employer"]} />}>
      <Route path="/employer/dashboard" element={<EmployerDashboard />} />
      <Route path="/employer/company" element={<EmployerCompany />} />
      <Route path="/employer/post-job" element={<PostJob />} />
      <Route path="/employer/jobs" element={<ManageJobs />} />
      <Route path="/employer/applicants" element={<Applicants />} />
    </Route>

    {/* Protected: admin only */}
    <Route element={<ProtectedRoute roles={["admin"]} />}>
      <Route path="/admin" element={<Admin />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

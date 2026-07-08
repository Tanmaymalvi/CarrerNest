import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Menu, X, ChevronDown, Bell, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button, Container } from "../ui";
import { authApi } from "../../services/api";
import { logout } from "../../redux/authSlice";
import "./Navbar.css";

const mainLinks = [
  ["Home", "/"],
  ["Jobs", "/jobs"],
  ["Companies", "/companies"],
  ["Services", "/services"],
  ["Interview Prep", "/interview-prep"],
  ["Career Advice", "/career-advice"],
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [employerDropdown, setEmployerDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector((state) => state.auth);
  const isLoggedIn = auth?.user;
  const role = auth?.user?.role;

  const visibleLinks = [...mainLinks];
  if (isLoggedIn && role === "admin") {
    visibleLinks.push(["Admin", "/admin"]);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Cookie may already be expired; clear frontend state either way.
    }
    // Clear all cached data from browser storage
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
    toast.success("Logged out");
    navigate("/login");
    setProfileDropdown(false);
  };


  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-slate-200 bg-white/95 shadow-md dark:border-white/10 dark:bg-slate-950/95 dark:shadow-lg dark:shadow-black/30" 
          : "border-b border-white/50 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="CareerNest home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/20">
            <BriefcaseBusiness size={20} />
          </span>
          <span className="hidden sm:block">
            <span className="block text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
              Career<span className="text-teal-600">Nest</span>
            </span>
          </span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {visibleLinks.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* For Employers Dropdown */}
          <div className="relative">
            <button
              onClick={() => setEmployerDropdown(!employerDropdown)}
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              For Employers
              <ChevronDown size={16} className={`transition-transform ${employerDropdown ? "rotate-180" : ""}`} />
            </button>

            {employerDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">
                <NavLink
                  to="/employer/dashboard"
                  onClick={() => setEmployerDropdown(false)}
                  className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5 first:rounded-t-xl"
                >
                  Employer Dashboard
                </NavLink>
                <NavLink
                  to="/employer/post-job"
                  onClick={() => setEmployerDropdown(false)}
                  className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  Post a Job
                </NavLink>
                <NavLink
                  to="/employer/jobs"
                  onClick={() => setEmployerDropdown(false)}
                  className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  Manage Jobs
                </NavLink>
                <NavLink
                  to="/employer/applicants"
                  onClick={() => setEmployerDropdown(false)}
                  className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  Applications
                </NavLink>
                <NavLink
                  to="/employer/company"
                  onClick={() => setEmployerDropdown(false)}
                  className="block rounded-b-xl px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  Company Profile
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Notifications */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          )}

          {/* Auth Actions / Profile */}
          {isLoggedIn ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500"></div>
                <ChevronDown size={16} className={`transition-transform ${profileDropdown ? "rotate-180" : ""}`} />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900">
                  <NavLink
                    to="/profile"
                    onClick={() => setProfileDropdown(false)}
                    className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5 first:rounded-t-xl"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to={role === "admin" ? "/admin" : role === "employer" ? "/employer/dashboard" : "/student/dashboard"}
                    onClick={() => setProfileDropdown(false)}
                    className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    Dashboard
                  </NavLink>
                  {role === "student" && (
                    <>
                      <NavLink
                        to="/applied-jobs"
                        onClick={() => setProfileDropdown(false)}
                        className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        Applied Jobs
                      </NavLink>
                      <NavLink
                        to="/saved-jobs"
                        onClick={() => setProfileDropdown(false)}
                        className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        Saved Jobs
                      </NavLink>
                      <NavLink
                        to="/resume"
                        onClick={() => setProfileDropdown(false)}
                        className="block border-b border-slate-100 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        Resume
                      </NavLink>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-b-xl px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button to="/login" variant="secondary">Login</Button>
              <Button to="/register">Sign up</Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white md:hidden dark:border-white/10 dark:bg-white/10"
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl dark:border-white/10 dark:bg-slate-950">
          <nav className="grid gap-3">
            {visibleLinks.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="border-t border-slate-200 pt-3 dark:border-white/10">
              <button
                onClick={() => {
                  setEmployerDropdown(!employerDropdown);
                }}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                For Employers
                <ChevronDown size={16} className={`transition-transform ${employerDropdown ? "rotate-180" : ""}`} />
              </button>

              {employerDropdown && (
                <div className="mt-2 space-y-2 pl-4">
                  <NavLink
                    to="/employer/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    Employer Dashboard
                  </NavLink>
                  <NavLink
                    to="/employer/post-job"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    Post a Job
                  </NavLink>
                  <NavLink
                    to="/employer/jobs"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    Manage Jobs
                  </NavLink>
                  <NavLink
                    to="/employer/applicants"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    Applications
                  </NavLink>
                  <NavLink
                    to="/employer/company"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    Company Profile
                  </NavLink>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <>
                <div className="border-t border-slate-200 pt-3 dark:border-white/10">
                  <NavLink
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to={auth?.user?.role === "admin" ? "/admin" : auth?.user?.role === "employer" ? "/employer/dashboard" : "/student/dashboard"}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-slate-200 pt-3 dark:border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <Button to="/login" variant="secondary">Login</Button>
                  <Button to="/register">Sign up</Button>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

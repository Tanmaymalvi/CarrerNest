import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { Button, Container } from "../../components/ui";
import { authApi, otpApi } from "../../services/api";
import { loginSuccess } from "../../redux/authSlice";
import logoImg from "../../assets/images/logo.png";
import logoIcon from "../../assets/images/logo_icon.png";

import "./Login.css";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mode, setMode] = useState("password");
  const [formData, setFormData] = useState({ email: "", password: "", otp: "", remember: false });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("oauth") === "success") {
      const checkOAuth = async () => {
        try {
          const { data } = await authApi.me();
          if (data.success && data.user) {
            finishLogin(data.user);
          } else {
            toast.error("Google authentication failed. Please try again.");
          }
        } catch {
          toast.error("Google authentication failed. Please try again.");
        }
      };
      checkOAuth();
    } else if (params.get("error")) {
      toast.error(params.get("error"));
    }
  }, []);

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const finishLogin = (user) => {
    dispatch(loginSuccess(user));
    toast.success("Login successful");
    navigate(user?.role === "admin" ? "/admin" : user?.role === "employer" ? "/employer/dashboard" : "/student/dashboard");
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login({ email: formData.email, password: formData.password });
      finishLogin(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const sendLoginOtp = async () => {
    if (!formData.email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    try {
      await otpApi.send({ email: formData.email, purpose: "login" });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await otpApi.verify({ email: formData.email, otp: formData.otp, purpose: "login" });
      const { data } = await authApi.otpLogin({ email: formData.email });
      finishLogin(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 md:py-14">
      <Container className="max-w-[900px] grid items-center gap-x-8 gap-y-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Welcome back
          </p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-950 dark:text-white sm:text-6xl">
            Sign in to manage your career moves.
          </h1>
          <div className="mt-5 rounded-3xl bg-white p-6 shadow-xl dark:bg-white/10">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center gap-4"
            >
              <img 
                src={logoIcon} 
                alt="CareerNest Icon" 
                className="h-16 w-16 object-contain" 
              />
              <div>
                <p className="font-bold text-slate-950 dark:text-white">CareerNest secure access</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Applications, dashboards, resumes, and notifications in one account.</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <form
          onSubmit={
            mode === "password"
              ? handlePasswordLogin
              : otpSent
              ? handleOtpLogin
              : (e) => {
                  e.preventDefault();
                  sendLoginOtp();
                }
          }
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <div className="mb-6 flex flex-col items-center">
            <img 
              src={logoImg} 
              alt="CareerNest Logo" 
              className="h-10 w-auto object-contain" 
            />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 dark:bg-white/10">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setOtpSent(false);
                setFormData((prev) => ({ ...prev, otp: "" }));
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                mode === "password"
                  ? "bg-teal-700 text-white"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("otp");
                setOtpSent(false);
                setFormData((prev) => ({ ...prev, otp: "" }));
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                mode === "otp"
                  ? "bg-teal-700 text-white"
                  : "text-slate-700 dark:text-slate-200"
              }`}
            >
              OTP Login
            </button>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl bg-white px-4 dark:bg-white/10">
              <Mail size={18} className="text-teal-700" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent text-sm outline-none" placeholder="you@example.com" required />
            </span>
          </label>

          {mode === "password" && (
            <label className="mt-4 block">
              <span className="text-sm font-semibold">Password</span>
              <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl bg-white px-4 dark:bg-white/10">
                <LockKeyhole size={18} className="text-teal-700" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-transparent text-sm outline-none" placeholder="Password" required />
              </span>
            </label>
          )}

          {mode === "otp" && otpSent && (
            <label className="mt-4 block">
              <span className="text-sm font-semibold">OTP</span>
              <span className="mt-1.5 flex min-h-11 items-center gap-3 rounded-xl bg-white px-4 dark:bg-white/10">
                <ShieldCheck size={18} className="text-teal-700" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="6-digit OTP"
                  required
                  autoComplete="one-time-code"
                />
              </span>
            </label>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input name="remember" type="checkbox" checked={formData.remember} onChange={handleChange} />
              Remember me
            </label>
            {mode === "password" && (
              <Link to="/forgot-password" className="font-semibold text-teal-700 dark:text-teal-300">Forgot password?</Link>
            )}
          </div>

          {mode === "otp" && !otpSent ? (
            <Button type="submit" className="mt-5 w-full">{loading ? "Sending..." : "Send OTP"}</Button>
          ) : (
            <Button type="submit" className="mt-5 w-full">{loading ? "Please wait..." : mode === "password" ? "Login" : "Verify OTP & Login"}</Button>
          )}

          {mode === "otp" && otpSent ? (
            <Button type="button" variant="secondary" onClick={sendLoginOtp} className="mt-3 w-full">Resend OTP</Button>
          ) : null}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={handleGoogleLogin}>
              <Globe2 size={17} /> Google
            </Button>
            <Button type="button" variant="secondary" onClick={() => toast("LinkedIn login UI is ready; OAuth credentials are not configured yet.")}>
              <span className="font-bold">in</span> LinkedIn
            </Button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
            New to CareerNest?
            <Link className="ml-2 font-bold text-teal-700 dark:text-teal-300" to="/register">Create account</Link>
          </p>
        </form>
      </Container>
    </section>
  );
};

export default Login;

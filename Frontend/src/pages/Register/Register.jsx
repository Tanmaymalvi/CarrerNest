import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Globe2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { Button, Container } from "../../components/ui";
import { authApi, otpApi } from "../../services/api";
import { loginSuccess } from "../../redux/authSlice";
import logoImg from "../../assets/images/logo.png";

import "./Register.css";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${backendUrl}/auth/google`;
  };

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await otpApi.send({
        email: formData.email,
        purpose: "registration",
      });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndCreate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await otpApi.verify({
        email: formData.email,
        otp,
        purpose: "registration",
      });

      const { data } = await authApi.register({
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
      });

      dispatch(loginSuccess(data.user));
      toast.success("Registration successful");
      navigate(data.user?.role === "admin" ? "/admin" : data.user?.role === "employer" ? "/employer/dashboard" : "/student/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 md:py-14">
      <Container className="max-w-[900px]">
        <div className="mb-5 flex flex-col items-center text-center">
          <img 
            src={logoImg} 
            alt="CareerNest Logo" 
            className="mb-4 h-12 w-auto object-contain" 
          />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Create account
          </p>

          <h1 className="mt-4 text-4xl font-extrabold text-slate-950 dark:text-white sm:text-5xl">
            Join CareerNest
          </h1>
        </div>

        {!otpSent ? (
          <form
            onSubmit={handleRegister}
            className="glass grid gap-4 rounded-3xl p-6 sm:grid-cols-2 sm:p-8"
          >
          {/* Full Name */}

          <label className="block">
            <span className="text-sm font-semibold">
              Full Name
            </span>

            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="mt-1.5 min-h-11 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10"
              placeholder="Full Name"
              required
            />
          </label>

          {/* Email */}

          <label className="block">
            <span className="text-sm font-semibold">
              Email
            </span>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1.5 min-h-11 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10"
              placeholder="Email"
              required
            />
          </label>

          {/* Password */}

          <label className="block">
            <span className="text-sm font-semibold">
              Password
            </span>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1.5 min-h-11 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10"
              placeholder="Password"
              required
            />
          </label>

          {/* Confirm Password */}

          <label className="block">
            <span className="text-sm font-semibold">
              Confirm Password
            </span>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1.5 min-h-11 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10"
              placeholder="Confirm Password"
              required
            />
          </label>

          {/* Role */}

          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold">
              I am registering as
            </span>

            <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
              {["student", "employer"].map((role) => (
                <label
                  key={role}
                  className="flex min-h-11 items-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold dark:bg-white/10"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                  />

                  {role === "student" ? "Student" : "Employer"}
                </label>
              ))}
            </div>
          </label>

          {/* Terms */}

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" required />
            I accept the terms and privacy policy
          </label>

          {/* Submit */}

          <Button
            type="submit"
            className="sm:col-span-2"
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </Button>

          <div className="grid gap-3 sm:grid-cols-2 sm:col-span-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Globe2 size={17} />
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => toast("LinkedIn sign up UI is ready; OAuth credentials are not configured yet.")}
            >
              <span className="font-bold">in</span>
              Continue with LinkedIn
            </Button>
          </div>

          <p className="text-center text-sm text-slate-600 sm:col-span-2 dark:text-slate-300">
            Already have an account?

            <Link
              className="ml-2 font-bold text-teal-700 dark:text-teal-300"
              to="/login"
            >
              Login
            </Link>
          </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndCreate} className="glass mx-auto grid max-w-xl gap-4 rounded-3xl p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Verify your email</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Enter the 6-digit OTP sent to {formData.email}.</p>
            </div>
            <label>
              <span className="text-sm font-semibold">OTP</span>
              <input value={otp} onChange={(event) => setOtp(event.target.value)} maxLength={6} required className="mt-1.5 min-h-11 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10" />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="submit">{loading ? "Verifying..." : "Verify & Create Account"}</Button>
              <Button type="button" variant="secondary" onClick={handleRegister}>Resend OTP</Button>
            </div>
          </form>
        )}
      </Container>
    </section>
  );
};

export default Register;

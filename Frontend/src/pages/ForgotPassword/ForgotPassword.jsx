import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Container } from "../../components/ui";
import { authApi, otpApi } from "../../services/api";

import "./ForgotPassword.css";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const sendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await otpApi.send({ email: form.email, purpose: "password-reset" });
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await otpApi.verify({ email: form.email, otp: form.otp, purpose: "password-reset" });
      toast.success("OTP verified");
      setStep("reset");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ email: form.email, password: form.password });
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad">
      <Container className="max-w-xl">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Account recovery
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950 dark:text-white">Reset your password</h1>

          {step === "email" ? (
            <form onSubmit={sendOtp} className="mt-6 grid gap-4">
              <label>
                <span className="text-sm font-semibold">Email</span>
                <input name="email" type="email" value={form.email} onChange={update} required className="mt-2 min-h-12 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <Button type="submit">{loading ? "Sending..." : "Send OTP"}</Button>
            </form>
          ) : null}

          {step === "otp" ? (
            <form onSubmit={verifyOtp} className="mt-6 grid gap-4">
              <label>
                <span className="text-sm font-semibold">OTP</span>
                <input name="otp" value={form.otp} onChange={update} required maxLength={6} className="mt-2 min-h-12 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="submit">{loading ? "Verifying..." : "Verify OTP"}</Button>
                <Button type="button" variant="secondary" onClick={sendOtp}>Resend OTP</Button>
              </div>
            </form>
          ) : null}

          {step === "reset" ? (
            <form onSubmit={resetPassword} className="mt-6 grid gap-4">
              <label>
                <span className="text-sm font-semibold">New password</span>
                <input name="password" type="password" value={form.password} onChange={update} required className="mt-2 min-h-12 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <label>
                <span className="text-sm font-semibold">Confirm password</span>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} required className="mt-2 min-h-12 w-full rounded-xl bg-white px-4 text-sm outline-none dark:bg-white/10" />
              </label>
              <Button type="submit">{loading ? "Resetting..." : "Reset Password"}</Button>
            </form>
          ) : null}

          <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-teal-700 dark:text-teal-300">
            Back to login
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default ForgotPassword;

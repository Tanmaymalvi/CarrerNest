import express from "express";
import passport from "../config/passport.js";
import generateToken from "../utils/generateToken.js";
import { login, logout, me, otpLogin, register, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=Google authentication failed` }),
  (req, res) => {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=No user details returned`);
    }
    // Generate JWT token in cookie
    generateToken(res, req.user._id);
    
    // Redirect to frontend callback processor page or login page with success flag
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?oauth=success`);
  }
);

router.post("/register", register);
router.post("/login", login);
router.post("/otp-login", otpLogin);
router.post("/logout", logout);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);

export default router;

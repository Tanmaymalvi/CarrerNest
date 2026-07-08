import User from "../models/User.js";
import OTP from "../models/OTP.js";
import generateToken from "../utils/generateToken.js";

// User response
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  skills: user.skills,
});

// ================= REGISTER =================

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const verifiedOtp = await OTP.findOne({
      email,
      purpose: "registration",
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Please verify your email OTP before creating an account",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role?.toLowerCase() || "student",
    });

    generateToken(res, user._id);
    await OTP.deleteMany({ email, purpose: "registration" });

    return res.status(201).json({
      success: true,
      user: userResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    generateToken(res, user._id);

    return res.status(200).json({
      success: true,
      user: userResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const otpLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const verifiedOtp = await OTP.findOne({
      email,
      purpose: "login",
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verifiedOtp) {
      return res.status(400).json({ message: "Please verify login OTP first" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    generateToken(res, user._id);
    await OTP.deleteMany({ email, purpose: "login" });

    return res.status(200).json({
      success: true,
      user: userResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= LOGOUT =================

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};

// ================= CURRENT USER =================

export const me = async (req, res) => {
  res.status(200).json(userResponse(req.user));
};

// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const verifiedOtp = await OTP.findOne({
      email,
      purpose: "password-reset",
      verified: true,
      expiresAt: { $gt: new Date() },
    });

    if (!verifiedOtp) {
      return res.status(400).json({ message: "Please verify password reset OTP first" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    user.password = password;
    await user.save();
    await OTP.deleteMany({ email, purpose: "password-reset" });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

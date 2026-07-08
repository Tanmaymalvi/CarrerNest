import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import OTP from "../models/OTP.js";
import User from "../models/User.js";

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// SMTP connection test
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.status(400).json({
        message: "Email and purpose are required",
      });
    }

    // Registration check
    if (purpose === "registration") {
      const exists = await User.findOne({ email });

      if (exists) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
    }

    // Login / Reset check
    if (
      purpose === "password-reset" ||
      purpose === "login"
    ) {
      const exists = await User.findOne({ email });

      if (!exists) {
        return res.status(404).json({
          message: "No account found with this email",
        });
      }
    }

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Delete old OTPs
    await OTP.deleteMany({ email, purpose });

    // Save new OTP
    await OTP.create({
      email,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      verified: false,
    });

    // Email template
    const mailOptions = {
      from: `"CareerNest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "CareerNest OTP Verification",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>CareerNest OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#14b8a6">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
          <p>Please do not share it with anyone.</p>
        </div>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp || !purpose) {
      return res.status(400).json({
        message: "Email, OTP and purpose are required",
      });
    }

    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP Verify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};
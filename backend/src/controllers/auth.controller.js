import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userDao from "../dao/user.dao.js";
import * as utils from "../utils/utils.js";
import config from "../config/config.js";

const isProduction = process.env.NODE_ENV === "production";
const isSecure = isProduction || config.CLIENT_URL?.startsWith("https://");

const cookieOptions = {
  httpOnly: true,
  path: "/",
  secure: isSecure,
  sameSite: isSecure ? "none" : "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
};

export async function register(req, res) {
  try {
    const { fullname, email, password } = req.body;

    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const trimmedFullname = fullname.trim();
    const normalizedEmail = email.toLowerCase().trim();

    if (!trimmedFullname) {
      return res.status(400).json({
        success: false,
        message: "Full name cannot be empty",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await userDao.findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userDao.createUser({
      fullname: trimmedFullname,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = utils.generateJWT({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
    });

    // Set HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userDao.findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = utils.generateJWT({ id: user._id, fullname: user.fullname, email: user.email });
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await userDao.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

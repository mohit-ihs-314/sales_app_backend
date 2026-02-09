const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// GENERATE JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER USER (Admin / Sales)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔴 Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "sales",
    });

    // 🔐 Create email verification token
    const verifyToken = crypto.randomBytes(20).toString("hex");

    user.emailVerifyToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    await user.save();

    const verifyUrl =
      `https://sales-app-backend-eti3.onrender.com/api/auth/verify-email/${verifyToken}`;

    const message = `
      <h2>Verify Your Email</h2>
      <p>Click below link to activate your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `;

    await sendEmail(user.email, "Verify your account", message);

    res.status(201).json({
      message: "Registration successful. You can now login.",
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ find user
    const user = await User.findOne({ email });

    // 2️⃣ check credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ 🔐 check email verification HERE
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before login",
      });
    }

    // 4️⃣ send token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Always return success (security best practice)
    if (!user) {
      return res.json({
        message: "If this email exists, reset link sent",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetUrl =
      `https://sales-app-backend-eti3.onrender.com/api/auth/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset</h2>
      <p>Click link below to reset password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    // Send email in background
    sendEmail(user.email, "Reset Password", message)
      .then(() => console.log("Reset email sent"))
      .catch((err) => console.log("Email failed:", err.message));

    res.json({
      message: "If this email exists, reset link sent",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ emailVerifyToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  await user.save();

  res.send("Email verified successfully! You can now login.");
};
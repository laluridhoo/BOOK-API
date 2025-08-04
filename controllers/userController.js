const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const errorResponse = require("../utils/errorResponse");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return errorResponse(res, 400, "User already exists", "USER_EXISTS");

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    },
  });
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return errorResponse(res, 401, "Invalid email or password", "INVALID_CREDENTIALS");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    },
  });
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 400, "Isi semua field", "MISSING_FIELDS");
  }

  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, "Password lama salah", "INVALID_PASSWORD");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};
// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};
// update user Profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};
// Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    await Book.deleteMany({ user: req.user._id }); // Hapus buku miliknya
    await User.findByIdAndDelete(req.user._id); // Hapus user
    res.json({ message: "Akun dan semua data dihapus" });
  } catch (err) {
    errorResponse(res, 500, err.message, "SERVER_ERROR");
  }
};
//logout User
exports.logoutUser = (req, res) => {
  // Tidak ada token di server (JWT stateless), jadi frontend yang hapus token
  res.json({ message: "Logout berhasil. Silakan hapus token di client." });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, 404, "User not found", "USER_NOT_FOUND");

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 jam
    await user.save();

    // Di dalam controller backend Anda

const resetUrl = `http://localhost:8080/reset-password?token=${resetToken}`;

    // Kirim Email (pakai nodemailer atau console.log)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // email pengirim (sender)
        pass: process.env.EMAIL_PASS, // app password / 2FA
      },
    });

    const mailOptions = {
      to: user.email,
      subject: "Password Reset - Book API",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset password email sent" });
  } catch (err) {
    errorResponse(res, 500, "Server error", "SERVER_ERROR", err.message);
  }
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  try {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return errorResponse(res, 400, "Invalid or expired token", "INVALID_TOKEN");

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    errorResponse(res, 500, "Server error", "SERVER_ERROR", err.message);
  }
};

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Isi semua field" });
  }

  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password berhasil diganti" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get User Profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};
// update user Profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    await Book.deleteMany({ user: req.user._id }); // Hapus buku miliknya
    await User.findByIdAndDelete(req.user._id); // Hapus user
    res.json({ message: "Akun dan semua data dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//logout User
exports.logoutUser = (req, res) => {
  // Tidak ada token di server (JWT stateless), jadi frontend yang hapus token
  res.json({ message: "Logout berhasil. Silakan hapus token di client." });
};

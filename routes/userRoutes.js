const express = require("express");
const router = express.Router();
const { registerUser, loginUser, changePassword, getProfile, updateProfile, deleteAccount, logoutUser, forgotPassword, resetPassword } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/change-password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/delete-account", protect, deleteAccount);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

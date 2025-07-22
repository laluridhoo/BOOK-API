const express = require("express");
const router = express.Router();
const { registerUser, loginUser, changePassword, getProfile, updateProfile, deleteAccount, logoutUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/password", protect, changePassword);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/", protect, deleteAccount);
router.post("/logout", protect, logoutUser);

module.exports = router;

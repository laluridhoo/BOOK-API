const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

const protect = async (req, res, next) => {
  // Ambil token dari header Authorization dengan format "Bearer <token>"
  let token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return errorResponse(res, 401, "Not authorized, no token", "NO_TOKEN");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    errorResponse(res, 401, "Not authorized, invalid token", "INVALID_TOKEN");
  }
};

module.exports = protect;

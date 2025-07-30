const mongoose = require("mongoose");
const errorResponse = require("../utils/errorResponse");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    // Format error response yang konsisten
    const errorObj = {
      success: false,
      message: "Database connection failed",
      error: {
        code: "DB_CONNECTION_ERROR",
        details: error.message,
      },
    };

    console.error("Database Error Response:", JSON.stringify(errorObj, null, 2));
    process.exit(1);
  }
};

module.exports = connectDB;

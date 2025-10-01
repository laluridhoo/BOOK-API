const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set in environment variables");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error(
      "Database Error Response:",
      JSON.stringify(
        {
          success: false,
          message: "Database connection failed",
          error: { code: "DB_CONNECTION_ERROR", details: error.message },
        },
        null,
        2
      )
    );
    // Jangan hentikan proses agar /health tetap dapat diakses di lingkungan produksi
    return null;
  }
};

module.exports = connectDB;

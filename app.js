const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// 1. Konfigurasi CORS (cukup satu kali)
app.use(
  cors({
    origin: ["http://localhost:8080", "https://yourfrontenddomain.com"],
    credentials: true,
  })
);

// 2. Middleware untuk parsing body
app.use(express.json());

// 3. Semua rute API Anda
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/ai-assistant", aiRoutes);

// 4. Error handler di posisi paling akhir
app.use(errorHandler);

module.exports = app;

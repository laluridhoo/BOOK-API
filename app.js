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
app.use(express.urlencoded({ extended: true }));

// 2b. Middleware logging sederhana untuk debug payload
app.use((req, res, next) => {
  console.log("[REQUEST]", {
    method: req.method,
    url: req.originalUrl,
    contentType: req.headers["content-type"],
    body: req.body,
  });
  next();
});

// 3. Semua rute API Anda
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/ai-assistant", aiRoutes);

// 4. Error handler di posisi paling akhir
app.use(errorHandler);

module.exports = app;

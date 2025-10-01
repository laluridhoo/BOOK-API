const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// 1. Konfigurasi CORS (cukup satu kali)
const allowedOrigins = ["http://localhost:8080", "http://localhost:3000", "https://rak-buku-ku-app.vercel.app"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools

    const isVercelPreview = /^https?:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
    if (allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// 1b. Health check sederhana untuk validasi deployment/proxy
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 2. Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2b. Middleware logging sederhana untuk debug payload
// app.use((req, res, next) => {
//   console.log("[REQUEST]", {
//     method: req.method,
//     url: req.originalUrl,
//     contentType: req.headers["content-type"],
//     body: req.body,
//   });
//   next();
// });

// 3. Semua rute API Anda
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/ai-assistant", aiRoutes);

// 4. Error handler di posisi paling akhir
app.use(errorHandler);

module.exports = app;

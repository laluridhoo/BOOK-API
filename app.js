require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bookRoutes = require("./routes/bookRoutes");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:8080", "https://yourfrontenddomain.com"],
    credentials: true,
  })
);
app.use("/api/books", bookRoutes);
app.use(errorHandler);
app.use("/api/users", userRoutes);
app.use("/api/ai-assistant", aiRoutes);

module.exports = app;

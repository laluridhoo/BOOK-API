const express = require("express");
const app = express();
const bookRoutes = require("./routes/bookRoutes");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use("/api/books", bookRoutes);
app.use(errorHandler);
app.use("/api/users", userRoutes);

module.exports = app;

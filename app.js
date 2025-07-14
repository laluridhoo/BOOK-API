const express = require("express");
const app = express();
const bookRoutes = require("./routes/bookRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api/books", bookRoutes);
app.use(errorHandler);

module.exports = app;

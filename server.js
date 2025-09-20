const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

console.log("MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // 👈 MUST BE AT THE TOP

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: "*",
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/leads", leadRoutes);


app.get("/", (req, res) => {
  res.send("Backend running with DB");
});

app.get("/health", (req, res) => {
  res.send("Server is healthy 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

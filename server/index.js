require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-study-buddy-lilac-ten.vercel.app",
];

const app = express();

connectDB();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
})); // adjust origin once React is running
app.use(express.json());
app.use(cookieParser());


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});
const authRoutes = require("./routes/authRoutes");
// ...existing middleware (cors, express.json, cookieParser)...
app.use("/api/auth", authRoutes);

const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
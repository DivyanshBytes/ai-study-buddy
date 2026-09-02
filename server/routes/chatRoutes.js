const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { askQuestion, getChatHistory } = require("../controllers/chatController");
const aiLimiter = require("../middlewares/rateLimiter");

router.post("/ask", protect, aiLimiter, askQuestion);
router.get("/history", protect, getChatHistory);

module.exports = router;
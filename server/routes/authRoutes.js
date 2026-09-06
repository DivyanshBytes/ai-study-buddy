const express = require("express");
const router = express.Router();
const { signup, login, logout, getMe } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;
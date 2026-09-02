const express = require("express");
const router = express.Router();
const { signup, login, logout} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, (req, res) => {
  res.json({ message: "You are authenticated", userId: req.userId });
});

module.exports = router;
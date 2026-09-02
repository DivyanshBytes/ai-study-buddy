const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadDocument, getDocuments, deleteDocument } = require("../controllers/documentController");
const aiLimiter = require("../middlewares/rateLimiter");

router.post("/upload", protect, aiLimiter, upload.single("file"), uploadDocument);
router.get("/", protect, aiLimiter, getDocuments);
router.delete("/:id", protect, aiLimiter, deleteDocument);


module.exports = router;
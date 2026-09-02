const pdfParse = require("pdf-parse");
const Document = require("../models/Document");
const Chunk = require("../models/Chunk");
const chunkText = require("../utils/chunkText");
const embedText = require("../utils/embedText");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const data = await pdfParse(req.file.buffer);
    const rawText = data.text;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from this PDF" });
    }

    const document = await Document.create({
      user: req.userId,
      fileName: req.file.originalname,
      rawText,
    });

    const textChunks = chunkText(rawText);

    // generate an embedding for every chunk (in parallel)
    const embeddings = await Promise.all(
      textChunks.map((chunk) => embedText(chunk))
    );

    // pair each chunk's text with its embedding
    const chunkDocs = textChunks.map((text, index) => ({
      document: document._id,
      user: req.userId,
      text,
      chunkIndex: index,
      embedding: embeddings[index],
    }));

    await Chunk.insertMany(chunkDocs);

    res.status(201).json({
      message: "Document uploaded, chunked, and embedded",
      document: {
        id: document._id,
        fileName: document.fileName,
        totalChunks: chunkDocs.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Server error during upload" });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.userId })
      .select("fileName createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({ documents });
  } catch (error) {
    console.error("Get documents error:", error.message);
    res.status(500).json({ message: "Server error fetching documents" });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({ _id: id, user: req.userId });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    await Chunk.deleteMany({ document: id });
    await Document.deleteOne({ _id: id });

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error.message);
    res.status(500).json({ message: "Server error deleting document" });
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };
const Chat = require("../models/Chat");
const retrieveChunks = require("../utils/retrieveChunks");
const generateAnswer = require("../utils/generateAnswer");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Question is required" });
    }

    // retrieve relevant chunks for this user
    const relevantChunks = await retrieveChunks(question, req.userId);

    if (relevantChunks.length === 0) {
      return res.status(404).json({
        message: "No documents found. Please upload a document first.",
      });
    }

    // generate the answer grounded in those chunks
    const answer = await generateAnswer(question, relevantChunks);

    // save the exchange to chat history
    const chat = await Chat.create({
      user: req.userId,
      question,
      answer,
    });

    res.status(200).json({
      question: chat.question,
      answer: chat.answer,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while answering question" });
    }
};

const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.userId }).sort({ createdAt: 1 });
    res.status(200).json({ chats });
  } catch (error) {
    console.error("Get history error:", error.message);
    res.status(500).json({ message: "Server error fetching chat history" });
  }
};

module.exports = { askQuestion, getChatHistory };
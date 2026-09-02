const genAI = require("./geminiClient");

const generateAnswer = async (question, contextChunks) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const context = contextChunks.join("\n\n---\n\n");

  const prompt = `You are a helpful study assistant. Answer the user's question using ONLY the context provided below. If the context doesn't contain enough information to answer, say so honestly instead of making something up.

Context:
${context}

Question: ${question}

Answer:`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = generateAnswer;
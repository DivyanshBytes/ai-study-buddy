const Chunk = require("../models/Chunk");
const embedText = require("./embedText");
const cosineSimilarity = require("./cosineSimilarity");

const retrieveChunks = async (question, userId, topN = 4) => {
  // embed the incoming question the same way we embedded document chunks
  const questionEmbedding = await embedText(question);

  // get all chunks belonging to this user
  const chunks = await Chunk.find({ user: userId });

  // score every chunk against the question
  const scoredChunks = chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  // sort by score, highest similarity first
  scoredChunks.sort((a, b) => b.score - a.score);

  // return just the top N chunks' text
  return scoredChunks.slice(0, topN).map((item) => item.chunk.text);
};

module.exports = retrieveChunks;
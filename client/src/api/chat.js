import api from "./axios";

export const askQuestion = (question) => api.post("/chat/ask", { question });
export const getChatHistory = () => api.get("/chat/history");
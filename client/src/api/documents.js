import api from "./axios";

export const uploadDocument = (formData) => api.post("/documents/upload", formData);
export const getDocuments = () => api.get("/documents");
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
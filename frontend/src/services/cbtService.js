import api from "../utils/api";

// Send message and get bot reply
export const sendChatMessage = (message) => api.post("/api/cbt/chat", { message });

// Get past chat history
export const getChatHistory = () => api.get("/api/cbt/history");

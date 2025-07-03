import api from "../utils/api";

// Send message and get bot reply
export const sendChatMessage = (message) => api.post("/cbt/chat", { message });

// Get past chat history
export const getChatHistory = () => api.get("/cbt/history");

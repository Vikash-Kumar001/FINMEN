import api from "../utils/api";

export const getMyJournals = async () => {
  return await api.get("/api/journal/me");
};

export const createJournalEntry = async (entry) => {
  return await api.post("/api/journal", entry);
};

export const updateJournalEntry = async (id, updatedEntry) => {
  return await api.put(`/api/journal/${id}`, updatedEntry);
};

export const deleteJournalEntry = async (id) => {
  return await api.delete(`/api/journal/${id}`);
};

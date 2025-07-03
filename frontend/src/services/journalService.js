import axios from "axios";
import api from "../utils/api";

const API = import.meta.env.VITE_API;

export const getMyJournals = async () => {
  return await axios.get(`${API}/journal/me`, { withCredentials: true });
};

export const createJournalEntry = async (entry) => {
  return await axios.post(`${API}/journal`, entry, { withCredentials: true });
};

export const updateJournalEntry = async (id, updatedEntry) => {
  return await axios.put(`${API}/journal/${id}`, updatedEntry, {
    withCredentials: true,
  });
};

export const deleteJournalEntry = async (id) => {
  return await axios.delete(`${API}/journal/${id}`, { withCredentials: true });
};

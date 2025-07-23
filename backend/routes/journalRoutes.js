import express from "express";
import {
  createJournal,
  getMyJournals,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

// All journal routes are protected
router.use(requireAuth);

// 📝 POST /api/journal — Create a new journal entry
router.post("/", createJournal);

// 📄 GET /api/journal — Get logged-in user's journals
router.get("/", getMyJournals);

// ✏️ PUT /api/journal/:id — Update a journal entry
router.put("/:id", updateJournal);

// ❌ DELETE /api/journal/:id — Delete a journal entry
router.delete("/:id", deleteJournal);

export default router;

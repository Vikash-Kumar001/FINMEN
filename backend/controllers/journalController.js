import Journal from "../models/Journal.js";

// 📝 Create new journal
export const createJournal = async (req, res) => {
  const { title, content } = req.body;

  try {
    const journal = await Journal.create({
      userId: req.user._id,
      title,
      content,
    });

    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ error: "Failed to create journal" });
  }
};

// 📚 Get user's journals
export const getMyJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.status(200).json(journals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch journals" });
  }
};

// ✏️ Update journal
export const updateJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.status(200).json(journal);
  } catch (err) {
    res.status(500).json({ error: "Failed to update journal" });
  }
};

// ❌ Delete journal
export const deleteJournal = async (req, res) => {
  try {
    await Journal.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.status(200).json({ message: "Journal deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete journal" });
  }
};

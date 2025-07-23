import Journal from "../models/Journal.js";

// 📝 Create new journal
export const createJournal = async (req, res) => {
  const { title, content, tags } = req.body;

  try {
    const journal = await Journal.create({
      userId: req.user._id,
      title: title || "Untitled Entry",
      content,
      tags: tags || [],
    });

    res.status(201).json(journal);
  } catch (err) {
    console.error("Error creating journal:", err);
    res.status(500).json({ error: "Failed to create journal" });
  }
};

// 📚 Get user's journals
export const getMyJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json(journals);
  } catch (err) {
    console.error("Error fetching journals:", err);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
};

// 📖 Get single journal
export const getJournal = async (req, res) => {
  try {
    const journal = await Journal.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).lean();
    
    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }
    
    res.status(200).json(journal);
  } catch (err) {
    console.error("Error fetching journal:", err);
    res.status(500).json({ error: "Failed to fetch journal" });
  }
};

// ✏️ Update journal
export const updateJournal = async (req, res) => {
  const { title, content, tags } = req.body;
  
  try {
    const journal = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        title: title || "Untitled Entry",
        content,
        tags: tags || [],
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }
    
    res.status(200).json(journal);
  } catch (err) {
    console.error("Error updating journal:", err);
    res.status(500).json({ error: "Failed to update journal" });
  }
};

// ❌ Delete journal
export const deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }
    
    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (err) {
    console.error("Error deleting journal:", err);
    res.status(500).json({ error: "Failed to delete journal" });
  }
};

// 📊 Get journal statistics
export const getJournalStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total entries
    const totalEntries = await Journal.countDocuments({ userId });
    
    // Get total words
    const journals = await Journal.find({ userId }, 'content').lean();
    const totalWords = journals.reduce((sum, journal) => {
      return sum + (journal.content ? journal.content.split(' ').length : 0);
    }, 0);
    
    // Get all tags and their counts
    const tagAggregation = await Journal.aggregate([
      { $match: { userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const favoriteTag = tagAggregation.length > 0 ? tagAggregation[0]._id : "";
    
    // Calculate current streak (simplified)
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const yesterdayEnd = new Date(yesterdayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const todayEntries = await Journal.countDocuments({
      userId,
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    const yesterdayEntries = await Journal.countDocuments({
      userId,
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
    });
    
    const currentStreak = todayEntries > 0 ? (yesterdayEntries > 0 ? 2 : 1) : 0;
    
    res.status(200).json({
      totalEntries,
      totalWords,
      favoriteTag,
      currentStreak,
      tagCounts: tagAggregation
    });
  } catch (err) {
    console.error("Error fetching journal stats:", err);
    res.status(500).json({ error: "Failed to fetch journal statistics" });
  }
};

// 🔍 Search journals
export const searchJournals = async (req, res) => {
  const { query, tags, dateFrom, dateTo } = req.query;
  
  try {
    let searchCriteria = { userId: req.user._id };
    
    // Text search
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Tag filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      searchCriteria.tags = { $in: tagArray };
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      searchCriteria.createdAt = {};
      if (dateFrom) searchCriteria.createdAt.$gte = new Date(dateFrom);
      if (dateTo) searchCriteria.createdAt.$lte = new Date(dateTo);
    }
    
    const journals = await Journal.find(searchCriteria)
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json(journals);
  } catch (err) {
    console.error("Error searching journals:", err);
    res.status(500).json({ error: "Failed to search journals" });
  }
};

// 🏷️ Get all unique tags for user
export const getUserTags = async (req, res) => {
  try {
    const tags = await Journal.aggregate([
      { $match: { userId: req.user._id } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json(tags.map(tag => ({ name: tag._id, count: tag.count })));
  } catch (err) {
    console.error("Error fetching user tags:", err);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};
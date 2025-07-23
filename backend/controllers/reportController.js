import User from "../models/User.js";
import MoodLog from "../models/MoodLog.js";
import MissionProgress from "../models/MissionProgress.js";

export const generateUserReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    const moods = await MoodLog.find({ userId });
    const progress = await MissionProgress.findOne({ userId });

    res.status(200).json({
      user,
      moods,
      progress,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

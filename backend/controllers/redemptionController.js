import Redemption from '../models/Redemption.js';
import Wallet from '../models/Wallet.js';
import Reward from '../models/Reward.js'; 
// 🎁 POST /api/rewards/redeem
export const redeemReward = async (req, res) => {
  const userId = req.user._id;
  const { rewardItem, cost } = req.body;

  if (!rewardItem || !cost) {
    return res.status(400).json({ error: 'Missing reward item or cost' });
  }

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < cost) {
      return res.status(400).json({ error: 'Insufficient HealCoins' });
    }

    wallet.balance -= cost;
    await wallet.save();

    const redemption = await Redemption.create({
      userId,
      rewardItem,
      cost,
    });

    res.status(200).json({ message: 'Redemption successful', redemption });
  } catch (err) {
    console.error('Redemption error:', err);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
};

// 📜 GET /api/rewards/history
export const getRedemptionHistory = async (req, res) => {
  try {
    const history = await Redemption.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (err) {
    console.error('Fetch redemption history failed:', err);
    res.status(500).json({ error: 'Could not fetch history' });
  }
};

// ✅ NEW: Admin can create reward item
export const createReward = async (req, res) => {
  try {
    const { name, cost, description } = req.body;
    const reward = await Reward.create({ name, cost, description });
    res.status(201).json(reward);
  } catch (err) {
    console.error("Failed to create reward", err);
    res.status(500).json({ error: "Failed to create reward" });
  }
};

// ✅ NEW: Get all available reward items
export const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (err) {
    console.error("Error fetching rewards", err);
    res.status(500).json({ error: "Failed to load rewards" });
  }
};

// 🗑️ DELETE /api/rewards/:id
export const deleteReward = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Reward.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Reward not found" });
    }

    res.status(200).json({ message: "Reward deleted successfully" });
  } catch (err) {
    console.error("Failed to delete reward:", err);
    res.status(500).json({ error: "Server error deleting reward" });
  }
};
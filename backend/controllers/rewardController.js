import Reward from '../models/Reward.js';

// 🎁 GET /api/rewards
export const getAvailableRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.status(200).json(rewards);
  } catch (err) {
    console.error('Failed to fetch rewards:', err);
    res.status(500).json({ error: 'Server error while fetching rewards' });
  }
};

// ➕ POST /api/rewards (Admin Only)
export const createReward = async (req, res) => {
  const { name, description, cost } = req.body;
  if (!name || !cost) {
    return res.status(400).json({ error: 'Name and cost are required' });
  }

  try {
    const newReward = await Reward.create({ name, description, cost });
    res.status(201).json({ message: 'Reward created', reward: newReward });
  } catch (err) {
    console.error('Create reward failed:', err);
    res.status(500).json({ error: 'Failed to create reward' });
  }
};

// ❌ DELETE /api/rewards/:id (Admin Only)
export const deleteReward = async (req, res) => {
  try {
    const deleted = await Reward.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Reward not found' });

    res.status(200).json({ message: 'Reward deleted' });
  } catch (err) {
    console.error('Delete reward failed:', err);
    res.status(500).json({ error: 'Failed to delete reward' });
  }
};

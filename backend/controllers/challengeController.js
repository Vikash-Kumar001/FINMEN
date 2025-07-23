import Challenge from '../models/Challenge.js';
import ChallengeProgress from '../models/ChallengeProgress.js';

// 📥 GET /api/challenges
export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    res.status(200).json(challenges);
  } catch (err) {
    console.error('❌ Failed to fetch challenges:', err);
    res.status(500).json({ error: 'Server error while fetching challenges' });
  }
};

// 📥 GET /api/challenges/active
export const getActiveChallenges = async (req, res) => {
  try {
    const today = new Date();
    const challenges = await Challenge.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    });
    res.status(200).json(challenges);
  } catch (err) {
    console.error('❌ Failed to fetch active challenges:', err);
    res.status(500).json({ error: 'Server error while fetching active challenges' });
  }
};

// 📥 GET /api/challenges/:id
export const getChallengeById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.status(200).json(challenge);
  } catch (err) {
    console.error('❌ Failed to fetch challenge:', err);
    res.status(500).json({ error: 'Server error while fetching challenge' });
  }
};

// ✅ POST /api/challenges/start/:challengeId
export const startChallenge = async (req, res) => {
  const userId = req.user?._id;
  const { challengeId } = req.params;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    let progress = await ChallengeProgress.findOne({ 
      userId,
      challengeId
    });

    if (progress) {
      return res.status(400).json({ error: 'Challenge already started' });
    }

    // Create new progress record
    progress = await ChallengeProgress.create({
      userId,
      challengeId,
      currentStep: 0,
      startedAt: new Date(),
      completedSteps: [],
      isCompleted: false
    });

    res.status(200).json({
      message: '🎉 Challenge started!',
      progress
    });
  } catch (err) {
    console.error('❌ Challenge start error:', err);
    res.status(500).json({ error: 'Failed to start challenge' });
  }
};

// ✅ POST /api/challenges/progress/:challengeId
export const updateChallengeProgress = async (req, res) => {
  const userId = req.user?._id;
  const { challengeId } = req.params;
  const { stepCompleted } = req.body;

  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    let progress = await ChallengeProgress.findOne({ 
      userId,
      challengeId
    });

    if (!progress) {
      return res.status(404).json({ error: 'Challenge not started yet' });
    }

    // Check if step is already completed
    if (progress.completedSteps.includes(stepCompleted)) {
      return res.status(400).json({ error: 'Step already completed' });
    }

    // Update progress
    progress.completedSteps.push(stepCompleted);
    progress.currentStep = progress.completedSteps.length;
    
    // Check if all steps are completed
    if (progress.currentStep >= challenge.completionSteps) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    await progress.save();

    // If challenge is completed, update user XP and coins
    if (progress.isCompleted) {
      // Update user stats (this would typically be handled by a user service)
      // For now, we'll just return the rewards info
      res.status(200).json({
        message: '🎉 Challenge completed!',
        progress,
        rewards: {
          xp: challenge.xpReward,
          coins: challenge.coinReward
        }
      });
    } else {
      res.status(200).json({
        message: '👍 Progress updated!',
        progress
      });
    }
  } catch (err) {
    console.error('❌ Challenge progress update error:', err);
    res.status(500).json({ error: 'Failed to update challenge progress' });
  }
};

// 📊 GET /api/challenges/progress
export const getUserChallengeProgress = async (req, res) => {
  const userId = req.user?._id;
  
  try {
    const progress = await ChallengeProgress.find({ userId })
      .populate('challengeId');

    res.status(200).json(progress || []);
  } catch (err) {
    console.error('❌ Challenge progress fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch challenge progress' });
  }
};

// 📊 GET /api/challenges/progress/:challengeId
export const getUserChallengeProgressById = async (req, res) => {
  const userId = req.user?._id;
  const { challengeId } = req.params;
  
  try {
    const progress = await ChallengeProgress.findOne({ 
      userId,
      challengeId
    }).populate('challengeId');

    if (!progress) {
      return res.status(404).json({ error: 'Challenge progress not found' });
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error('❌ Challenge progress fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch challenge progress' });
  }
};
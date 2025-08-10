import Challenge from '../models/Challenge.js';
import ChallengeProgress from '../models/ChallengeProgress.js';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { addXP } from './userProgressController.js';

// Helper function to generate a random daily challenge
const generateDailyChallenge = async (userId) => {
  try {
    // Get the current date at midnight (to ensure consistent daily challenges)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if a daily challenge already exists for today
    const existingChallenge = await Challenge.findOne({
      title: { $regex: `Daily Challenge - ${today.toISOString().split('T')[0]}` },
      category: 'daily'
    });
    
    if (existingChallenge) {
      return existingChallenge;
    }
    
    // Create a new daily challenge
    const dailyChallenge = new Challenge({
      title: `Daily Challenge - ${today.toISOString().split('T')[0]}`,
      description: 'Complete this daily challenge to earn rewards!',
      category: 'daily',
      difficulty: 'Easy',
      xpReward: 25,
      coinReward: 15,
      estimatedTime: '5-10 minutes',
      completionSteps: 1,
      benefits: ['Improve financial discipline', 'Build daily habits'],
      startDate: today,
      endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
      isActive: true,
      iconName: 'Calendar',
      gradientColors: 'from-green-400 to-emerald-500'
    });
    
    await dailyChallenge.save();
    return dailyChallenge;
  } catch (error) {
    console.error('Error generating daily challenge:', error);
    throw error;
  }
};

// Helper function to generate a weekly challenge
const generateWeeklyChallenge = async () => {
  try {
    // Get the current week start (Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Check if a weekly challenge already exists for this week
    const existingChallenge = await Challenge.findOne({
      title: { $regex: `Weekly Challenge - Week ${getWeekNumber(today)}` },
      category: 'weekly'
    });
    
    if (existingChallenge) {
      return existingChallenge;
    }
    
    // Create a new weekly challenge
    const weeklyChallenge = new Challenge({
      title: `Weekly Challenge - Week ${getWeekNumber(today)}`,
      description: 'Complete this weekly challenge to earn bigger rewards!',
      category: 'weekly',
      difficulty: 'Medium',
      xpReward: 100,
      coinReward: 50,
      estimatedTime: '30 minutes',
      completionSteps: 3,
      benefits: ['Build financial discipline', 'Develop long-term habits', 'Earn bonus rewards'],
      startDate: startOfWeek,
      endDate: new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from start of week
      isActive: true,
      iconName: 'Trophy',
      gradientColors: 'from-purple-500 to-indigo-600'
    });
    
    await weeklyChallenge.save();
    return weeklyChallenge;
  } catch (error) {
    console.error('Error generating weekly challenge:', error);
    throw error;
  }
};

// Helper function to get the week number of the year
const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Get the current daily challenge for the user
export const getDailyChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Generate or get the daily challenge
    const dailyChallenge = await generateDailyChallenge(userId);
    
    // Check if the user has already started this challenge
    let progress = await ChallengeProgress.findOne({
      userId,
      challengeId: dailyChallenge._id
    });
    
    // If not, create a new progress entry
    if (!progress) {
      progress = new ChallengeProgress({
        userId,
        challengeId: dailyChallenge._id,
        currentStep: 0,
        completedSteps: [],
        startedAt: new Date(),
        isCompleted: false
      });
      await progress.save();
    }
    
    res.status(200).json({
      challenge: dailyChallenge,
      progress
    });
  } catch (error) {
    console.error('Error getting daily challenge:', error);
    res.status(500).json({ error: 'Failed to get daily challenge' });
  }
};

// Get 10 unique daily challenges for the user
export const getDailyChallenges = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create a field on the user to track completed challenge IDs
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.completedChallengeIds) user.completedChallengeIds = [];
    if (!user.dailyChallengeHistory) user.dailyChallengeHistory = {};

    // If all 1000 are completed, reset
    const totalChallenges = await Challenge.countDocuments();
    if (user.completedChallengeIds.length >= totalChallenges) {
      user.completedChallengeIds = [];
    }

    // Check if today's challenges are already set
    const todayKey = today.toISOString().split('T')[0];
    let todaysChallengeIds = user.dailyChallengeHistory[todayKey];
    if (!todaysChallengeIds) {
      // Get all challenge IDs not yet completed
      const allIds = (await Challenge.find({}, '_id')).map(c => c._id.toString());
      const availableIds = allIds.filter(id => !user.completedChallengeIds.includes(id));
      // Shuffle and pick 10
      for (let i = availableIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableIds[i], availableIds[j]] = [availableIds[j], availableIds[i]];
      }
      todaysChallengeIds = availableIds.slice(0, 10);
      user.dailyChallengeHistory[todayKey] = todaysChallengeIds;
      await user.save();
    }

    // Fetch the 10 challenges
    const challenges = await Challenge.find({ _id: { $in: todaysChallengeIds } });

    // Get progress for each challenge
    const progresses = await ChallengeProgress.find({
      userId,
      challengeId: { $in: todaysChallengeIds }
    });
    const progressMap = {};
    progresses.forEach(p => { progressMap[p.challengeId.toString()] = p; });

    res.status(200).json({
      challenges: challenges.map(ch => ({
        challenge: ch,
        progress: progressMap[ch._id.toString()] || null
      }))
    });
  } catch (error) {
    console.error('Error getting daily challenges:', error);
    res.status(500).json({ error: 'Failed to get daily challenges' });
  }
};

// Get the current weekly challenge for the user
export const getWeeklyChallenge = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Generate or get the weekly challenge
    const weeklyChallenge = await generateWeeklyChallenge();
    
    // Check if the user has already started this challenge
    let progress = await ChallengeProgress.findOne({
      userId,
      challengeId: weeklyChallenge._id
    });
    
    // If not, create a new progress entry
    if (!progress) {
      progress = new ChallengeProgress({
        userId,
        challengeId: weeklyChallenge._id,
        currentStep: 0,
        completedSteps: [],
        startedAt: new Date(),
        isCompleted: false
      });
      await progress.save();
    }
    
    res.status(200).json({
      challenge: weeklyChallenge,
      progress
    });
  } catch (error) {
    console.error('Error getting weekly challenge:', error);
    res.status(500).json({ error: 'Failed to get weekly challenge' });
  }
};

// Update progress for a daily or weekly challenge
export const updateChallengeProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { challengeId } = req.params;
    const { step } = req.body;
    
    // Find the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Find the user's progress for this challenge
    let progress = await ChallengeProgress.findOne({ userId, challengeId });
    
    if (!progress) {
      return res.status(404).json({ error: 'Challenge progress not found' });
    }
    
    // Check if the challenge is already completed
    if (progress.isCompleted) {
      return res.status(400).json({ error: 'Challenge already completed' });
    }
    
    // Check if the step is already completed
    if (progress.completedSteps.includes(step)) {
      return res.status(400).json({ error: 'Step already completed' });
    }
    
    // Update the progress
    progress.completedSteps.push(step);
    progress.currentStep = Math.max(progress.currentStep, step);
    
    // Check if all steps are completed
    if (progress.completedSteps.length >= challenge.completionSteps) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      
      // Award XP and coins
      const xpResult = await addXP(req.user._id, challenge.xpReward);
      
      // Add coins to wallet
      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = new Wallet({ userId, balance: 0 });
      }
      
      wallet.balance += challenge.coinReward;
      wallet.totalEarned += challenge.coinReward;
      await wallet.save();
      
      // Record the transaction
      const transaction = new Transaction({
        userId,
        amount: challenge.coinReward,
        type: 'credit',
        description: `Completed ${challenge.category} challenge: ${challenge.title}`,
        status: 'completed'
      });
      await transaction.save();

      // Mark challenge as completed for this user to avoid repeats
      const user = await User.findById(userId);
      if (user) {
        if (!user.completedChallengeIds) user.completedChallengeIds = [];
        if (!user.completedChallengeIds.includes(challengeId.toString())) {
          user.completedChallengeIds.push(challengeId.toString());
          await user.save();
        }
      }
      
      // Emit socket event for real-time updates
      const io = req.app.get('io');
      if (io) {
        io.to(userId.toString()).emit('challenge-completed', {
          challenge,
          rewards: {
            xp: challenge.xpReward,
            coins: challenge.coinReward,
            levelUp: xpResult.levelUp
          }
        });
      }
    }
    
    await progress.save();
    
    res.status(200).json({
      progress,
      isCompleted: progress.isCompleted,
      rewards: progress.isCompleted ? {
        xp: challenge.xpReward,
        coins: challenge.coinReward
      } : null
    });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ error: 'Failed to update challenge progress' });
  }
};

// Get all active challenges (daily and weekly) for the user
export const getActiveChallenges = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Generate or get the daily and weekly challenges
    const dailyChallenge = await generateDailyChallenge();
    const weeklyChallenge = await generateWeeklyChallenge();
    
    // Get the user's progress for these challenges
    const dailyProgress = await ChallengeProgress.findOne({
      userId,
      challengeId: dailyChallenge._id
    }) || {
      currentStep: 0,
      completedSteps: [],
      isCompleted: false
    };
    
    const weeklyProgress = await ChallengeProgress.findOne({
      userId,
      challengeId: weeklyChallenge._id
    }) || {
      currentStep: 0,
      completedSteps: [],
      isCompleted: false
    };
    
    res.status(200).json({
      daily: {
        challenge: dailyChallenge,
        progress: dailyProgress
      },
      weekly: {
        challenge: weeklyChallenge,
        progress: weeklyProgress
      }
    });
  } catch (error) {
    console.error('Error getting active challenges:', error);
    res.status(500).json({ error: 'Failed to get active challenges' });
  }
};
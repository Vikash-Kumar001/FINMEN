import User from '../models/User.js';
import FinancialMission from '../models/FinancialMission.js';
import Challenge from '../models/Challenge.js';
import ActivityLog from '../models/ActivityLog.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

/**
 * Socket handler for game-related real-time interactions
 * Enables students to interact with missions, challenges, and leaderboards
 */
export const setupGameSocket = (io, socket, user) => {
  // Student subscribe to missions
  socket.on('student:missions:subscribe', async ({ studentId, level }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:missions:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`🎮 Student ${studentId} subscribed to missions for level ${level}`);
      
      // Join student-specific room for missions
      socket.join(`student-missions-${studentId}`);
      
      // Get missions for the specified level
      const missions = await FinancialMission.find({ level, userRole: 'student' })
        .sort({ createdAt: 1 });
      
      // Get student's completed missions
      const student = await User.findById(studentId).select('completedMissions');
      const completedMissions = student?.completedMissions || [];
      
      // Mark missions as completed if they are in the student's completedMissions array
      const missionsWithStatus = missions.map(mission => ({
        _id: mission._id,
        title: mission.title,
        description: mission.description,
        level: mission.level,
        order: mission.createdAt, // Using createdAt as order
        xpReward: mission.xp,
        coinReward: mission.rewardCoins,
        type: mission.userRole,
        requirements: mission.department,
        completed: completedMissions.includes(mission._id.toString())
      }));
      
      socket.emit('student:missions:data', missionsWithStatus);
      
    } catch (err) {
      console.error('Error in student:missions:subscribe:', err);
      socket.emit('student:missions:error', { message: err.message });
    }
  });

  // Student complete mission
  socket.on('student:missions:complete', async ({ studentId, missionId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:missions:error', { message: 'Unauthorized access' });
        return;
      }

      // Find the mission
      const mission = await FinancialMission.findById(missionId);
      
      if (!mission) {
        socket.emit('student:missions:error', { message: 'Mission not found' });
        return;
      }

      // Find the student
      const student = await User.findById(studentId);
      
      if (!student) {
        socket.emit('student:missions:error', { message: 'Student not found' });
        return;
      }

      // Check if mission is already completed
      if (student.completedMissions && student.completedMissions.includes(missionId)) {
        socket.emit('student:missions:error', { message: 'Mission already completed' });
        return;
      }

      // Add mission to completed missions
      if (!student.completedMissions) {
        student.completedMissions = [];
      }
      student.completedMissions.push(missionId);

      // Award XP
      student.xp += mission.xp;

      // Save student
      await student.save();

      // Award coins if there's a coin reward
      if (mission.rewardCoins && mission.rewardCoins > 0) {
        let wallet = await Wallet.findOne({ userId: studentId });
        
        if (!wallet) {
          wallet = await Wallet.create({
            userId: studentId,
            balance: 0
          });
        }

        wallet.balance += mission.rewardCoins;
        wallet.lastUpdated = new Date();
        await wallet.save();

        // Create transaction record
        await Transaction.create({
          userId: studentId,
          type: 'reward',
          amount: mission.rewardCoins,
          description: `Reward for completing mission: ${mission.title}`,
          status: 'completed'
        });

        // Notify student about the coin reward
        socket.emit('student:wallet:update', { 
          balance: wallet.balance,
          message: `You received ${mission.rewardCoins} coins for completing the mission!`
        });
      }

      // Log activity
      await ActivityLog.create({
        userId: studentId,
        activityType: 'mission_completed',
        details: {
          missionId,
          missionTitle: mission.title,
          xpReward: mission.xp,
          coinReward: mission.rewardCoins
        },
        timestamp: new Date()
      });

      // Get updated missions for the level
      const missions = await FinancialMission.find({ level: mission.level, userRole: 'student' })
        .sort({ createdAt: 1 });
      
      // Mark missions as completed if they are in the student's completedMissions array
      const missionsWithStatus = missions.map(m => ({
        _id: m._id,
        title: m.title,
        description: m.description,
        level: m.level,
        order: m.createdAt,
        xpReward: m.xp,
        coinReward: m.rewardCoins,
        type: m.userRole,
        requirements: m.department,
        completed: student.completedMissions.includes(m._id.toString())
      }));

      socket.emit('student:missions:data', missionsWithStatus);
      socket.emit('student:missions:complete:success', { 
        message: `Mission completed! You earned ${mission.xp} XP${mission.rewardCoins ? ` and ${mission.rewardCoins} coins` : ''}`,
        mission: {
          _id: mission._id,
          title: mission.title,
          xpReward: mission.xp,
          coinReward: mission.rewardCoins
        },
        newXp: student.xp
      });

    } catch (err) {
      console.error('Error in student:missions:complete:', err);
      socket.emit('student:missions:error', { message: err.message });
    }
  });

  // Student subscribe to challenges
  socket.on('student:challenges:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId || user.role !== 'student') {
        socket.emit('student:challenges:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`🏆 Student ${studentId} subscribed to challenges`);
      
      // Join student-specific room for challenges
      socket.join(`student-challenges-${studentId}`);
      
      // Get active challenges
      const now = new Date();
      const challenges = await Challenge.find({
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).sort({ endDate: 1 });
      
      // Get student's challenge progress
      const student = await User.findById(studentId).select('challengeProgress');
      const challengeProgress = student?.challengeProgress || {};
      
      // Add progress information to challenges
      const challengesWithProgress = challenges.map(challenge => {
        const progress = challengeProgress[challenge._id] || 0;
        const isCompleted = progress >= challenge.targetValue;
        
        return {
          _id: challenge._id,
          title: challenge.title,
          description: challenge.description,
          type: challenge.type,
          targetValue: challenge.targetValue,
          xpReward: challenge.xpReward,
          coinReward: challenge.coinReward,
          startDate: challenge.startDate,
          endDate: challenge.endDate,
          progress,
          isCompleted
        };
      });
      
      socket.emit('student:challenges:data', challengesWithProgress);
      
    } catch (err) {
      console.error('Error in student:challenges:subscribe:', err);
      socket.emit('student:challenges:error', { message: err.message });
    }
  });

  // Student subscribe to leaderboard
  socket.on('student:leaderboard:subscribe', async ({ period }) => {
    try {
      // Validate period
      if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
        socket.emit('student:leaderboard:error', { message: 'Invalid period' });
        return;
      }

      console.log(`🏆 User ${user._id} subscribed to ${period} leaderboard`);
      
      // Join leaderboard room
      socket.join(`leaderboard-${period}`);
      
      // Calculate date range based on period
      const now = new Date();
      let startDate;
      
      switch(period) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'allTime':
          startDate = new Date(0); // Beginning of time
          break;
      }
      
      // Get top students by XP
      let leaderboardQuery = { role: 'student' };
      
      // For time-based leaderboards, use activity logs to calculate XP gained in the period
      if (period !== 'allTime') {
        // This is a simplified approach. In a real implementation, you would track XP changes over time
        // and calculate the leaderboard based on XP gained during the specific period.
        // For now, we'll just use the total XP as a placeholder.
      }
      
      const topStudents = await User.find(leaderboardQuery)
        .select('_id name xp class')
        .sort({ xp: -1 })
        .limit(20);
      
      // Format leaderboard data
      const leaderboard = topStudents.map((student, index) => ({
        rank: index + 1,
        _id: student._id,
        name: student.name,
        xp: student.xp,
        class: student.class,
        isCurrentUser: student._id.toString() === user._id.toString()
      }));
      
      socket.emit('student:leaderboard:data', {
        period,
        leaderboard
      });
      
    } catch (err) {
      console.error('Error in student:leaderboard:subscribe:', err);
      socket.emit('student:leaderboard:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all game-related rooms
    if (user.role === 'student') {
      socket.leave(`student-missions-${user._id}`);
      socket.leave(`student-challenges-${user._id}`);
      
      // Leave leaderboard rooms
      ['daily', 'weekly', 'monthly', 'allTime'].forEach(period => {
        socket.leave(`leaderboard-${period}`);
      });
    }
  });
};
import User from '../models/User.js';
import FinancialMission from '../models/FinancialMission.js';
import ActivityLog from '../models/ActivityLog.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import UserProgress from '../models/UserProgress.js';

/**
 * Socket handler for game-related real-time interactions
 * Enables students to interact with missions and leaderboards
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


  // Student subscribe to leaderboard
  socket.on('student:leaderboard:subscribe', async ({ period }) => {
    try {
      // Validate period
      if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
        socket.emit('student:leaderboard:error', { message: 'Invalid period' });
        return;
      }

      console.log(`🏆 User ${user._id} subscribed to ${period} leaderboard`);
      socket.join(`leaderboard-${period}`);

      // Fetch leaderboard data from UserProgress
      const top = await UserProgress.find()
        .sort({ xp: -1 })
        .limit(20)
        .populate('userId', 'name username email fullName avatar');

      // Filter out entries with null/invalid userId
      const validTop = top.filter(entry => entry.userId && entry.userId._id);

      const leaderboard = validTop.map((entry, index) => {
        const userData = entry.userId;
        
        // Better fallback strategy for name
        let displayName = userData.name;
        if (!displayName || displayName.trim() === '') {
          displayName = userData.fullName;
        }
        if (!displayName || displayName.trim() === '') {
          displayName = userData.username;
        }
        if (!displayName || displayName.trim() === '') {
          displayName = userData.email ? userData.email.split('@')[0] : 'User';
        }

        // Better fallback for username
        let displayUsername = userData.username;
        if (!displayUsername || displayUsername.trim() === '') {
          displayUsername = userData.email ? userData.email.split('@')[0] : 'user';
        }

        return {
          rank: index + 1,
          _id: userData._id,
          name: displayName,
          username: displayUsername,
          avatar: userData.avatar,
          xp: entry.xp || 0,
          level: Math.floor((entry.xp || 0) / 100) + 1,
          isCurrentUser: userData._id?.toString() === user._id.toString()
        };
      });

      socket.emit('student:leaderboard:data', {
        period,
        leaderboard
      });

    } catch (err) {
      console.error('Error in student:leaderboard:subscribe:', err);
      socket.emit('student:leaderboard:error', { message: err.message });
    }
  });

  // Broadcast leaderboard updates when XP changes
  const broadcastLeaderboardUpdate = async () => {
    try {
      const top = await UserProgress.find()
        .sort({ xp: -1 })
        .limit(20)
        .populate('userId', 'name username email fullName avatar');

      // Filter out entries with null/invalid userId
      const validTop = top.filter(entry => entry.userId && entry.userId._id);

      const leaderboard = validTop.map((entry, index) => {
        const userData = entry.userId;
        
        // Better fallback strategy for name
        let displayName = userData.name;
        if (!displayName || displayName.trim() === '') {
          displayName = userData.fullName;
        }
        if (!displayName || displayName.trim() === '') {
          displayName = userData.username;
        }
        if (!displayName || displayName.trim() === '') {
          displayName = userData.email ? userData.email.split('@')[0] : 'User';
        }

        return {
          rank: index + 1,
          _id: userData._id,
          name: displayName,
          avatar: userData.avatar,
          xp: entry.xp || 0,
          level: Math.floor((entry.xp || 0) / 100) + 1
        };
      });

      // Broadcast to all leaderboard subscribers
      ['daily', 'weekly', 'monthly', 'allTime'].forEach(period => {
        io.to(`leaderboard-${period}`).emit('student:leaderboard:data', {
          period,
          leaderboard
        });
      });
    } catch (err) {
      console.error('Error broadcasting leaderboard update:', err);
    }
  };

  // Listen for XP updates to refresh leaderboard
  socket.on('xp-updated', broadcastLeaderboardUpdate);

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    // Leave all game-related rooms
    if (user.role === 'student') {
      socket.leave(`student-missions-${user._id}`);
      
      // Leave leaderboard rooms
      ['daily', 'weekly', 'monthly', 'allTime'].forEach(period => {
        socket.leave(`leaderboard-${period}`);
      });
    }
  });
};
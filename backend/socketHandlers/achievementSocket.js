import UnifiedGameProgress from '../models/UnifiedGameProgress.js';

/**
 * Socket handler for achievement real-time interactions
 * Enables students to receive real-time achievement updates
 */
export const setupAchievementSocket = (io, socket, user) => {
  // Student subscribe to achievements
  socket.on('student:achievements:subscribe', async ({ studentId }) => {
    try {
      // Verify student permissions
      if (user._id.toString() !== studentId) {
        socket.emit('student:achievements:error', { message: 'Unauthorized access' });
        return;
      }

      console.log(`🏆 Student ${studentId} subscribed to achievement updates`);
      
      // Join student-specific room for achievement updates
      socket.join(`student-achievements-${studentId}`);
      
      // Send initial achievement timeline
      const gameProgress = await UnifiedGameProgress.find({ userId: studentId });

      const achievements = [];
      gameProgress.forEach(game => {
        if (game.achievements && game.achievements.length > 0) {
          game.achievements.forEach(achievement => {
            achievements.push({
              id: achievement._id,
              name: achievement.name,
              description: achievement.description,
              badge: achievement.badge || 'bronze',
              earnedAt: achievement.earnedAt || new Date(),
              gameId: game.gameId,
              gameType: game.gameType
            });
          });
        }
      });

      // Sort by date (most recent first)
      achievements.sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

      socket.emit('student:achievements:timeline', {
        achievements: achievements.slice(0, 10), // Return last 10 achievements
        totalAchievements: achievements.length
      });
      
    } catch (err) {
      console.error('❌ Error in student:achievements:subscribe:', err);
      socket.emit('student:achievements:error', { message: err.message });
    }
  });

  // Cleanup when socket disconnects
  socket.on('disconnect', () => {
    if (user.role === 'student') {
      socket.leave(`student-achievements-${user._id}`);
    }
  });
};

/**
 * Helper function to emit achievement earned event
 * Called from game controllers when achievements are earned
 */
export const emitAchievementEarned = (io, userId, achievement, gameInfo = {}) => {
  const achievementData = {
    userId: userId.toString(),
    achievement: {
      id: achievement._id || achievement.id,
      name: achievement.name,
      description: achievement.description,
      badge: achievement.badge || 'bronze',
      earnedAt: achievement.earnedAt || new Date(),
      gameId: gameInfo.gameId || null,
      gameType: gameInfo.gameType || null
    },
    timestamp: new Date()
  };

  // Emit to the specific user's room
  io.to(`student-achievements-${userId}`).emit('achievement:earned', achievementData);
  
  // Also emit to the user's general room for dashboard updates
  io.to(userId.toString()).emit('achievement:earned', achievementData);
  
  console.log(`🎉 Achievement earned event emitted for user ${userId}: ${achievement.name}`);
};


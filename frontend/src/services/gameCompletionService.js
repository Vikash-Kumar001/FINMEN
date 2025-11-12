import api from '../utils/api';
import { toast } from 'react-toastify';

/**
 * Unified Game Completion Service
 * Handles heal coins for all game types with duplicate prevention
 */

class GameCompletionService {
  constructor() {
    this.completedGames = new Map(); // Cache for completed games
  }

  /**
   * Complete a game or game level and award heal coins
   * @param {Object} gameData - Game completion data
   * @param {string} gameData.gameId - Unique game identifier (e.g., 'spot-the-pattern', 'cat-or-dog')
   * @param {string} gameData.gameType - Game category ('ai', 'brain', 'finance', 'mental', 'financial')
   * @param {number} gameData.score - Current score/points earned
   * @param {number} gameData.maxScore - Maximum possible score for the game
   * @param {number} gameData.levelsCompleted - Number of levels/questions completed
   * @param {number} gameData.totalLevels - Total levels/questions in the game
   * @param {number} gameData.timePlayed - Time played in seconds
   * @param {Array} gameData.achievements - Any achievements unlocked
   * @param {boolean} gameData.isFullCompletion - Whether user completed entire game
   * @param {number} gameData.coinsPerLevel - Heal coins per level/question (optional)
   * @returns {Promise<Object>} - Completion result with coins earned
   */
  async completeGame(gameData) {
    try {
      const {
        gameId,
        gameType = 'ai',
        score = 0,
        maxScore = 100,
        levelsCompleted = 1,
        totalLevels = 1,
        timePlayed = 0,
        achievements = [],
        isFullCompletion = true,
        coinsPerLevel = null
      } = gameData;

      // Validate required data
      if (!gameId) {
        throw new Error('Game ID is required');
      }

      // Get current completion status from backend
      const progressResponse = await api.get(`/api/game/progress/${gameId}`);
      const currentProgress = progressResponse.data || {
        levelsCompleted: 0,
        totalCoinsEarned: 0,
        fullyCompleted: false,
        replayUnlocked: false
      };

      // Check if this is a replay attempt
      const isReplayAttempt = gameData.isReplay === true || (currentProgress.fullyCompleted && currentProgress.replayUnlocked === true);

      // Calculate new levels completed (only count new ones)
      const newLevelsCompleted = Math.max(0, levelsCompleted - currentProgress.levelsCompleted);
      
      // If no new progress and not a replay, don't award coins but allow replay
      if (newLevelsCompleted === 0 && !currentProgress.fullyCompleted && isFullCompletion && !isReplayAttempt) {
        // Mark as fully completed for first time
        await this.updateGameProgress(gameId, {
          ...gameData,
          levelsCompleted: currentProgress.levelsCompleted,
          newCoinsEarned: 0,
          isProgressUpdate: true
        });
        
        return {
          success: true,
          coinsEarned: 0,
          totalCoinsEarned: currentProgress.totalCoinsEarned,
          newLevelsCompleted: 0,
          canReplay: true,
          message: 'Game completed! You can replay for fun, but no additional coins.'
        };
      }

      // If game is fully completed and it's NOT a replay attempt, return early
      // BUT if it IS a replay attempt, we MUST call the backend to lock it again
      if (newLevelsCompleted === 0 && currentProgress.fullyCompleted && !isReplayAttempt) {
        return {
          success: true,
          coinsEarned: 0,
          totalCoinsEarned: currentProgress.totalCoinsEarned,
          newLevelsCompleted: 0,
          canReplay: true,
          message: 'Thanks for playing again! You already earned coins for this game.'
        };
      }

      // Send completion data to backend
      // IMPORTANT: For replay attempts, we MUST call the backend to lock the game again
      console.log('📤 Sending game completion to backend:', {
        gameId,
        isReplayAttempt: isReplayAttempt,
        isReplayFlag: gameData.isReplay,
        currentReplayUnlocked: currentProgress.replayUnlocked,
        fullyCompleted: currentProgress.fullyCompleted
      });
      
      const response = await api.post(`/api/game/complete-unified/${gameId}`, {
        gameType,
        score,
        maxScore,
        levelsCompleted,
        totalLevels,
        newLevelsCompleted,
        timePlayed,
        achievements,
        isFullCompletion,
        coinsPerLevel,
        previousProgress: currentProgress,
        isReplay: isReplayAttempt // Use the computed isReplayAttempt value, not gameData.isReplay
      });

      const result = response.data;

      // Update local cache
      this.completedGames.set(gameId, {
        levelsCompleted: result.totalLevelsCompleted,
        fullyCompleted: result.fullyCompleted,
        totalCoinsEarned: result.totalCoinsEarned,
        lastCompletedAt: new Date(),
        replayUnlocked: result.replayUnlocked !== undefined ? result.replayUnlocked : false
      });

      // Show success notification
      if (result.coinsEarned > 0) {
        toast.success(`🎮 +${result.coinsEarned} HealCoins earned!`);
      } else if (result.isReplay) {
        // Show message for replay completion
        toast.success(result.message || 'Game replayed! Pay 10 HealCoins to unlock replay again.', {
          duration: 4000
        });
      }

      return {
        success: true,
        coinsEarned: result.coinsEarned,
        totalCoinsEarned: result.totalCoinsEarned,
        newLevelsCompleted: result.newLevelsCompleted,
        totalLevelsCompleted: result.totalLevelsCompleted,
        newBalance: result.newBalance,
        streak: result.streak || 1,
        achievements: result.achievements || [],
        canReplay: result.replayUnlocked !== undefined ? result.replayUnlocked : false,
        isReplay: result.isReplay || false,
        replayUnlocked: result.replayUnlocked !== undefined ? result.replayUnlocked : false,
        message: result.message || 'Game completed successfully!'
      };

    } catch (error) {
      console.error('❌ Game completion error:', error);
      toast.error(error.response?.data?.error || 'Failed to save game progress');
      
      return {
        success: false,
        error: error.message,
        coinsEarned: 0
      };
    }
  }

  /**
   * Update game progress without awarding new coins
   */
  async updateGameProgress(gameId, progressData) {
    try {
      await api.put(`/api/game/progress/${gameId}`, progressData);
    } catch (error) {
      console.error('❌ Failed to update game progress:', error);
    }
  }

  /**
   * Get current game progress
   */
  async getGameProgress(gameId) {
    try {
      const response = await api.get(`/api/game/progress/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get game progress:', error);
      return null;
    }
  }

  /**
   * Get all completed games for current user
   */
  async getCompletedGames() {
    try {
      const response = await api.get('/api/game/completed-games');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get completed games:', error);
      return [];
    }
  }

  /**
   * Check if a specific game has been completed
   */
  async isGameCompleted(gameId) {
    try {
      const progress = await this.getGameProgress(gameId);
      return progress?.fullyCompleted || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Complete individual level/question within a game
   * Useful for games with multiple questions
   */
  async completeLevel(gameId, levelData) {
    const {
      levelNumber,
      levelScore,
      maxLevelScore,
      coinsForLevel = 5
    } = levelData;

    return this.completeGame({
      gameId,
      score: levelScore,
      maxScore: maxLevelScore,
      levelsCompleted: levelNumber,
      totalLevels: levelNumber, // Will be updated when full game is complete
      isFullCompletion: false,
      coinsPerLevel: coinsForLevel
    });
  }

  /**
   * Mark game as fully completed
   */
  async markGameFullyCompleted(gameId, finalData = {}) {
    return this.completeGame({
      ...finalData,
      gameId,
      isFullCompletion: true
    });
  }
}

// Create singleton instance
const gameCompletionService = new GameCompletionService();

// Export both the class and instance
export { GameCompletionService };
export default gameCompletionService;
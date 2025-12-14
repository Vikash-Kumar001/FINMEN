/**
 * Simple in-memory cache for leaderboard position tracking
 * Tracks previous positions to calculate position changes
 * Note: For multi-server deployments, this should be replaced with Redis
 */

class LeaderboardCache {
  constructor() {
    // Store previous leaderboard state: { period: { userId: previousRank } }
    this.previousPositions = new Map();
    // Cache TTL: 5 minutes
    this.cacheTTL = 5 * 60 * 1000;
    // Last update timestamps
    this.lastUpdate = new Map();
  }

  /**
   * Get previous rank for a user in a specific period
   * @param {string} period - Period key (daily, weekly, monthly, allTime)
   * @param {string} userId - User ID
   * @returns {number|null} Previous rank or null if not found
   */
  getPreviousRank(period, userId) {
    const periodCache = this.previousPositions.get(period);
    if (!periodCache) return null;
    return periodCache.get(userId?.toString()) || null;
  }

  /**
   * Update cache with new leaderboard positions
   * @param {string} period - Period key
   * @param {Array} leaderboard - Current leaderboard array with user objects
   */
  updatePositions(period, leaderboard) {
    const now = Date.now();
    
    // Check if cache is stale
    const lastUpdateTime = this.lastUpdate.get(period);
    if (lastUpdateTime && (now - lastUpdateTime) > this.cacheTTL) {
      // Cache expired, reset it
      this.previousPositions.delete(period);
    }

    // Create or get period cache
    let periodCache = this.previousPositions.get(period);
    if (!periodCache) {
      periodCache = new Map();
      this.previousPositions.set(period, periodCache);
    }

    // Store current positions as previous for next comparison
    const currentPositions = new Map();
    leaderboard.forEach((entry, index) => {
      const userId = entry._id?.toString() || entry.userId?.toString();
      if (userId) {
        currentPositions.set(userId, index + 1);
      }
    });

    // Update previous positions (only if we had previous data, otherwise initialize)
    if (periodCache.size === 0) {
      // First time, just store current positions
      currentPositions.forEach((rank, userId) => {
        periodCache.set(userId, rank);
      });
    } else {
      // Update previous positions with current for next comparison
      currentPositions.forEach((rank, userId) => {
        periodCache.set(userId, rank);
      });
    }

    this.lastUpdate.set(period, now);
  }

  /**
   * Calculate position changes for leaderboard entries
   * @param {string} period - Period key
   * @param {Array} leaderboard - Current leaderboard array
   * @returns {Array} Leaderboard with positionChange field added
   */
  calculatePositionChanges(period, leaderboard) {
    const periodCache = this.previousPositions.get(period);
    if (!periodCache || periodCache.size === 0) {
      // No previous data, return with zero changes
      return leaderboard.map(entry => ({
        ...entry,
        positionChange: 0
      }));
    }

    return leaderboard.map((entry, index) => {
      const userId = entry._id?.toString() || entry.userId?.toString();
      const currentRank = index + 1;
      const previousRank = periodCache.get(userId) || null;

      let positionChange = 0;
      if (previousRank !== null) {
        // Positive means moved up (rank decreased), negative means moved down (rank increased)
        positionChange = previousRank - currentRank;
      }

      return {
        ...entry,
        rank: currentRank,
        positionChange
      };
    });
  }

  /**
   * Clear cache for a specific period
   * @param {string} period - Period key
   */
  clearPeriod(period) {
    this.previousPositions.delete(period);
    this.lastUpdate.delete(period);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.previousPositions.clear();
    this.lastUpdate.clear();
  }

  /**
   * Clean up stale cache entries
   */
  cleanup() {
    const now = Date.now();
    for (const [period, updateTime] of this.lastUpdate.entries()) {
      if (now - updateTime > this.cacheTTL) {
        this.clearPeriod(period);
      }
    }
  }
}

// Singleton instance
const leaderboardCache = new LeaderboardCache();

// Cleanup stale entries every 10 minutes
setInterval(() => {
  leaderboardCache.cleanup();
}, 10 * 60 * 1000);

export default leaderboardCache;


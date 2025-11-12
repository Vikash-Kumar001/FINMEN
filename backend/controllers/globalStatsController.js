import Organization from '../models/Organization.js';
import User from '../models/User.js';

const buildGlobalStats = async () => {
  const [totalSchools, legacyStudents, schoolStudents] = await Promise.all([
    Organization.countDocuments({
      type: 'school',
      isActive: true,
    }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'school_student' }),
  ]);

  return {
    totalSchools,
    totalStudents: legacyStudents + schoolStudents,
    lastUpdated: new Date().toISOString(),
  };
};

// Get global platform statistics
export const getGlobalStats = async (_req, res) => {
  try {
    const stats = await buildGlobalStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: {
        totalSchools: 0,
        totalStudents: 0,
        lastUpdated: new Date().toISOString(),
      },
    });
  }
};

// Get real-time stats with caching (optional optimization)
export const getCachedGlobalStats = async (_req, res) => {
  try {
    const cacheKey = 'global_stats';
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes

    if (global.cache && global.cache[cacheKey]) {
      const cached = global.cache[cacheKey];
      if (Date.now() - cached.timestamp < cacheExpiry) {
        return res.json({
          success: true,
          data: cached.data,
          cached: true,
        });
      }
    }

    const statsData = await buildGlobalStats();

    if (!global.cache) global.cache = {};
    global.cache[cacheKey] = {
      data: statsData,
      timestamp: Date.now(),
    };

    res.json({
      success: true,
      data: statsData,
      cached: false,
    });
  } catch (error) {
    console.error('Error fetching cached global stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      data: {
        totalSchools: 0,
        totalStudents: 0,
        lastUpdated: new Date().toISOString(),
      },
    });
  }
};

import Organization from '../models/Organization.js';
import User from '../models/User.js';
import SchoolStudent from '../models/School/SchoolStudent.js';


// Get global platform statistics
export const getGlobalStats = async (req, res) => {
  try {
    // Get total schools (organizations with type: 'school')
    const totalSchools = await Organization.countDocuments({ 
      type: 'school',
      isActive: true 
    });


    // Get total students - count both legacy 'student' role and 'school_student' role
    const [legacyStudents, schoolStudents, schoolStudentRecords] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'school_student' }),
      SchoolStudent.countDocuments({ isActive: true })
    ]);

    // Total students = legacy students + school students
    const totalStudents = legacyStudents + schoolStudents;

    res.json({
      success: true,
      data: {
        totalSchools,
        totalStudents,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      data: {
        totalSchools: 0,
        totalStudents: 0,
        lastUpdated: new Date().toISOString()
      }
    });
  }
};

// Get real-time stats with caching (optional optimization)
export const getCachedGlobalStats = async (req, res) => {
  try {
    // Simple in-memory cache (in production, use Redis)
    const cacheKey = 'global_stats';
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes
    
    // Check if we have cached data
    if (global.cache && global.cache[cacheKey]) {
      const cached = global.cache[cacheKey];
      if (Date.now() - cached.timestamp < cacheExpiry) {
        return res.json({
          success: true,
          data: cached.data,
          cached: true
        });
      }
    }

    // Fetch fresh data
    const totalSchools = await Organization.countDocuments({ 
      type: 'school',
      isActive: true 
    });

    // Get total students - count both legacy 'student' role and 'school_student' role
    const [legacyStudents, schoolStudents] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'school_student' })
    ]);

    const totalStudents = legacyStudents + schoolStudents;

    const statsData = {
      totalSchools,
      totalStudents,
      lastUpdated: new Date().toISOString()
    };

    // Cache the data
    if (!global.cache) global.cache = {};
    global.cache[cacheKey] = {
      data: statsData,
      timestamp: Date.now()
    };

    res.json({
      success: true,
      data: statsData,
      cached: false
    });
  } catch (error) {
    console.error('Error fetching cached global stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      data: {
        totalSchools: 0,
        totalStudents: 0,
        lastUpdated: new Date().toISOString()
      }
    });
  }
};

import api from "../utils/api";

/**
 * Unified Dashboard API Service
 * Provides centralized API calls for all dashboard types with consistent error handling
 */

// ================== STUDENT DASHBOARD APIs ==================
export const fetchStudentDashboardData = async () => {
  try {
    const [stats, achievements, activities, challenges] = await Promise.all([
      api.get("/api/stats/student"),
      api.get("/api/student/achievements"), 
      api.get("/api/activity/my-activities?limit=5"),
      api.get("/api/daily-challenges")
    ]);

    return {
      stats: stats.data,
      achievements: achievements.data,
      activities: activities.data,
      challenges: challenges.data.challenges || challenges.data
    };
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    throw error;
  }
};

export const fetchStudentStats = async () => {
  try {
    const response = await api.get("/api/stats/student");
    return response.data;
  } catch (error) {
    console.error("Error fetching student stats:", error);
    // Return default stats if API fails
    return {
      xp: 0,
      level: 1,
      nextLevelXp: 100,
      todayMood: "😊",
      streak: 0,
      rank: 0,
      weeklyXP: 0,
      totalActivities: 0,
      completedChallenges: 0
    };
  }
};

export const fetchStudentActivities = async (limit = 10) => {
  try {
    const response = await api.get(`/api/activity/user?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student activities:", error);
    return [];
  }
};

export const fetchStudentChallenges = async () => {
  try {
    const response = await api.get("/api/daily-challenges");
    return response.data.challenges || response.data;
  } catch (error) {
    console.error("Error fetching student challenges:", error);
    return [];
  }
};

// ================== EDUCATOR DASHBOARD APIs ==================
export const fetchEducatorDashboardData = async () => {
  try {
    const [stats, students, analytics, notifications] = await Promise.all([
      api.get("/api/educators/stats"),
      api.get("/api/educators/students"),
      api.get("/api/educators/analytics"), 
      api.get("/api/notifications?role=educator")
    ]);

    return {
      stats: stats.data,
      students: students.data,
      analytics: analytics.data,
      notifications: notifications.data
    };
  } catch (error) {
    console.error("Error fetching educator dashboard data:", error);
    throw error;
  }
};

export const fetchEducatorStats = async () => {
  try {
    const response = await api.get("/api/educators/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching educator stats:", error);
    return {
      totalStudents: 0,
      activeStudents: 0,
      completedActivities: 0,
      averageProgress: 0,
      pendingAssignments: 0,
      recentAlerts: []
    };
  }
};

export const fetchEducatorStudents = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/educators/students?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching educator students:", error);
    return { students: [], total: 0, page: 1, totalPages: 1 };
  }
};

export const fetchEducatorAnalytics = async (timeRange = "week") => {
  try {
    const response = await api.get(`/api/educators/analytics?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching educator analytics:", error);
    return {
      studentEngagement: [],
      progressTrends: [],
      completionRates: [],
      moodTrends: []
    };
  }
};

// ================== ADMIN DASHBOARD APIs ==================
export const fetchAdminDashboardData = async () => {
  try {
    const [stats, analytics, recentActivity, systemHealth] = await Promise.all([
      api.get("/api/admin/stats"),
      api.get("/api/admin/analytics"),
      api.get("/api/activity/summary?days=7"),
      api.get("/api/admin/system-health")
    ]);

    return {
      stats: stats.data,
      analytics: analytics.data,
      recentActivity: recentActivity.data,
      systemHealth: systemHealth.data
    };
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    throw error;
  }
};

export const fetchAdminStats = async () => {
  try {
    const response = await api.get("/api/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalEducators: 0,
      pendingEducators: 0,
      redemptions: 0,
      systemStatus: "Unknown"
    };
  }
};

export const fetchAdminAnalytics = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/admin/analytics?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return {
      userGrowth: [],
      engagementMetrics: [],
      platformActivity: [],
      performanceMetrics: []
    };
  }
};

export const fetchSystemHealth = async () => {
  try {
    const response = await api.get("/api/admin/system-health");
    return response.data;
  } catch (error) {
    console.warn("System health endpoint not available, using mock data:", error.message);
    return {
      status: "Operational",
      uptime: "99.9%",
      responseTime: "245ms",
      memoryUsage: "67%",
      cpuUsage: "23%",
      activeConnections: 145
    };
  }
};

// ================== COMMON APIS ==================
export const fetchNotifications = async (role = null, unreadOnly = false) => {
  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (unreadOnly) params.append('unread', 'true');
    
    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const fetchRecentActivities = async (limit = 10, userId = null) => {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (userId) params.append('userId', userId);
    
    const response = await api.get(`/api/activity/my-activities?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};

// ================== UTILITY FUNCTIONS ==================
export const refreshDashboardData = async (dashboardType) => {
  try {
    switch (dashboardType) {
      case 'student':
        return await fetchStudentDashboardData();
      case 'educator':
        return await fetchEducatorDashboardData();
      case 'admin':
        return await fetchAdminDashboardData();
      default:
        throw new Error(`Unknown dashboard type: ${dashboardType}`);
    }
  } catch (error) {
    console.error(`Error refreshing ${dashboardType} dashboard data:`, error);
    throw error;
  }
};

export const cacheDashboardData = (dashboardType, data) => {
  try {
    const cacheKey = `dashboard_${dashboardType}_${Date.now()}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    
    // Clean old cache entries
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`dashboard_${dashboardType}_`)) {
        const timestamp = parseInt(key.split('_').pop());
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (timestamp < fiveMinutesAgo) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn("Error caching dashboard data:", error);
  }
};

// ================== PROFILE INTEGRATION ==================
export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/api/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/api/user/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const uploadUserAvatar = async (formData) => {
  try {
    const response = await api.post("/api/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading user avatar:", error);
    throw error;
  }
};

export const updateUserPassword = async (passwordData) => {
  try {
    const response = await api.put("/api/user/password", passwordData);
    return response.data;
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};
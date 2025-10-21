const API_BASE_URL = '/api';

export const globalStatsService = {
  // Fetch global statistics
  async getGlobalStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/global/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching global stats:', error);
      // Return fallback data in case of error
      return {
        success: false,
        data: {
          totalSchools: 0,
          totalStudents: 0,
          lastUpdated: new Date().toISOString()
        }
      };
    }
  },

  // Fetch cached global statistics (for better performance)
  async getCachedGlobalStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/global/stats/cached`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Service: Error fetching cached global stats:', error);
      // Return fallback data in case of error
      return {
        success: false,
        data: {
          totalSchools: 0,
          totalStudents: 0,
          lastUpdated: new Date().toISOString()
        }
      };
    }
  }
};

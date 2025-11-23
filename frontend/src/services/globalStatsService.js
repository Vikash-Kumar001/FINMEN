const API_BASE_URL = '/api';

// Helper to create a timeout abort controller
const createTimeoutSignal = (timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  // Clean up timeout if signal is already aborted
  controller.signal.addEventListener('abort', () => clearTimeout(timeoutId));
  return controller;
};

export const globalStatsService = {
  // Fetch global statistics
  async getGlobalStats() {
    const controller = createTimeoutSignal(5000);
    
    try {
      const response = await fetch(`${API_BASE_URL}/global/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - they're expected if backend is not running
      // Only log actual API errors (not network/connection errors)
      if (error.name === 'AbortError') {
        // Timeout - backend might be slow or down
        // Silently return fallback data
      } else if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
        // Only log if it's not a network/connection error
        console.error('Error fetching global stats:', error);
      }
      
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
    const controller = createTimeoutSignal(5000);
    
    try {
      const response = await fetch(`${API_BASE_URL}/global/stats/cached`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Suppress connection errors - they're expected if backend is not running
      // Only log actual API errors (not network/connection errors)
      if (error.name === 'AbortError') {
        // Timeout - backend might be slow or down
        // Silently return fallback data
      } else if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
        // Only log if it's not a network/connection error
        console.error('Service: Error fetching cached global stats:', error);
      }
      
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

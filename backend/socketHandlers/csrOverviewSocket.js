export const setupCSROverviewSocket = (io, socket, user) => {
  console.log(`🔗 Setting up CSR Overview socket for user ${user._id}`);

  // Join CSR overview room
  socket.join('csr-overview');
  
  // Handle real-time data requests
  socket.on('request-csr-overview-data', async (data) => {
    try {
      console.log('📊 CSR Overview data requested:', data);
      
      // Emit real-time metrics
      const realTimeData = {
        type: 'overview-update',
        timestamp: new Date(),
        data: {
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          activeCampaigns: Math.floor(Math.random() * 10) + 5,
          pendingApprovals: Math.floor(Math.random() * 5),
          systemHealth: 'excellent'
        }
      };
      
      socket.emit('csr-overview-update', realTimeData);
    } catch (error) {
      console.error('Error handling CSR overview data request:', error);
      socket.emit('error', { message: 'Failed to fetch CSR overview data' });
    }
  });

  // Handle impact data updates
  socket.on('request-impact-update', async (data) => {
    try {
      const impactData = {
        type: 'impact-update',
        timestamp: new Date(),
        data: {
          studentsImpacted: Math.floor(Math.random() * 1000) + 25000,
          itemsDistributed: Math.floor(Math.random() * 500) + 18000,
          totalValueFunded: Math.floor(Math.random() * 100000) + 4800000,
          schoolsReached: Math.floor(Math.random() * 50) + 340,
          monthlyGrowth: (Math.random() * 10 + 20).toFixed(1)
        }
      };
      
      socket.emit('impact-update', impactData);
    } catch (error) {
      console.error('Error handling impact update request:', error);
      socket.emit('error', { message: 'Failed to fetch impact data' });
    }
  });

  // Handle activity updates
  socket.on('request-activity-update', async (data) => {
    try {
      const activities = [
        { action: 'New campaign launched', location: 'Mumbai High School', time: '2 hours ago', color: 'green' },
        { action: 'Budget approved', location: 'Delhi Public School', time: '4 hours ago', color: 'blue' },
        { action: 'Report generated', location: 'Bangalore International', time: '6 hours ago', color: 'purple' },
        { action: 'Pilot completed', location: 'Chennai Central School', time: '1 day ago', color: 'orange' },
        { action: 'New school onboarded', location: 'Pune Public School', time: '2 days ago', color: 'green' }
      ];
      
      const activityData = {
        type: 'activity-update',
        timestamp: new Date(),
        data: activities.slice(0, Math.floor(Math.random() * 3) + 2)
      };
      
      socket.emit('activity-update', activityData);
    } catch (error) {
      console.error('Error handling activity update request:', error);
      socket.emit('error', { message: 'Failed to fetch activity data' });
    }
  });

  // Handle module progress updates
  socket.on('request-module-progress', async (data) => {
    try {
      const moduleProgress = {
        type: 'module-progress-update',
        timestamp: new Date(),
        data: {
          finance: { 
            progress: Math.floor(Math.random() * 20) + 70, 
            students: Math.floor(Math.random() * 2000) + 18000, 
            completion: Math.floor(Math.random() * 15) + 80
          },
          mental: { 
            progress: Math.floor(Math.random() * 20) + 75, 
            students: Math.floor(Math.random() * 2000) + 20000, 
            completion: Math.floor(Math.random() * 15) + 85
          },
          values: { 
            progress: Math.floor(Math.random() * 20) + 60, 
            students: Math.floor(Math.random() * 2000) + 16000, 
            completion: Math.floor(Math.random() * 15) + 70
          },
          ai: { 
            progress: Math.floor(Math.random() * 20) + 50, 
            students: Math.floor(Math.random() * 2000) + 14000, 
            completion: Math.floor(Math.random() * 15) + 65
          }
        }
      };
      
      socket.emit('module-progress-update', moduleProgress);
    } catch (error) {
      console.error('Error handling module progress request:', error);
      socket.emit('error', { message: 'Failed to fetch module progress data' });
    }
  });

  // Broadcast updates to all CSR users
  const broadcastUpdate = (type, data) => {
    io.to('csr-overview').emit('csr-overview-broadcast', {
      type,
      data,
      timestamp: new Date()
    });
  };

  // Simulate real-time updates every 30 seconds
  const updateInterval = setInterval(() => {
    if (socket.connected) {
      // Randomly update different metrics
      const updateType = Math.random();
      
      if (updateType < 0.3) {
        broadcastUpdate('impact', {
          studentsImpacted: Math.floor(Math.random() * 100) + 25400,
          monthlyGrowth: (Math.random() * 5 + 20).toFixed(1)
        });
      } else if (updateType < 0.6) {
        broadcastUpdate('activity', {
          action: 'System update',
          location: 'Global',
          time: 'Just now',
          color: 'blue'
        });
      } else {
        broadcastUpdate('stats', {
          activeUsers: Math.floor(Math.random() * 100) + 1200,
          systemHealth: 'excellent'
        });
      }
    }
  }, 30000);

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 CSR Overview socket disconnected for user ${user._id}`);
    clearInterval(updateInterval);
  });

  // Send initial data
  socket.emit('csr-overview-connected', {
    message: 'Connected to CSR Overview real-time updates',
    timestamp: new Date()
  });
};

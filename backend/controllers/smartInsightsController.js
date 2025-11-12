import smartInsightsService from '../services/smartInsightsService.js';

// Get smart insights
export const getSmartInsights = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    const data = await smartInsightsService.generateSmartInsights({ timeRange });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('smart:insights:update', {
        type: 'insights',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getSmartInsights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching smart insights',
      error: error.message
    });
  }
};

// Detect anomalies
export const getAnomalies = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    const data = await smartInsightsService.detectAnomalies({ timeRange });

    // Emit alerts for critical anomalies
    const io = req.app.get('io');
    if (io && data.critical > 0) {
      io.to('admin').emit('smart:anomaly:alert', {
        critical: data.critical,
        message: `${data.critical} critical anomaly(ies) detected`,
        data
      });
    }

    // Emit real-time update
    if (io) {
      io.to('admin').emit('smart:insights:update', {
        type: 'anomalies',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getAnomalies:', error);
    res.status(500).json({
      success: false,
      message: 'Error detecting anomalies',
      error: error.message
    });
  }
};

// Get recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    const data = await smartInsightsService.generateRecommendations({ timeRange });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('smart:insights:update', {
        type: 'recommendations',
        data
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    });
  }
};

// Get all smart insights (combined)
export const getAllSmartInsights = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;
    
    const [insights, anomalies, recommendations] = await Promise.all([
      smartInsightsService.generateSmartInsights({ timeRange }),
      smartInsightsService.detectAnomalies({ timeRange }),
      smartInsightsService.generateRecommendations({ timeRange })
    ]);

    const summary = {
      totalInsights: insights.total,
      totalAnomalies: anomalies.total,
      totalRecommendations: recommendations.total,
      criticalItems: insights.critical + anomalies.critical,
      autoExecutableActions: recommendations.autoExecutable
    };

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('smart:insights:summary', summary);
      
      // Emit alerts if needed
      if (anomalies.critical > 0) {
        io.to('admin').emit('smart:anomaly:alert', {
          critical: anomalies.critical,
          message: `${anomalies.critical} critical anomaly(ies) detected`,
          data: anomalies
        });
      }
    }

    res.json({
      success: true,
      data: {
        summary,
        insights,
        anomalies,
        recommendations
      }
    });
  } catch (error) {
    console.error('Error in getAllSmartInsights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching smart insights',
      error: error.message
    });
  }
};

export default {
  getSmartInsights,
  getAnomalies,
  getRecommendations,
  getAllSmartInsights
};


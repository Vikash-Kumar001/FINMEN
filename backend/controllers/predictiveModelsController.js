import predictiveModelsService from '../services/predictiveModelsService.js';

// Get all predictions
export const getPredictions = async (req, res) => {
  try {
    const filters = {
      predictionType: req.query.predictionType || 'all',
      targetType: req.query.targetType || 'all',
      organizationId: req.query.organizationId,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await predictiveModelsService.getPredictions(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getPredictions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching predictions',
      error: error.message
    });
  }
};

// Predict school performance risk
export const predictSchoolRisk = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const prediction = await predictiveModelsService.predictSchoolPerformanceRisk(organizationId);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('prediction:school:risk:generated', prediction);
    }
    
    res.json({
      success: true,
      message: 'School performance risk prediction generated',
      data: prediction
    });
  } catch (error) {
    console.error('Error in predictSchoolRisk:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error predicting school performance risk',
      error: error.message
    });
  }
};

// Predict subscription renewal
export const predictRenewal = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const prediction = await predictiveModelsService.predictSubscriptionRenewal(organizationId);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('prediction:renewal:generated', prediction);
    }
    
    res.json({
      success: true,
      message: 'Subscription renewal prediction generated',
      data: prediction
    });
  } catch (error) {
    console.error('Error in predictRenewal:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error predicting subscription renewal',
      error: error.message
    });
  }
};

// Detect cheating
export const detectCheatingInExam = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const prediction = await predictiveModelsService.detectCheating(examId, studentId);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('prediction:cheating:detected', prediction);
    }
    
    res.json({
      success: true,
      message: 'Cheating detection analysis completed',
      data: prediction
    });
  } catch (error) {
    console.error('Error in detectCheatingInExam:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error detecting cheating',
      error: error.message
    });
  }
};

// Identify training needs
export const identifyTeacherTraining = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const prediction = await predictiveModelsService.identifyTrainingNeeds(teacherId);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('prediction:training:identified', prediction);
    }
    
    res.json({
      success: true,
      message: 'Teacher training needs identified',
      data: prediction
    });
  } catch (error) {
    console.error('Error in identifyTeacherTraining:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error identifying training needs',
      error: error.message
    });
  }
};

// Forecast workload
export const forecastOperationalWorkload = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { timePeriod = 'month' } = req.query;
    const prediction = await predictiveModelsService.forecastWorkload(organizationId, timePeriod);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('prediction:workload:forecasted', prediction);
    }
    
    res.json({
      success: true,
      message: 'Workload forecast generated',
      data: prediction
    });
  } catch (error) {
    console.error('Error in forecastOperationalWorkload:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error forecasting workload',
      error: error.message
    });
  }
};

// Get prediction statistics
export const getPredictionStats = async (req, res) => {
  try {
    const stats = await predictiveModelsService.getPredictionStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getPredictionStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction statistics',
      error: error.message
    });
  }
};

export default {
  getPredictions,
  predictSchoolRisk,
  predictRenewal,
  detectCheatingInExam,
  identifyTeacherTraining,
  forecastOperationalWorkload,
  getPredictionStats
};


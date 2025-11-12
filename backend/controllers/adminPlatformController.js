import adminPlatformServices from '../services/adminPlatformServices.js';

// ============= NETWORK MAP =============
export const getNetworkMapData = async (req, res) => {
  try {
    const data = await adminPlatformServices.getNetworkMap();
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('network:map:updated', data);
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getNetworkMapData:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching network map data',
      error: error.message
    });
  }
};

// ============= BENCHMARKS =============
export const createBenchmarkAnalysis = async (req, res) => {
  try {
    const benchmark = await adminPlatformServices.createBenchmark(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('benchmark:created', benchmark);
    }
    
    res.status(201).json({
      success: true,
      message: 'Benchmark created successfully',
      data: benchmark
    });
  } catch (error) {
    console.error('Error in createBenchmarkAnalysis:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating benchmark',
      error: error.message
    });
  }
};

export const getBenchmarks = async (req, res) => {
  try {
    const data = await adminPlatformServices.getBenchmarks(req.query);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getBenchmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching benchmarks',
      error: error.message
    });
  }
};

// ============= PLATFORM TELEMETRY =============
export const getPlatformTelemetryData = async (req, res) => {
  try {
    const data = await adminPlatformServices.getPlatformTelemetry();
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('telemetry:updated', data);
    }
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getPlatformTelemetryData:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform telemetry',
      error: error.message
    });
  }
};

export const recordTelemetryData = async (req, res) => {
  try {
    const telemetry = await adminPlatformServices.recordTelemetry(req.body);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('telemetry:recorded', telemetry);
    }
    
    res.json({
      success: true,
      message: 'Telemetry recorded successfully',
      data: telemetry
    });
  } catch (error) {
    console.error('Error in recordTelemetryData:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error recording telemetry',
      error: error.message
    });
  }
};

// ============= SCHOOL ONBOARDING =============
export const createSchoolOnboarding = async (req, res) => {
  try {
    const onboarding = await adminPlatformServices.createOnboarding(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('onboarding:created', onboarding);
    }
    
    res.status(201).json({
      success: true,
      message: 'Onboarding created successfully',
      data: onboarding
    });
  } catch (error) {
    console.error('Error in createSchoolOnboarding:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating onboarding',
      error: error.message
    });
  }
};

export const getSchoolOnboardings = async (req, res) => {
  try {
    const data = await adminPlatformServices.getOnboardings(req.query);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getSchoolOnboardings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching onboardings',
      error: error.message
    });
  }
};

export const updateSchoolOnboarding = async (req, res) => {
  try {
    const { onboardingId } = req.params;
    const onboarding = await adminPlatformServices.updateOnboarding(
      onboardingId,
      req.body
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('onboarding:updated', onboarding);
    }
    
    res.json({
      success: true,
      message: 'Onboarding updated successfully',
      data: onboarding
    });
  } catch (error) {
    console.error('Error in updateSchoolOnboarding:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating onboarding',
      error: error.message
    });
  }
};

export const startTrialPeriod = async (req, res) => {
  try {
    const { onboardingId } = req.params;
    const { trialDays = 30 } = req.body;
    const onboarding = await adminPlatformServices.startTrial(onboardingId, trialDays);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('onboarding:trial:started', onboarding);
    }
    
    res.json({
      success: true,
      message: 'Trial started successfully',
      data: onboarding
    });
  } catch (error) {
    console.error('Error in startTrialPeriod:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error starting trial',
      error: error.message
    });
  }
};

// ============= DATA EXPORT =============
export const createDataExportRequest = async (req, res) => {
  try {
    const export_ = await adminPlatformServices.createDataExport(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('data:export:created', export_);
    }
    
    res.status(201).json({
      success: true,
      message: 'Data export created successfully',
      data: export_
    });
  } catch (error) {
    console.error('Error in createDataExportRequest:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating data export',
      error: error.message
    });
  }
};

export const getDataExports = async (req, res) => {
  try {
    const data = await adminPlatformServices.getDataExports(req.query);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getDataExports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching data exports',
      error: error.message
    });
  }
};

// ============= POLICY & LEGAL =============
export const getPolicyLegalStats = async (req, res) => {
  try {
    const stats = await adminPlatformServices.getPolicyLegalStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getPolicyLegalStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policy legal stats',
      error: error.message
    });
  }
};

export const getPolicyLegalRequests = async (req, res) => {
  try {
    const data = await adminPlatformServices.getPolicyLegalRequests(req.query);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getPolicyLegalRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policy legal requests',
      error: error.message
    });
  }
};

export const createPolicyLegalRequest = async (req, res) => {
  try {
    const request = await adminPlatformServices.createPolicyLegalRequest(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('policy:legal:request:created', request);
    }
    
    res.status(201).json({
      success: true,
      message: 'Policy legal request created successfully',
      data: request
    });
  } catch (error) {
    console.error('Error in createPolicyLegalRequest:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating policy legal request',
      error: error.message
    });
  }
};

export default {
  getNetworkMapData,
  createBenchmarkAnalysis,
  getBenchmarks,
  getPlatformTelemetryData,
  recordTelemetryData,
  createSchoolOnboarding,
  getSchoolOnboardings,
  updateSchoolOnboarding,
  startTrialPeriod,
  createDataExportRequest,
  getDataExports,
  getPolicyLegalStats,
  getPolicyLegalRequests,
  createPolicyLegalRequest
};


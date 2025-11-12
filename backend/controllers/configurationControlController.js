import configurationControlService from '../services/configurationControlService.js';

// Get all feature flags
export const getFeatureFlags = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      category: req.query.category || 'all',
      enabled: req.query.enabled || 'all',
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await configurationControlService.getFeatureFlags(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getFeatureFlags:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feature flags',
      error: error.message
    });
  }
};

// Get feature flag by ID or key
export const getFeatureFlagById = async (req, res) => {
  try {
    const { flagId } = req.params;
    const flag = await configurationControlService.getFeatureFlagById(flagId);
    
    res.json({
      success: true,
      data: flag
    });
  } catch (error) {
    console.error('Error in getFeatureFlagById:', error);
    res.status(error.message === 'Feature flag not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Error fetching feature flag',
      error: error.message
    });
  }
};

// Create feature flag
export const createFeatureFlag = async (req, res) => {
  try {
    const flag = await configurationControlService.createFeatureFlag(
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:feature:created', flag);
    }
    
    res.status(201).json({
      success: true,
      message: 'Feature flag created successfully',
      data: flag
    });
  } catch (error) {
    console.error('Error in createFeatureFlag:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating feature flag',
      error: error.message
    });
  }
};

// Update feature flag
export const updateFeatureFlag = async (req, res) => {
  try {
    const { flagId } = req.params;
    const flag = await configurationControlService.updateFeatureFlag(
      flagId,
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:feature:updated', flag);
      // Broadcast to all users for real-time flag updates
      io.emit('feature:flag:updated', {
        key: flag.key,
        enabled: flag.enabled,
        configuration: flag.configuration
      });
    }
    
    res.json({
      success: true,
      message: 'Feature flag updated successfully',
      data: flag
    });
  } catch (error) {
    console.error('Error in updateFeatureFlag:', error);
    res.status(error.message === 'Feature flag not found' ? 404 : 500).json({
      success: false,
      message: error.message || 'Error updating feature flag',
      error: error.message
    });
  }
};

// Toggle feature flag
export const toggleFeatureFlag = async (req, res) => {
  try {
    const { flagId } = req.params;
    const { enabled, reason } = req.body;
    
    const flag = await configurationControlService.toggleFeatureFlag(
      flagId,
      enabled,
      req.user._id,
      reason
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:feature:toggled', flag);
      io.emit('feature:flag:updated', {
        key: flag.key,
        enabled: flag.enabled,
        configuration: flag.configuration
      });
    }
    
    res.json({
      success: true,
      message: `Feature flag ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: flag
    });
  } catch (error) {
    console.error('Error in toggleFeatureFlag:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error toggling feature flag',
      error: error.message
    });
  }
};

// Update rollout percentage
export const updateRolloutPercentage = async (req, res) => {
  try {
    const { flagId } = req.params;
    const { percentage, reason } = req.body;
    
    const flag = await configurationControlService.updateRolloutPercentage(
      flagId,
      percentage,
      req.user._id,
      reason
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:rollout:updated', flag);
      io.emit('feature:flag:updated', {
        key: flag.key,
        enabled: flag.enabled,
        rolloutPercentage: flag.rolloutPercentage,
        configuration: flag.configuration
      });
    }
    
    res.json({
      success: true,
      message: 'Rollout percentage updated successfully',
      data: flag
    });
  } catch (error) {
    console.error('Error in updateRolloutPercentage:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating rollout percentage',
      error: error.message
    });
  }
};

// Update regional override
export const updateRegionalOverride = async (req, res) => {
  try {
    const { flagId } = req.params;
    const { region, override } = req.body;
    
    const flag = await configurationControlService.updateRegionalOverride(
      flagId,
      region,
      override,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:regional:updated', flag);
      io.emit('feature:flag:updated', {
        key: flag.key,
        enabled: flag.enabled,
        configuration: flag.configuration
      });
    }
    
    res.json({
      success: true,
      message: 'Regional override updated successfully',
      data: flag
    });
  } catch (error) {
    console.error('Error in updateRegionalOverride:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating regional override',
      error: error.message
    });
  }
};

// Add experiment
export const addExperiment = async (req, res) => {
  try {
    const { flagId } = req.params;
    const flag = await configurationControlService.addExperiment(
      flagId,
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:experiment:added', flag);
    }
    
    res.json({
      success: true,
      message: 'Experiment added successfully',
      data: flag
    });
  } catch (error) {
    console.error('Error in addExperiment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding experiment',
      error: error.message
    });
  }
};

// Update beta access
export const updateBetaAccess = async (req, res) => {
  try {
    const { flagId } = req.params;
    const flag = await configurationControlService.updateBetaAccess(
      flagId,
      req.body,
      req.user._id
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('config:beta:updated', flag);
    }
    
    res.json({
      success: true,
      message: 'Beta access updated successfully',
      data: flag
    });
  } catch (error) {
    console.error('Error in updateBetaAccess:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating beta access',
      error: error.message
    });
  }
};

// Get configuration statistics
export const getConfigurationStats = async (req, res) => {
  try {
    const stats = await configurationControlService.getConfigurationStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getConfigurationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching configuration statistics',
      error: error.message
    });
  }
};

// Check if feature is enabled (for client-side)
export const checkFeatureEnabled = async (req, res) => {
  try {
    const { flagKey } = req.params;
    const { userId, orgId, region } = req.query;
    
    const enabled = await configurationControlService.checkFeatureEnabled(
      flagKey,
      userId,
      orgId,
      region
    );
    
    res.json({
      success: true,
      data: { enabled }
    });
  } catch (error) {
    console.error('Error in checkFeatureEnabled:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking feature status',
      error: error.message
    });
  }
};

export default {
  getFeatureFlags,
  getFeatureFlagById,
  createFeatureFlag,
  updateFeatureFlag,
  toggleFeatureFlag,
  updateRolloutPercentage,
  updateRegionalOverride,
  addExperiment,
  updateBetaAccess,
  getConfigurationStats,
  checkFeatureEnabled
};


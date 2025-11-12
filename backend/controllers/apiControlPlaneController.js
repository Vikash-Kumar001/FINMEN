import apiControlPlaneService from '../services/apiControlPlaneService.js';

// Get API control plane statistics
export const getAPIControlPlaneStats = async (req, res) => {
  try {
    const stats = await apiControlPlaneService.getAPIControlPlaneStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getAPIControlPlaneStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching API control plane statistics',
      error: error.message
    });
  }
};

// ============= API KEY MANAGEMENT =============

export const getAPIKeys = async (req, res) => {
  try {
    const filters = {
      status: req.query.status || 'all',
      keyType: req.query.keyType || 'all',
      organizationId: req.query.organizationId,
      search: req.query.search || '',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await apiControlPlaneService.getAPIKeys(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getAPIKeys:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching API keys',
      error: error.message
    });
  }
};

export const createAPIKey = async (req, res) => {
  try {
    const key = await apiControlPlaneService.createAPIKey(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('api:key:created', key);
    }
    
    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: key
    });
  } catch (error) {
    console.error('Error in createAPIKey:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating API key',
      error: error.message
    });
  }
};

export const revokeAPIKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    const { reason } = req.body;
    
    const key = await apiControlPlaneService.revokeAPIKey(keyId, req.user._id, reason);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('api:key:revoked', key);
    }
    
    res.json({
      success: true,
      message: 'API key revoked successfully',
      data: key
    });
  } catch (error) {
    console.error('Error in revokeAPIKey:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error revoking API key',
      error: error.message
    });
  }
};

// ============= API USAGE METRICS =============

export const getAPIUsageMetrics = async (req, res) => {
  try {
    const filters = {
      apiKeyId: req.query.apiKeyId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      endpoint: req.query.endpoint || 'all',
      organizationId: req.query.organizationId
    };
    
    const metrics = await apiControlPlaneService.getAPIUsageMetrics(filters);
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error in getAPIUsageMetrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching API usage metrics',
      error: error.message
    });
  }
};

// ============= WEBHOOK LOGS =============

export const getWebhookLogs = async (req, res) => {
  try {
    const filters = {
      webhookId: req.query.webhookId,
      eventType: req.query.eventType || 'all',
      status: req.query.status || 'all',
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 50
    };
    
    const data = await apiControlPlaneService.getWebhookLogs(filters);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getWebhookLogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching webhook logs',
      error: error.message
    });
  }
};

// ============= INTEGRATION HEALTH =============

export const getIntegrationHealth = async (req, res) => {
  try {
    const filters = {
      integrationType: req.query.integrationType || 'all',
      status: req.query.status || 'all',
      organizationId: req.query.organizationId
    };
    
    const integrations = await apiControlPlaneService.getIntegrationHealth(filters);
    
    res.json({
      success: true,
      data: integrations
    });
  } catch (error) {
    console.error('Error in getIntegrationHealth:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching integration health',
      error: error.message
    });
  }
};

export const checkIntegrationHealth = async (req, res) => {
  try {
    const { integrationId } = req.params;
    const health = await apiControlPlaneService.checkIntegrationHealth(integrationId);
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('api:integration:health:checked', health);
    }
    
    res.json({
      success: true,
      message: 'Integration health check completed',
      data: health
    });
  } catch (error) {
    console.error('Error in checkIntegrationHealth:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking integration health',
      error: error.message
    });
  }
};

export const createIntegrationHealth = async (req, res) => {
  try {
    const integration = await apiControlPlaneService.createIntegrationHealth(
      req.body,
      req.user._id
    );
    
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('api:integration:created', integration);
    }
    
    res.status(201).json({
      success: true,
      message: 'Integration health monitor created successfully',
      data: integration
    });
  } catch (error) {
    console.error('Error in createIntegrationHealth:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating integration health monitor',
      error: error.message
    });
  }
};

export default {
  getAPIControlPlaneStats,
  getAPIKeys,
  createAPIKey,
  revokeAPIKey,
  getAPIUsageMetrics,
  getWebhookLogs,
  getIntegrationHealth,
  checkIntegrationHealth,
  createIntegrationHealth
};


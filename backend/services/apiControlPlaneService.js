import APIKey from '../models/APIKey.js';
import APIUsageLog from '../models/APIUsageLog.js';
import WebhookLog from '../models/WebhookLog.js';
import IntegrationHealth from '../models/IntegrationHealth.js';
import mongoose from 'mongoose';

// ============= API KEY MANAGEMENT =============

// Create API key
export const createAPIKey = async (keyData, createdBy) => {
  try {
    const {
      keyName,
      description,
      keyType = 'development',
      scopes = ['read'],
      allowedIPs = [],
      allowedDomains = [],
      rateLimit = {},
      expiresAt = null,
      organizationId = null
    } = keyData;
    
    const prefix = keyType === 'live' ? 'sk_live' : keyType === 'test' ? 'sk_test' : 'sk_dev';
    const apiKey = APIKey.generateKey(prefix);
    
    const key = new APIKey({
      keyName,
      description,
      apiKey,
      keyPrefix: prefix,
      keyType,
      scopes,
      allowedIPs,
      allowedDomains,
      rateLimit: {
        requestsPerMinute: rateLimit.requestsPerMinute || 60,
        requestsPerHour: rateLimit.requestsPerHour || 1000,
        requestsPerDay: rateLimit.requestsPerDay || 10000
      },
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      neverExpires: !expiresAt,
      organizationId: organizationId ? new mongoose.Types.ObjectId(organizationId) : null,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      status: 'active'
    });
    
    await key.save();
    
    return await APIKey.findById(key._id)
      .populate('createdBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

// Get API keys
export const getAPIKeys = async (filters = {}) => {
  try {
    const {
      status = 'all',
      keyType = 'all',
      organizationId = null,
      search = '',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (keyType !== 'all') {
      query.keyType = keyType;
    }
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    if (search) {
      query.$or = [
        { keyName: { $regex: search, $options: 'i' }},
        { apiKey: { $regex: search, $options: 'i' }}
      ];
    }
    
    const total = await APIKey.countDocuments(query);
    
    const keys = await APIKey.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'fullName name email')
      .populate('organizationId', 'name tenantId')
      .lean();
    
    // Mask API keys for security (show only first and last few characters)
    const maskedKeys = keys.map(key => ({
      ...key,
      apiKey: key.apiKey.substring(0, 8) + '...' + key.apiKey.substring(key.apiKey.length - 4)
    }));
    
    return {
      keys: maskedKeys,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting API keys:', error);
    throw error;
  }
};

// Revoke API key
export const revokeAPIKey = async (keyId, revokedBy, reason = '') => {
  try {
    const key = await APIKey.findById(keyId);
    if (!key) {
      throw new Error('API key not found');
    }
    
    key.status = 'revoked';
    key.revokedAt = new Date();
    key.revokedBy = new mongoose.Types.ObjectId(revokedBy);
    key.revocationReason = reason;
    
    await key.save();
    
    return await APIKey.findById(keyId).lean();
  } catch (error) {
    console.error('Error revoking API key:', error);
    throw error;
  }
};

// ============= API USAGE METRICS =============

// Get API usage metrics
export const getAPIUsageMetrics = async (filters = {}) => {
  try {
    const {
      apiKeyId = null,
      startDate,
      endDate,
      endpoint = 'all',
      organizationId = null
    } = filters;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }
    
    const query = { ...dateFilter };
    
    if (apiKeyId) {
      query.apiKeyId = new mongoose.Types.ObjectId(apiKeyId);
    }
    
    if (endpoint !== 'all') {
      query.endpoint = endpoint;
    }
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    const [
      totalRequests,
      successfulRequests,
      failedRequests,
      byEndpoint,
      byStatusCode,
      byHour,
      averageResponseTime,
      topEndpoints,
      recentRequests
    ] = await Promise.all([
      APIUsageLog.countDocuments(query),
      APIUsageLog.countDocuments({ ...query, statusCode: { $gte: 200, $lt: 300 } }),
      APIUsageLog.countDocuments({ ...query, statusCode: { $gte: 400 } }),
      APIUsageLog.aggregate([
        { $match: query },
        { $group: { _id: '$endpoint', count: { $sum: 1 }}},
        { $sort: { count: -1 }},
        { $limit: 10 }
      ]),
      APIUsageLog.aggregate([
        { $match: query },
        { $group: { _id: '$statusCode', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      APIUsageLog.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $hour: '$timestamp' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 }}
      ]),
      APIUsageLog.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: '$responseTime' }
          }
        }
      ]),
      APIUsageLog.find(query)
        .sort({ timestamp: -1 })
        .limit(10)
        .select('endpoint method statusCode responseTime timestamp')
        .lean(),
      APIUsageLog.find(query)
        .sort({ timestamp: -1 })
        .limit(20)
        .populate('apiKeyId', 'keyName')
        .lean()
    ]);
    
    const successRate = totalRequests > 0 ? ((successfulRequests / totalRequests) * 100).toFixed(2) : 0;
    const avgResponseTime = averageResponseTime[0]?.avgResponseTime || 0;
    
    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      successRate: parseFloat(successRate),
      averageResponseTime: parseFloat(avgResponseTime.toFixed(2)),
      byEndpoint: byEndpoint || [],
      byStatusCode: byStatusCode || [],
      byHour: byHour || [],
      topEndpoints: topEndpoints || [],
      recentRequests: recentRequests || []
    };
  } catch (error) {
    console.error('Error getting API usage metrics:', error);
    throw error;
  }
};

// ============= WEBHOOK LOGS =============

// Get webhook logs
export const getWebhookLogs = async (filters = {}) => {
  try {
    const {
      webhookId = null,
      eventType = 'all',
      status = 'all',
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (webhookId) {
      query.webhookId = new mongoose.Types.ObjectId(webhookId);
    }
    
    if (eventType !== 'all') {
      query.eventType = eventType;
    }
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const total = await WebhookLog.countDocuments(query);
    
    const logs = await WebhookLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting webhook logs:', error);
    throw error;
  }
};

// ============= INTEGRATION HEALTH =============

// Get integration health
export const getIntegrationHealth = async (filters = {}) => {
  try {
    const {
      integrationType = 'all',
      status = 'all',
      organizationId = null
    } = filters;
    
    const query = {};
    
    if (integrationType !== 'all') {
      query.integrationType = integrationType;
    }
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (organizationId) {
      query.organizationId = new mongoose.Types.ObjectId(organizationId);
    }
    
    const integrations = await IntegrationHealth.find(query)
      .sort({ status: 1, lastChecked: -1 })
      .populate('organizationId', 'name tenantId')
      .lean();
    
    return integrations;
  } catch (error) {
    console.error('Error getting integration health:', error);
    throw error;
  }
};

// Check integration health
export const checkIntegrationHealth = async (integrationId) => {
  try {
    const integration = await IntegrationHealth.findById(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }
    
    // Simulate health check (in production, this would make actual API calls)
    const startTime = Date.now();
    let status = 'healthy';
    let responseTime = 0;
    let errorMessage = null;
    let statusCode = 200;
    
    // Mock health check logic
    // In production, this would make HTTP requests to the integration endpoint
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
      responseTime = Date.now() - startTime;
      
      // Random health status for demo (in production, use actual checks)
      const random = Math.random();
      if (random > 0.8) {
        status = 'degraded';
        statusCode = 503;
      } else if (random > 0.95) {
        status = 'down';
        statusCode = 500;
        errorMessage = 'Connection timeout';
      }
    } catch (error) {
      status = 'down';
      responseTime = Date.now() - startTime;
      errorMessage = error.message;
      statusCode = 500;
    }
    
    // Update metrics
    const wasHealthy = integration.status === 'healthy';
    integration.status = status;
    integration.metrics.responseTime = responseTime;
    integration.metrics.lastCheck = new Date();
    
    if (status === 'healthy') {
      integration.metrics.lastSuccess = new Date();
      integration.metrics.consecutiveFailures = 0;
      if (!wasHealthy) {
        integration.metrics.successRate = Math.min(100, (integration.metrics.successRate || 0) + 10);
      }
    } else {
      integration.metrics.lastFailure = new Date();
      integration.metrics.consecutiveFailures = (integration.metrics.consecutiveFailures || 0) + 1;
      integration.metrics.successRate = Math.max(0, (integration.metrics.successRate || 100) - 10);
    }
    
    // Add to health check history
    integration.healthCheckHistory.push({
      timestamp: new Date(),
      status,
      responseTime,
      errorMessage,
      statusCode
    });
    
    // Keep only last 100 health checks
    if (integration.healthCheckHistory.length > 100) {
      integration.healthCheckHistory = integration.healthCheckHistory.slice(-100);
    }
    
    // Create alert if needed
    if (status === 'down' && integration.metrics.consecutiveFailures >= 3) {
      integration.alerts.push({
        type: 'downtime',
        message: `Integration ${integration.integrationName} is down`,
        severity: 'critical',
        triggeredAt: new Date()
      });
    }
    
    integration.lastChecked = new Date();
    integration.nextCheck = new Date(Date.now() + integration.checkInterval);
    
    await integration.save();
    
    return await IntegrationHealth.findById(integrationId).lean();
  } catch (error) {
    console.error('Error checking integration health:', error);
    throw error;
  }
};

// Create integration health monitor
export const createIntegrationHealth = async (integrationData, createdBy) => {
  try {
    const integration = new IntegrationHealth({
      ...integrationData,
      organizationId: integrationData.organizationId ? new mongoose.Types.ObjectId(integrationData.organizationId) : null,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      status: 'unknown',
      metrics: {
        responseTime: 0,
        successRate: 100,
        uptime: 100,
        errorRate: 0,
        consecutiveFailures: 0
      }
    });
    
    await integration.save();
    
    return await IntegrationHealth.findById(integration._id)
      .populate('organizationId', 'name tenantId')
      .lean();
  } catch (error) {
    console.error('Error creating integration health monitor:', error);
    throw error;
  }
};

// Get API control plane statistics
export const getAPIControlPlaneStats = async () => {
  try {
    const [
      totalKeys,
      activeKeys,
      revokedKeys,
      totalRequests,
      successfulRequests,
      failedRequests,
      totalWebhooks,
      failedWebhooks,
      totalIntegrations,
      unhealthyIntegrations
    ] = await Promise.all([
      APIKey.countDocuments(),
      APIKey.countDocuments({ status: 'active' }),
      APIKey.countDocuments({ status: 'revoked' }),
      APIUsageLog.countDocuments(),
      APIUsageLog.countDocuments({ statusCode: { $gte: 200, $lt: 300 } }),
      APIUsageLog.countDocuments({ statusCode: { $gte: 400 } }),
      WebhookLog.countDocuments(),
      WebhookLog.countDocuments({ status: 'failed' }),
      IntegrationHealth.countDocuments(),
      IntegrationHealth.countDocuments({ status: { $in: ['degraded', 'down'] } })
    ]);
    
    return {
      keys: {
        total: totalKeys,
        active: activeKeys,
        revoked: revokedKeys
      },
      usage: {
        total: totalRequests,
        successful: successfulRequests,
        failed: failedRequests
      },
      webhooks: {
        total: totalWebhooks,
        failed: failedWebhooks
      },
      integrations: {
        total: totalIntegrations,
        unhealthy: unhealthyIntegrations
      }
    };
  } catch (error) {
    console.error('Error getting API control plane stats:', error);
    throw error;
  }
};

export default {
  createAPIKey,
  getAPIKeys,
  revokeAPIKey,
  getAPIUsageMetrics,
  getWebhookLogs,
  getIntegrationHealth,
  checkIntegrationHealth,
  createIntegrationHealth,
  getAPIControlPlaneStats
};


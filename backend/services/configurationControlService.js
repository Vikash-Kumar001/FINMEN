import FeatureFlag from '../models/FeatureFlag.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all feature flags with filters
export const getFeatureFlags = async (filters = {}) => {
  try {
    const {
      status = 'all',
      category = 'all',
      enabled = 'all',
      search = '',
      page = 1,
      limit = 50
    } = filters;
    
    const query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (category !== 'all') {
      query.category = category;
    }
    
    if (enabled !== 'all') {
      query.enabled = enabled === 'true' || enabled === true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' }},
        { key: { $regex: search, $options: 'i' }},
        { description: { $regex: search, $options: 'i' }},
        { tags: { $in: [new RegExp(search, 'i')] }}
      ];
    }
    
    const total = await FeatureFlag.countDocuments(query);
    
    const flags = await FeatureFlag.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy', 'fullName name email')
      .populate('updatedBy', 'fullName name email')
      .populate('targetOrganizations', 'name tenantId')
      .lean();
    
    return {
      flags,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error getting feature flags:', error);
    throw error;
  }
};

// Get feature flag by key or ID
export const getFeatureFlagById = async (flagId) => {
  try {
    const flag = await FeatureFlag.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(flagId) ? flagId : null },
        { key: flagId }
      ]
    })
      .populate('createdBy', 'fullName name email')
      .populate('updatedBy', 'fullName name email')
      .populate('targetOrganizations', 'name tenantId')
      .populate('targetUsers', 'fullName name email role')
      .lean();
    
    if (!flag) {
      throw new Error('Feature flag not found');
    }
    
    return flag;
  } catch (error) {
    console.error('Error getting feature flag:', error);
    throw error;
  }
};

// Create feature flag
export const createFeatureFlag = async (flagData, createdBy) => {
  try {
    const {
      key,
      name,
      description,
      category,
      enabled = false,
      rolloutPercentage = 0,
      rolloutType = 'global',
      configuration = {},
      targetOrganizations = [],
      targetUsers = [],
      targetRoles = [],
      targetRegions = [],
      tags = [],
      priority = 0
    } = flagData;
    
    // Check if key already exists
    const existing = await FeatureFlag.findOne({ key });
    if (existing) {
      throw new Error('Feature flag with this key already exists');
    }
    
    const flag = new FeatureFlag({
      key,
      name,
      description,
      category,
      enabled,
      status: enabled ? 'active' : 'draft',
      rolloutPercentage,
      rolloutType,
      configuration,
      targetOrganizations: targetOrganizations.map(id => new mongoose.Types.ObjectId(id)),
      targetUsers: targetUsers.map(id => new mongoose.Types.ObjectId(id)),
      targetRoles,
      targetRegions,
      tags,
      priority,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      auditTrail: [{
        action: 'created',
        performedBy: new mongoose.Types.ObjectId(createdBy),
        changes: { enabled, status: enabled ? 'active' : 'draft' }
      }]
    });
    
    await flag.save();
    
    return await getFeatureFlagById(flag._id);
  } catch (error) {
    console.error('Error creating feature flag:', error);
    throw error;
  }
};

// Update feature flag
export const updateFeatureFlag = async (flagId, updates, updatedBy) => {
  try {
    const flag = await FeatureFlag.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(flagId) ? flagId : null },
        { key: flagId }
      ]
    });
    
    if (!flag) {
      throw new Error('Feature flag not found');
    }
    
    const oldValues = {
      enabled: flag.enabled,
      status: flag.status,
      rolloutPercentage: flag.rolloutPercentage,
      configuration: flag.configuration
    };
    
    // Update fields
    if (updates.name !== undefined) flag.name = updates.name;
    if (updates.description !== undefined) flag.description = updates.description;
    if (updates.category !== undefined) flag.category = updates.category;
    if (updates.enabled !== undefined) {
      flag.enabled = updates.enabled;
      if (flag.status === 'draft' && updates.enabled) {
        flag.status = 'active';
      } else if (flag.status === 'active' && !updates.enabled) {
        flag.status = 'paused';
      }
    }
    if (updates.status !== undefined) flag.status = updates.status;
    if (updates.rolloutPercentage !== undefined) flag.rolloutPercentage = updates.rolloutPercentage;
    if (updates.rolloutType !== undefined) flag.rolloutType = updates.rolloutType;
    if (updates.configuration !== undefined) flag.configuration = updates.configuration;
    if (updates.targetOrganizations !== undefined) {
      flag.targetOrganizations = updates.targetOrganizations.map(id => new mongoose.Types.ObjectId(id));
    }
    if (updates.targetUsers !== undefined) {
      flag.targetUsers = updates.targetUsers.map(id => new mongoose.Types.ObjectId(id));
    }
    if (updates.targetRoles !== undefined) flag.targetRoles = updates.targetRoles;
    if (updates.targetRegions !== undefined) flag.targetRegions = updates.targetRegions;
    if (updates.tags !== undefined) flag.tags = updates.tags;
    if (updates.priority !== undefined) flag.priority = updates.priority;
    
    flag.updatedBy = new mongoose.Types.ObjectId(updatedBy);
    
    // Track changes
    const changes = {};
    Object.keys(updates).forEach(key => {
      if (oldValues[key] !== undefined && JSON.stringify(oldValues[key]) !== JSON.stringify(flag[key])) {
        changes[key] = { from: oldValues[key], to: flag[key] };
      }
    });
    
    flag.auditTrail.push({
      action: 'updated',
      performedBy: new mongoose.Types.ObjectId(updatedBy),
      changes,
      reason: updates.reason
    });
    
    await flag.save();
    
    return await getFeatureFlagById(flag._id);
  } catch (error) {
    console.error('Error updating feature flag:', error);
    throw error;
  }
};

// Toggle feature flag (quick enable/disable)
export const toggleFeatureFlag = async (flagId, enabled, updatedBy, reason = '') => {
  try {
    return await updateFeatureFlag(flagId, { enabled, reason }, updatedBy);
  } catch (error) {
    console.error('Error toggling feature flag:', error);
    throw error;
  }
};

// Update rollout percentage
export const updateRolloutPercentage = async (flagId, percentage, updatedBy, reason = '') => {
  try {
    return await updateFeatureFlag(flagId, { rolloutPercentage: percentage, reason }, updatedBy);
  } catch (error) {
    console.error('Error updating rollout percentage:', error);
    throw error;
  }
};

// Add/update regional override
export const updateRegionalOverride = async (flagId, region, override, updatedBy) => {
  try {
    const flag = await FeatureFlag.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(flagId) ? flagId : null },
        { key: flagId }
      ]
    });
    
    if (!flag) {
      throw new Error('Feature flag not found');
    }
    
    const existingIndex = flag.regionalOverrides.findIndex(ro => ro.region === region);
    
    const overrideData = {
      region,
      enabled: override.enabled !== undefined ? override.enabled : flag.enabled,
      rolloutPercentage: override.rolloutPercentage !== undefined ? override.rolloutPercentage : flag.rolloutPercentage,
      notes: override.notes || '',
      updatedAt: new Date(),
      updatedBy: new mongoose.Types.ObjectId(updatedBy)
    };
    
    if (existingIndex >= 0) {
      flag.regionalOverrides[existingIndex] = overrideData;
    } else {
      flag.regionalOverrides.push(overrideData);
    }
    
    flag.updatedBy = new mongoose.Types.ObjectId(updatedBy);
    flag.auditTrail.push({
      action: 'regional_override_updated',
      performedBy: new mongoose.Types.ObjectId(updatedBy),
      changes: { region, override: overrideData }
    });
    
    await flag.save();
    
    return await getFeatureFlagById(flag._id);
  } catch (error) {
    console.error('Error updating regional override:', error);
    throw error;
  }
};

// Add experiment/variant
export const addExperiment = async (flagId, experimentData, updatedBy) => {
  try {
    const flag = await FeatureFlag.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(flagId) ? flagId : null },
        { key: flagId }
      ]
    });
    
    if (!flag) {
      throw new Error('Feature flag not found');
    }
    
    const experiment = {
      name: experimentData.name,
      variant: experimentData.variant || 'variant_a',
      percentage: experimentData.percentage || 50,
      metrics: experimentData.metrics || [],
      startDate: experimentData.startDate ? new Date(experimentData.startDate) : new Date(),
      endDate: experimentData.endDate ? new Date(experimentData.endDate) : null,
      status: 'active'
    };
    
    flag.experiments.push(experiment);
    flag.updatedBy = new mongoose.Types.ObjectId(updatedBy);
    flag.auditTrail.push({
      action: 'experiment_added',
      performedBy: new mongoose.Types.ObjectId(updatedBy),
      changes: { experiment }
    });
    
    await flag.save();
    
    return await getFeatureFlagById(flag._id);
  } catch (error) {
    console.error('Error adding experiment:', error);
    throw error;
  }
};

// Update beta access
export const updateBetaAccess = async (flagId, betaData, updatedBy) => {
  try {
    const updates = {
      'betaAccess.enabled': betaData.enabled !== undefined ? betaData.enabled : false,
      'betaAccess.accessLevel': betaData.accessLevel || 'private',
      'betaAccess.betaKey': betaData.betaKey || ''
    };
    
    if (betaData.betaUsers) {
      updates['betaAccess.betaUsers'] = betaData.betaUsers.map(id => new mongoose.Types.ObjectId(id));
    }
    if (betaData.betaOrganizations) {
      updates['betaAccess.betaOrganizations'] = betaData.betaOrganizations.map(id => new mongoose.Types.ObjectId(id));
    }
    
    const flag = await FeatureFlag.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(flagId) ? flagId : null },
        { key: flagId }
      ]
    });
    
    if (!flag) {
      throw new Error('Feature flag not found');
    }
    
    Object.assign(flag.betaAccess, {
      enabled: betaData.enabled !== undefined ? betaData.enabled : flag.betaAccess.enabled,
      accessLevel: betaData.accessLevel || flag.betaAccess.accessLevel,
      betaUsers: betaData.betaUsers ? betaData.betaUsers.map(id => new mongoose.Types.ObjectId(id)) : flag.betaAccess.betaUsers,
      betaOrganizations: betaData.betaOrganizations ? betaData.betaOrganizations.map(id => new mongoose.Types.ObjectId(id)) : flag.betaAccess.betaOrganizations,
      betaKey: betaData.betaKey || flag.betaAccess.betaKey
    });
    
    flag.updatedBy = new mongoose.Types.ObjectId(updatedBy);
    flag.auditTrail.push({
      action: 'beta_access_updated',
      performedBy: new mongoose.Types.ObjectId(updatedBy),
      changes: { betaAccess: flag.betaAccess }
    });
    
    await flag.save();
    
    return await getFeatureFlagById(flag._id);
  } catch (error) {
    console.error('Error updating beta access:', error);
    throw error;
  }
};

// Get configuration statistics
export const getConfigurationStats = async () => {
  try {
    const [
      totalFlags,
      enabledFlags,
      byCategory,
      byStatus,
      activeExperiments,
      regionalOverrides
    ] = await Promise.all([
      FeatureFlag.countDocuments(),
      FeatureFlag.countDocuments({ enabled: true }),
      FeatureFlag.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      FeatureFlag.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
      ]),
      FeatureFlag.countDocuments({ 'experiments.status': 'active' }),
      FeatureFlag.countDocuments({ 'regionalOverrides.0': { $exists: true }})
    ]);
    
    return {
      total: totalFlags,
      enabled: enabledFlags,
      disabled: totalFlags - enabledFlags,
      byCategory: byCategory || [],
      byStatus: byStatus || [],
      activeExperiments: activeExperiments || 0,
      regionalOverrides: regionalOverrides || 0
    };
  } catch (error) {
    console.error('Error getting configuration stats:', error);
    throw error;
  }
};

// Check if feature is enabled for a user/org (for client-side checks)
export const checkFeatureEnabled = async (flagKey, userId, orgId, region) => {
  try {
    const flag = await FeatureFlag.findOne({ key: flagKey, status: 'active' });
    
    if (!flag) {
      return false;
    }
    
    // Check global enabled
    if (!flag.enabled) {
      return false;
    }
    
    // Check regional override
    if (region) {
      const regionalOverride = flag.regionalOverrides.find(ro => ro.region === region);
      if (regionalOverride) {
        if (!regionalOverride.enabled) {
          return false;
        }
        // Check rollout percentage for region
        if (regionalOverride.rolloutPercentage < 100) {
          // Simple hash-based percentage check
          const hash = (userId || orgId || '').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          if (hash % 100 >= regionalOverride.rolloutPercentage) {
            return false;
          }
        }
      }
    }
    
    // Check rollout type
    switch (flag.rolloutType) {
      case 'global':
        return flag.rolloutPercentage === 100 || Math.random() * 100 < flag.rolloutPercentage;
      
      case 'percentage':
        const hash = (userId || orgId || '').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash % 100 < flag.rolloutPercentage;
      
      case 'specific_orgs':
        if (!orgId) return false;
        return flag.targetOrganizations.some(oid => oid.toString() === orgId.toString());
      
      case 'specific_users':
        if (!userId) return false;
        return flag.targetUsers.some(uid => uid.toString() === userId.toString());
      
      case 'regional':
        if (!region) return false;
        return flag.targetRegions.includes(region);
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking feature enabled:', error);
    return false;
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


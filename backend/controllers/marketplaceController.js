import MarketplaceModule from '../models/MarketplaceModule.js';
import { generateAnonymizedExport, validateAnonymizedExport } from '../services/privacyValidationService.js';

/**
 * Get all marketplace modules
 */
export const getMarketplaceModules = async (req, res) => {
  try {
    const { status, type, category, tags, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query['metadata.category'] = category;
    if (tags) {
      query['metadata.tags'] = { $in: tags.split(',') };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const modules = await MarketplaceModule.find(query)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching marketplace modules:', error);
    res.status(500).json({ success: false, message: 'Error fetching marketplace modules' });
  }
};

/**
 * Get catalog modules (approved and active only)
 */
export const getCatalogModules = async (req, res) => {
  try {
    const { category, tags, search, featured } = req.query;

    let query = {
      status: { $in: ['approved', 'active'] }
    };

    if (category) query['metadata.category'] = category;
    if (tags) {
      query['metadata.tags'] = { $in: tags.split(',') };
    }
    if (search) {
      query.$text = { $search: search };
    }
    if (featured === 'true') {
      query['catalogSettings.featured'] = true;
    }

    const modules = await MarketplaceModule.find(query)
      .select('-auditTrail -rejectionReason')
      .sort({ 'catalogSettings.featured': -1, 'stats.rating': -1, createdAt: -1 });

    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error('Error fetching catalog modules:', error);
    res.status(500).json({ success: false, message: 'Error fetching catalog modules' });
  }
};

/**
 * Get module by ID
 */
export const getModuleById = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const module = await MarketplaceModule.findById(moduleId)
      .populate('approvedBy', 'name email');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    res.json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ success: false, message: 'Error fetching module' });
  }
};

/**
 * Create new module
 */
export const createModule = async (req, res) => {
  try {
    const userId = req.user._id;
    const moduleData = req.body;

    const module = await MarketplaceModule.create({
      ...moduleData,
      auditTrail: [{
        action: 'created',
        performedBy: userId,
        metadata: { source: 'manual' }
      }]
    });

    res.json({
      success: true,
      message: 'Module created successfully',
      data: module
    });
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ success: false, message: 'Error creating module' });
  }
};

/**
 * Approve module
 */
export const approveModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { comments } = req.body;
    const userId = req.user._id;

    const module = await MarketplaceModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    if (module.status === 'approved' || module.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Module is already approved'
      });
    }

    // Approve module
    module.status = 'approved';
    module.approvedBy = userId;
    module.approvedAt = new Date();

    // Add audit trail
    module.auditTrail.push({
      action: 'approved',
      performedBy: userId,
      metadata: { comments }
    });

    await module.save();

    res.json({
      success: true,
      message: 'Module approved successfully and added to catalog',
      data: module
    });
  } catch (error) {
    console.error('Error approving module:', error);
    res.status(500).json({ success: false, message: 'Error approving module' });
  }
};

/**
 * Reject module
 */
export const rejectModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const module = await MarketplaceModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    module.status = 'rejected';
    module.rejectionReason = reason;

    module.auditTrail.push({
      action: 'rejected',
      performedBy: userId,
      metadata: { reason }
    });

    await module.save();

    res.json({
      success: true,
      message: 'Module rejected successfully',
      data: module
    });
  } catch (error) {
    console.error('Error rejecting module:', error);
    res.status(500).json({ success: false, message: 'Error rejecting module' });
  }
};

/**
 * Update module
 */
export const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const updates = req.body;
    const userId = req.user._id;

    const module = await MarketplaceModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        module[key] = updates[key];
      }
    });

    module.auditTrail.push({
      action: 'updated',
      performedBy: userId,
      metadata: { updatedFields: Object.keys(updates) }
    });

    await module.save();

    res.json({
      success: true,
      message: 'Module updated successfully',
      data: module
    });
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ success: false, message: 'Error updating module' });
  }
};

/**
 * Validate anonymized export
 */
export const validateAnonymizedExportEndpoint = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Data is required'
      });
    }

    const validation = validateAnonymizedExport(data);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Error validating export:', error);
    res.status(500).json({ success: false, message: 'Error validating export' });
  }
};

/**
 * Generate anonymized export
 */
export const generateAnonymizedExportEndpoint = async (req, res) => {
  try {
    const { rawData, options } = req.body;

    if (!rawData) {
      return res.status(400).json({
        success: false,
        message: 'Raw data is required'
      });
    }

    const exportData = await generateAnonymizedExport(rawData, options);

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Error generating export:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating anonymized export'
    });
  }
};

/**
 * Get marketplace statistics
 */
export const getMarketplaceStats = async (req, res) => {
  try {
    const stats = await MarketplaceModule.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inavora: { $sum: { $cond: [{ $eq: ['$type', 'inavora'] }, 1, 0] } },
          thirdParty: { $sum: { $cond: [{ $eq: ['$type', 'third-party'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        total: 0,
        approved: 0,
        pending: 0,
        active: 0,
        inavora: 0,
        thirdParty: 0
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching marketplace stats' });
  }
};


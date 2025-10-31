import CobrandingLegal from '../models/CobrandingLegal.js';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import mongoose from 'mongoose';

// Get all co-branding partnerships
export const getCobrandingPartnerships = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      organizationId,
      partnerType,
      contractStatus,
      partnershipType,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter criteria
    const filter = {};
    if (organizationId) filter.organizationId = organizationId;
    if (partnerType) filter.partnerType = partnerType;
    if (contractStatus) filter['contractInfo.contractStatus'] = contractStatus;
    if (partnershipType) filter['partnershipDetails.partnershipType'] = partnershipType;
    if (status) filter.status = status;

    // Build sort criteria
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const partnerships = await CobrandingLegal.find(filter)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('associatedCampaigns.campaignId', 'title status')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CobrandingLegal.countDocuments(filter);

    res.json({
      success: true,
      data: partnerships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching co-branding partnerships:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch co-branding partnerships',
      error: error.message
    });
  }
};

// Get single co-branding partnership
export const getCobrandingPartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    const partnership = await CobrandingLegal.findById(partnershipId)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('associatedCampaigns.campaignId', 'title status timeline')
      .populate('legalCompliance.complianceChecks.checkedBy', 'name email')
      .populate('brandAssets.assetLibrary.uploadedBy', 'name email');

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    res.json({
      success: true,
      data: partnership
    });
  } catch (error) {
    console.error('Error fetching co-branding partnership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch co-branding partnership',
      error: error.message
    });
  }
};

// Create new co-branding partnership
export const createCobrandingPartnership = async (req, res) => {
  try {
    const partnershipData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id,
      organizationId: req.user.organizationId
    };

    const partnership = new CobrandingLegal(partnershipData);
    await partnership.save();

    res.status(201).json({
      success: true,
      message: 'Co-branding partnership created successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error creating co-branding partnership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create co-branding partnership',
      error: error.message
    });
  }
};

// Update co-branding partnership
export const updateCobrandingPartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const partnership = await CobrandingLegal.findByIdAndUpdate(
      partnershipId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    res.json({
      success: true,
      message: 'Co-branding partnership updated successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error updating co-branding partnership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update co-branding partnership',
      error: error.message
    });
  }
};

// Update contract status
export const updateContractStatus = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const { contractStatus, notes } = req.body;

    const partnership = await CobrandingLegal.findById(partnershipId);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    partnership.contractInfo.contractStatus = contractStatus;
    partnership.lastModifiedBy = req.user._id;

    if (notes) {
      partnership.legalCompliance.complianceNotes = notes;
    }

    await partnership.save();

    res.json({
      success: true,
      message: 'Contract status updated successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error updating contract status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contract status',
      error: error.message
    });
  }
};

// Add communication log entry
export const addCommunicationLog = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const { type, subject, notes, participants, followUpRequired, followUpDate } = req.body;

    const partnership = await CobrandingLegal.findById(partnershipId);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    await partnership.addCommunicationLog({
      type,
      subject,
      notes,
      participants: participants || [],
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate ? new Date(followUpDate) : null
    });

    res.json({
      success: true,
      message: 'Communication log entry added successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error adding communication log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add communication log entry',
      error: error.message
    });
  }
};

// Add brand asset
export const addBrandAsset = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const { assetType, assetName, assetUrl, description, usage, restrictions } = req.body;

    const partnership = await CobrandingLegal.findById(partnershipId);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    partnership.brandAssets.assetLibrary.push({
      assetType,
      assetName,
      assetUrl,
      description,
      usage,
      restrictions,
      uploadedBy: req.user._id
    });

    partnership.lastModifiedBy = req.user._id;
    await partnership.save();

    res.json({
      success: true,
      message: 'Brand asset added successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error adding brand asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add brand asset',
      error: error.message
    });
  }
};

// Add legal document
export const addLegalDocument = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const { documentType, documentName, documentUrl, expiryDate } = req.body;

    const partnership = await CobrandingLegal.findById(partnershipId);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    partnership.legalCompliance.legalDocuments.push({
      documentType,
      documentName,
      documentUrl,
      uploadedBy: req.user._id,
      expiryDate: expiryDate ? new Date(expiryDate) : null
    });

    partnership.lastModifiedBy = req.user._id;
    await partnership.save();

    res.json({
      success: true,
      message: 'Legal document added successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error adding legal document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add legal document',
      error: error.message
    });
  }
};

// Associate campaign with partnership
export const associateCampaign = async (req, res) => {
  try {
    const { partnershipId } = req.params;
    const { campaignId, associationType, contribution, startDate, endDate } = req.body;

    const partnership = await CobrandingLegal.findById(partnershipId);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    partnership.associatedCampaigns.push({
      campaignId,
      campaignName: campaign.title,
      associationType,
      contribution,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      status: 'active'
    });

    partnership.lastModifiedBy = req.user._id;
    await partnership.save();

    res.json({
      success: true,
      message: 'Campaign associated successfully',
      data: partnership
    });
  } catch (error) {
    console.error('Error associating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to associate campaign',
      error: error.message
    });
  }
};

// Get expiring contracts
export const getExpiringContracts = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const expiringContracts = await CobrandingLegal.getExpiringContracts(parseInt(days));

    res.json({
      success: true,
      data: expiringContracts,
      count: expiringContracts.length
    });
  } catch (error) {
    console.error('Error fetching expiring contracts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expiring contracts',
      error: error.message
    });
  }
};

// Get compliance dashboard
export const getComplianceDashboard = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const orgId = organizationId || req.user?.organizationId || '507f1f77bcf86cd799439011';

    const partnerships = await CobrandingLegal.find({
      organizationId: new mongoose.Types.ObjectId(orgId)
    });

    // Calculate compliance metrics
    const totalPartnerships = partnerships.length;
    const compliantPartnerships = partnerships.filter(p => p.legalCompliance.isCompliant).length;
    const expiringContracts = partnerships.filter(p => {
      if (!p.contractInfo.endDate) return false;
      const daysUntilExpiry = (p.contractInfo.endDate - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    const overdueReviews = partnerships.filter(p => {
      return p.legalCompliance.nextReview && p.legalCompliance.nextReview < new Date();
    }).length;

    const complianceSummary = {
      totalPartnerships,
      compliantPartnerships,
      complianceRate: totalPartnerships > 0 ? (compliantPartnerships / totalPartnerships) * 100 : 0,
      expiringContracts,
      overdueReviews,
      partnershipsByStatus: {
        active: partnerships.filter(p => p.status === 'active').length,
        inactive: partnerships.filter(p => p.status === 'inactive').length,
        suspended: partnerships.filter(p => p.status === 'suspended').length,
        terminated: partnerships.filter(p => p.status === 'terminated').length
      },
      partnershipsByType: {
        corporate: partnerships.filter(p => p.partnerType === 'corporate').length,
        ngo: partnerships.filter(p => p.partnerType === 'ngo').length,
        educational: partnerships.filter(p => p.partnerType === 'educational_institution').length,
        government: partnerships.filter(p => p.partnerType === 'government').length
      }
    };

    res.json({
      success: true,
      data: complianceSummary
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance dashboard',
      error: error.message
    });
  }
};

// Delete co-branding partnership
export const deleteCobrandingPartnership = async (req, res) => {
  try {
    const { partnershipId } = req.params;

    const partnership = await CobrandingLegal.findByIdAndDelete(partnershipId);
    if (!partnership) {
      return res.status(404).json({
        success: false,
        message: 'Co-branding partnership not found'
      });
    }

    res.json({
      success: true,
      message: 'Co-branding partnership deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting co-branding partnership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete co-branding partnership',
      error: error.message
    });
  }
};

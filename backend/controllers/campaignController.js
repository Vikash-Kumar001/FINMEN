import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import Template from '../models/Template.js';
import VoucherRedemption from '../models/VoucherRedemption.js';
import Transaction from '../models/Transaction.js';
import GameProgress from '../models/GameProgress.js';
import mongoose from 'mongoose';

// Get all campaigns with filtering and pagination
export const getCampaigns = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      workflowStage,
      type,
      organizationId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};
    if (status) filter.status = status;
    if (workflowStage) filter.workflowStage = workflowStage;
    if (type) filter.type = type;
    if (organizationId) filter.organizationId = organizationId;

    // Build sort query
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const campaigns = await Campaign.find(filter)
      .populate('createdBy', 'name email')
      .populate('organizationId', 'name')
      .populate('templates.templateId', 'title category')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Campaign.countDocuments(filter);

    // Calculate quick metrics for each campaign
    const campaignsWithMetrics = await Promise.all(
      campaigns.map(async (campaign) => {
        const metrics = await calculateCampaignMetrics(campaign._id);
        return {
          ...campaign.toObject(),
          quickMetrics: metrics
        };
      })
    );

    res.json({
      success: true,
      data: campaignsWithMetrics,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns',
      error: error.message
    });
  }
};

// Get single campaign with full details
export const getCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId)
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('organizationId', 'name')
      .populate('templates.templateId')
      .populate('approval.approvedBy', 'name email')
      .populate('approval.reviewers.userId', 'name email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Calculate detailed metrics
    const detailedMetrics = await calculateDetailedCampaignMetrics(campaignId);

    res.json({
      success: true,
      data: {
        ...campaign.toObject(),
        detailedMetrics
      }
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaign',
      error: error.message
    });
  }
};

// Create new campaign
export const createCampaign = async (req, res) => {
  try {
    const campaignData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id,
      organizationId: req.user.organizationId
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign',
      error: error.message
    });
  }
};

// Update campaign
export const updateCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign',
      error: error.message
    });
  }
};

// Update campaign workflow stage
export const updateCampaignStage = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { stage, data } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Update workflow stage and related data
    campaign.workflowStage = stage;
    campaign.status = getStatusFromStage(stage);
    campaign.lastModifiedBy = req.user._id;

    // Update stage-specific data
    switch (stage) {
      case 'scope':
        if (data.scope) campaign.scope = { ...campaign.scope, ...data.scope };
        break;
      case 'templates':
        if (data.templates) campaign.templates = data.templates;
        break;
      case 'approval':
        campaign.status = 'pending_approval';
        break;
      case 'pilot':
        campaign.status = 'pilot';
        if (data.pilotStartDate) campaign.timeline.pilotStartDate = data.pilotStartDate;
        if (data.pilotEndDate) campaign.timeline.pilotEndDate = data.pilotEndDate;
        break;
      case 'rollout':
        campaign.status = 'rollout';
        if (data.rolloutDate) campaign.timeline.rolloutDate = data.rolloutDate;
        break;
      case 'active':
        campaign.status = 'active';
        break;
      case 'completed':
        campaign.status = 'completed';
        break;
    }

    await campaign.save();

    res.json({
      success: true,
      message: `Campaign moved to ${stage} stage`,
      data: campaign
    });
  } catch (error) {
    console.error('Error updating campaign stage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign stage',
      error: error.message
    });
  }
};

// Approve campaign
export const approveCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { isApproved, notes } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    campaign.approval.isApproved = isApproved;
    campaign.approval.approvedBy = req.user._id;
    campaign.approval.approvedAt = new Date();
    campaign.approval.approvalNotes = notes;
    campaign.status = isApproved ? 'approved' : 'rejected';
    campaign.lastModifiedBy = req.user._id;

    await campaign.save();

    res.json({
      success: true,
      message: `Campaign ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: campaign
    });
  } catch (error) {
    console.error('Error approving campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve campaign',
      error: error.message
    });
  }
};

// Delete campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByIdAndDelete(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campaign',
      error: error.message
    });
  }
};

// Get campaign templates
export const getCampaignTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true })
      .select('title description category tags difficulty level estimatedDuration');

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
};

// Calculate campaign metrics
export const getCampaignMetrics = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const metrics = await calculateDetailedCampaignMetrics(campaignId);

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error calculating campaign metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate campaign metrics',
      error: error.message
    });
  }
};

// Helper Functions
const calculateCampaignMetrics = async (campaignId) => {
  try {
    // Get participants count
    const participants = await User.countDocuments({
      'campaigns.campaignId': campaignId
    });

    // Get completion count
    const completed = await User.countDocuments({
      'campaigns.campaignId': campaignId,
      'campaigns.status': 'completed'
    });

    // Get recent activity (last 7 days)
    const recentActivity = await User.countDocuments({
      'campaigns.campaignId': campaignId,
      'campaigns.lastActivity': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    return {
      totalParticipants: participants,
      completedParticipants: completed,
      completionRate: participants > 0 ? (completed / participants) * 100 : 0,
      recentActivity,
      activeParticipants: participants - completed
    };
  } catch (error) {
    console.error('Error calculating quick metrics:', error);
    return {
      totalParticipants: 0,
      completedParticipants: 0,
      completionRate: 0,
      recentActivity: 0,
      activeParticipants: 0
    };
  }
};

const calculateDetailedCampaignMetrics = async (campaignId) => {
  try {
    // Get all participants
    const participants = await User.find({
      'campaigns.campaignId': campaignId
    });

    const participantIds = participants.map(p => p._id);

    // Get game progress for participants
    const gameProgress = await GameProgress.find({
      userId: { $in: participantIds }
    });

    // Get voucher redemptions
    const redemptions = await VoucherRedemption.find({
      studentId: { $in: participantIds },
      status: 'approved'
    }).populate('productId', 'price');

    // Calculate detailed metrics
    const totalParticipants = participants.length;
    const completedParticipants = participants.filter(p => 
      p.campaigns.find(c => c.campaignId.toString() === campaignId.toString())?.status === 'completed'
    ).length;

    const totalSpent = redemptions.reduce((sum, r) => sum + (r.productId?.price || 0), 0);
    const averageEngagementTime = gameProgress.length > 0 ? 
      gameProgress.reduce((sum, g) => sum + (g.timeSpent || 0), 0) / gameProgress.length : 0;

    return {
      totalParticipants,
      completedParticipants,
      completionRate: totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0,
      totalSpent,
      averageEngagementTime,
      dropoutRate: totalParticipants > 0 ? ((totalParticipants - completedParticipants) / totalParticipants) * 100 : 0,
      satisfactionScore: 8.5, // This would come from feedback surveys
      knowledgeImprovement: 75 // This would come from pre/post assessments
    };
  } catch (error) {
    console.error('Error calculating detailed metrics:', error);
    return {
      totalParticipants: 0,
      completedParticipants: 0,
      completionRate: 0,
      totalSpent: 0,
      averageEngagementTime: 0,
      dropoutRate: 0,
      satisfactionScore: 0,
      knowledgeImprovement: 0
    };
  }
};

const getStatusFromStage = (stage) => {
  const statusMap = {
    'scope': 'draft',
    'templates': 'scope_defined',
    'approval': 'pending_approval',
    'pilot': 'pilot',
    'rollout': 'rollout',
    'active': 'active',
    'completed': 'completed'
  };
  return statusMap[stage] || 'draft';
};

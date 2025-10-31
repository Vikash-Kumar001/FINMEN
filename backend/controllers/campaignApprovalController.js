import CampaignApproval from '../models/CampaignApproval.js';
import Campaign from '../models/Campaign.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create campaign approval request
export const createApprovalRequest = async (req, res) => {
  try {
    const {
      campaignId,
      schoolId,
      approvalType,
      campaignDetails,
      schoolReadiness,
      approvalWorkflow
    } = req.body;

    // Validate required fields
    if (!campaignId || !schoolId || !approvalType) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID, School ID, and approval type are required'
      });
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if school exists
    const school = await Organization.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Check if approval already exists
    const existingApproval = await CampaignApproval.findOne({
      campaignId,
      schoolId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApproval) {
      return res.status(400).json({
        success: false,
        message: 'Approval request already exists for this campaign and school'
      });
    }

    // Create approval request
    const approval = new CampaignApproval({
      campaignId,
      schoolId,
      schoolName: school.name,
      schoolType: school.type || 'government',
      approvalType,
      requestedBy: req.user._id,
      schoolAdmin: {
        userId: school.contactPerson,
        name: school.contactPersonName,
        email: school.email,
        phone: school.phone,
        designation: 'Principal'
      },
      approvalWorkflow: approvalWorkflow || {
        steps: [
          {
            stepName: 'School Admin Review',
            stepOrder: 1,
            status: 'pending',
            assignedTo: school.contactPerson
          },
          {
            stepName: 'Infrastructure Assessment',
            stepOrder: 2,
            status: 'pending',
            assignedTo: school.contactPerson
          },
          {
            stepName: 'Final Approval',
            stepOrder: 3,
            status: 'pending',
            assignedTo: school.contactPerson
          }
        ],
        currentStep: 0,
        totalSteps: 3
      },
      campaignDetails: campaignDetails || {
        title: campaign.title,
        description: campaign.description,
        objectives: campaign.objectives,
        targetStudents: campaign.scope.maxParticipants,
        duration: campaign.duration,
        startDate: campaign.timeline.startDate,
        endDate: campaign.timeline.endDate,
        budgetAllocation: campaign.budget.allocatedBudget,
        healCoinsAllocation: campaign.healCoins.allocated,
        requirements: campaign.requirements || [],
        deliverables: campaign.deliverables || []
      },
      schoolReadiness: schoolReadiness || {},
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011',
      createdBy: req.user._id
    });

    await approval.save();

    // Add audit trail
    approval.addAuditEntry(
      'approval_created',
      req.user._id,
      'Campaign approval request created',
      null,
      approval.toObject()
    );

    // Send notification to school admin
    await sendApprovalNotification(approval, 'request_created');

    res.status(201).json({
      success: true,
      message: 'Approval request created successfully',
      data: approval
    });
  } catch (error) {
    console.error('Error creating approval request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create approval request',
      error: error.message
    });
  }
};

// Get approval requests
export const getApprovalRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      approvalType,
      campaignId,
      schoolId
    } = req.query;

    const filter = {
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011'
    };

    if (status) filter.status = status;
    if (approvalType) filter.approvalType = approvalType;
    if (campaignId) filter.campaignId = campaignId;
    if (schoolId) filter.schoolId = schoolId;

    const approvals = await CampaignApproval.find(filter)
      .populate('campaignId', 'title description status')
      .populate('schoolId', 'name type address')
      .populate('requestedBy', 'name email')
      .populate('schoolAdmin.userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CampaignApproval.countDocuments(filter);

    res.json({
      success: true,
      data: approvals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching approval requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval requests',
      error: error.message
    });
  }
};

// Get approval request by ID
export const getApprovalById = async (req, res) => {
  try {
    const { approvalId } = req.params;

    const approval = await CampaignApproval.findById(approvalId)
      .populate('campaignId', 'title description status timeline budget')
      .populate('schoolId', 'name type address contactPerson')
      .populate('requestedBy', 'name email')
      .populate('schoolAdmin.userId', 'name email')
      .populate('decision.approvedBy', 'name email');

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Error fetching approval request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval request',
      error: error.message
    });
  }
};

// Update approval workflow step
export const updateWorkflowStep = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { stepIndex, status, comments, attachments } = req.body;

    const approval = await CampaignApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    // Update workflow step
    approval.updateWorkflow(stepIndex, status, comments, req.user._id);

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      approval.approvalWorkflow.steps[stepIndex].attachments.push(...attachments);
    }

    await approval.save();

    // Add audit trail
    approval.addAuditEntry(
      'workflow_updated',
      req.user._id,
      `Workflow step ${stepIndex + 1} updated to ${status}`,
      null,
      { stepIndex, status, comments }
    );

    // Check if all steps are completed
    const allStepsCompleted = approval.approvalWorkflow.steps.every(step => 
      step.status === 'completed' || step.status === 'skipped'
    );

    if (allStepsCompleted && approval.status === 'pending') {
      // Auto-approve if all steps are completed
      approval.status = 'approved';
      approval.decision = {
        approvedBy: req.user._id,
        approvedAt: new Date(),
        validityPeriod: 365, // 1 year
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      };

      // Update campaign status if it's a pilot
      if (approval.approvalType === 'pilot') {
        await Campaign.findByIdAndUpdate(approval.campaignId, {
          status: 'pilot',
          'timeline.pilotStartDate': new Date()
        });
      }

      await sendApprovalNotification(approval, 'approved');
    }

    await approval.save();

    res.json({
      success: true,
      message: 'Workflow step updated successfully',
      data: approval
    });
  } catch (error) {
    console.error('Error updating workflow step:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update workflow step',
      error: error.message
    });
  }
};

// Approve or reject campaign
export const makeApprovalDecision = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { decision, reason, conditions, validityPeriod } = req.body;

    const approval = await CampaignApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    if (approval.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Approval request is not in pending status'
      });
    }

    // Update approval decision
    approval.status = decision;
    approval.decision = {
      approvedBy: req.user._id,
      approvedAt: new Date(),
      rejectionReason: decision === 'rejected' ? reason : null,
      conditions: conditions || [],
      validityPeriod: validityPeriod || 365,
      expiresAt: decision === 'approved' ? 
        new Date(Date.now() + (validityPeriod || 365) * 24 * 60 * 60 * 1000) : null
    };

    // Update campaign status based on decision
    if (decision === 'approved') {
      if (approval.approvalType === 'pilot') {
        await Campaign.findByIdAndUpdate(approval.campaignId, {
          status: 'pilot',
          'timeline.pilotStartDate': new Date()
        });
      } else if (approval.approvalType === 'full_rollout') {
        await Campaign.findByIdAndUpdate(approval.campaignId, {
          status: 'rollout',
          'timeline.rolloutDate': new Date()
        });
      }
    }

    await approval.save();

    // Add audit trail
    approval.addAuditEntry(
      'decision_made',
      req.user._id,
      `Campaign ${decision} by ${req.user.name}`,
      'pending',
      decision
    );

    // Send notification
    await sendApprovalNotification(approval, decision === 'approved' ? 'approved' : 'rejected');

    res.json({
      success: true,
      message: `Campaign ${decision} successfully`,
      data: approval
    });
  } catch (error) {
    console.error('Error making approval decision:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to make approval decision',
      error: error.message
    });
  }
};

// Update pilot results
export const updatePilotResults = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { pilotResults } = req.body;

    const approval = await CampaignApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    if (approval.approvalType !== 'pilot') {
      return res.status(400).json({
        success: false,
        message: 'This is not a pilot approval'
      });
    }

    // Update pilot results
    approval.pilotResults = {
      ...approval.pilotResults,
      ...pilotResults,
      isPilotCompleted: true,
      pilotEndDate: new Date()
    };

    await approval.save();

    // Add audit trail
    approval.addAuditEntry(
      'pilot_results_updated',
      req.user._id,
      'Pilot results updated',
      null,
      pilotResults
    );

    res.json({
      success: true,
      message: 'Pilot results updated successfully',
      data: approval
    });
  } catch (error) {
    console.error('Error updating pilot results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pilot results',
      error: error.message
    });
  }
};

// Get approval statistics
export const getApprovalStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchCriteria = {
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011'
    };

    if (startDate || endDate) {
      matchCriteria.createdAt = {};
      if (startDate) matchCriteria.createdAt.$gte = new Date(startDate);
      if (endDate) matchCriteria.createdAt.$lte = new Date(endDate);
    }

    const stats = await CampaignApproval.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const approvalTypes = await CampaignApproval.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$approvalType',
          count: { $sum: 1 }
        }
      }
    ]);

    const schoolTypes = await CampaignApproval.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$schoolType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        approvalTypes,
        schoolTypes,
        totalApprovals: stats.reduce((sum, stat) => sum + stat.count, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approval statistics',
      error: error.message
    });
  }
};

// Helper function to send approval notifications
async function sendApprovalNotification(approval, type) {
  try {
    const messages = {
      request_created: `New approval request for campaign "${approval.campaignDetails.title}" at ${approval.schoolName}`,
      approved: `Campaign "${approval.campaignDetails.title}" has been approved for ${approval.schoolName}`,
      rejected: `Campaign "${approval.campaignDetails.title}" has been rejected for ${approval.schoolName}`
    };

    approval.notifications.push({
      type: 'approval_update',
      message: messages[type] || 'Approval status updated',
      priority: type === 'rejected' ? 'high' : 'medium',
      sentTo: [approval.schoolAdmin.userId],
      sentAt: new Date()
    });

    await approval.save();
  } catch (error) {
    console.error('Error sending approval notification:', error);
  }
}

export default {
  createApprovalRequest,
  getApprovalRequests,
  getApprovalById,
  updateWorkflowStep,
  makeApprovalDecision,
  updatePilotResults,
  getApprovalStats
};

import Campaign from '../models/Campaign.js';
import CampaignTemplate from '../models/CampaignTemplate.js';
import CampaignApproval from '../models/CampaignApproval.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Step 1: Define Campaign Scope
export const defineScope = async (req, res) => {
  try {
    const {
      title,
      description,
      scopeType, // 'single_school', 'multi_school', 'district'
      targetSchools,
      targetDistricts,
      gradeLevels,
      maxParticipants,
      minParticipants,
      objectives,
      priority
    } = req.body;

    // Validate scope data
    if (!title || !description || !scopeType) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and scope type are required'
      });
    }

    // Create or update campaign
    let campaign;
    if (req.body.campaignId) {
      campaign = await Campaign.findById(req.body.campaignId);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
    } else {
      campaign = new Campaign({
        title,
        description,
        createdBy: req.user._id,
        organizationId: req.user.organizationId
      });
    }

    // Update scope information
    campaign.scope = {
      type: scopeType,
      targetSchools: targetSchools || [],
      targetDistricts: targetDistricts || [],
      gradeLevels: gradeLevels || [],
      maxParticipants: maxParticipants || 1000,
      minParticipants: minParticipants || 10
    };

    campaign.objectives = objectives || [];
    campaign.priority = priority || 'medium';
    campaign.workflowStage = 'scope';
    campaign.status = 'scope_defined';

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign scope defined successfully',
      data: campaign,
      nextStep: 'templates'
    });
  } catch (error) {
    console.error('Error defining campaign scope:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to define campaign scope',
      error: error.message
    });
  }
};

// Step 2: Select Templates
export const selectTemplates = async (req, res) => {
  try {
    const { campaignId, templateIds, customTemplateRequest } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Get template details
    const templates = await CampaignTemplate.find({
      _id: { $in: templateIds },
      status: 'approved'
    });

    if (templates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid templates found'
      });
    }

    // Update campaign with selected templates
    campaign.templates = templates.map(template => ({
      templateId: template._id,
      templateName: template.name,
      category: template.category,
      weight: 1,
      isRequired: false
    }));

    // Handle custom template request
    if (customTemplateRequest) {
      campaign.customTemplateRequest = {
        description: customTemplateRequest.description,
        requirements: customTemplateRequest.requirements,
        assets: customTemplateRequest.assets || [],
        requestedAt: new Date(),
        status: 'pending'
      };
    }

    campaign.workflowStage = 'templates';
    campaign.status = 'templates_selected';

    await campaign.save();

    res.json({
      success: true,
      message: 'Templates selected successfully',
      data: {
        campaign,
        templates,
        customTemplateRequest: campaign.customTemplateRequest
      },
      nextStep: 'pilot'
    });
  } catch (error) {
    console.error('Error selecting templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to select templates',
      error: error.message
    });
  }
};

// Step 3: Configure Pilot
export const configurePilot = async (req, res) => {
  try {
    const {
      campaignId,
      pilotRequired,
      pilotSchools,
      pilotDuration,
      pilotStartDate,
      pilotEndDate,
      pilotObjectives,
      pilotMetrics
    } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Configure pilot settings
    campaign.pilot = {
      required: pilotRequired || false,
      schools: pilotSchools || [],
      duration: pilotDuration || 14, // days
      startDate: pilotStartDate ? new Date(pilotStartDate) : null,
      endDate: pilotEndDate ? new Date(pilotEndDate) : null,
      objectives: pilotObjectives || [],
      metrics: pilotMetrics || {},
      status: 'not_started'
    };

    // Update timeline if pilot dates are provided
    if (pilotStartDate && pilotEndDate) {
      campaign.timeline.pilotStartDate = new Date(pilotStartDate);
      campaign.timeline.pilotEndDate = new Date(pilotEndDate);
    }

    campaign.workflowStage = 'pilot';
    campaign.status = pilotRequired ? 'pilot' : 'approved';

    await campaign.save();

    res.json({
      success: true,
      message: 'Pilot configuration saved successfully',
      data: campaign,
      nextStep: 'budget'
    });
  } catch (error) {
    console.error('Error configuring pilot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to configure pilot',
      error: error.message
    });
  }
};

// Step 4: Set Budget
export const setBudget = async (req, res) => {
  try {
    const {
      campaignId,
      budgetType, // 'healcoins_pool' or 'per_student_cap'
      totalBudget,
      healCoinsPool,
      perStudentRewardCap,
      budgetBreakdown,
      fundingSource
    } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Set budget information
    campaign.budget = {
      type: budgetType,
      totalBudget: totalBudget || 0,
      allocatedBudget: totalBudget || 0,
      spentBudget: 0,
      remainingBudget: totalBudget || 0,
      currency: 'INR',
      budgetBreakdown: budgetBreakdown || [],
      fundingSource: fundingSource || 'organization'
    };

    // Set HealCoins configuration
    if (budgetType === 'healcoins_pool') {
      campaign.healCoins.totalFunded = healCoinsPool || 0;
      campaign.healCoins.remaining = healCoinsPool || 0;
    } else if (budgetType === 'per_student_cap') {
      const estimatedParticipants = campaign.scope.maxParticipants || 100;
      campaign.healCoins.totalFunded = (perStudentRewardCap || 50) * estimatedParticipants;
      campaign.healCoins.remaining = campaign.healCoins.totalFunded;
    }

    campaign.workflowStage = 'budget';
    campaign.status = 'budget_set';

    await campaign.save();

    res.json({
      success: true,
      message: 'Budget configuration saved successfully',
      data: campaign,
      nextStep: 'approval'
    });
  } catch (error) {
    console.error('Error setting budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set budget',
      error: error.message
    });
  }
};

// Step 5: Request Approvals
export const requestApprovals = async (req, res) => {
  try {
    const {
      campaignId,
      approvalType, // 'school_admin', 'district_admin', 'central_admin'
      requiredApprovals,
      approvalDeadline
    } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Create approval requests based on campaign scope
    const approvalRequests = [];

    if (campaign.scope.type === 'single_school') {
      // Single school approval
      const approval = new CampaignApproval({
        campaignId: campaign._id,
        schoolId: campaign.scope.targetSchools[0],
        approvalType: 'school_admin',
        requestedBy: req.user._id,
        status: 'pending',
        expiresAt: approvalDeadline ? new Date(approvalDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      await approval.save();
      approvalRequests.push(approval);
    } else if (campaign.scope.type === 'multi_school') {
      // Multiple school approvals
      for (const schoolId of campaign.scope.targetSchools) {
        const approval = new CampaignApproval({
          campaignId: campaign._id,
          schoolId: schoolId,
          approvalType: 'school_admin',
          requestedBy: req.user._id,
          status: 'pending',
          expiresAt: approvalDeadline ? new Date(approvalDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
        await approval.save();
        approvalRequests.push(approval);
      }
    } else if (campaign.scope.type === 'district') {
      // District-level approval
      const approval = new CampaignApproval({
        campaignId: campaign._id,
        organizationId: campaign.organizationId,
        approvalType: 'district_admin',
        requestedBy: req.user._id,
        status: 'pending',
        expiresAt: approvalDeadline ? new Date(approvalDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      await approval.save();
      approvalRequests.push(approval);
    }

    // Update campaign status
    campaign.timeline.approvalDeadline = approvalDeadline ? new Date(approvalDeadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    campaign.workflowStage = 'approval';
    campaign.status = 'pending_approval';

    await campaign.save();

    res.json({
      success: true,
      message: 'Approval requests created successfully',
      data: {
        campaign,
        approvalRequests
      },
      nextStep: 'monitoring'
    });
  } catch (error) {
    console.error('Error requesting approvals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request approvals',
      error: error.message
    });
  }
};

// Step 6: Launch & Monitor
export const launchCampaign = async (req, res) => {
  try {
    const { campaignId, launchDate } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if all required approvals are obtained
    const pendingApprovals = await CampaignApproval.find({
      campaignId: campaign._id,
      status: 'pending'
    });

    if (pendingApprovals.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot launch campaign with pending approvals',
        pendingApprovals: pendingApprovals.length
      });
    }

    // Launch campaign
    campaign.status = 'active';
    campaign.workflowStage = 'active';
    campaign.timeline.rolloutDate = launchDate ? new Date(launchDate) : new Date();

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign launched successfully',
      data: campaign,
      nextStep: 'reporting'
    });
  } catch (error) {
    console.error('Error launching campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to launch campaign',
      error: error.message
    });
  }
};

// Get Campaign Templates
export const getTemplates = async (req, res) => {
  try {
    const { category, gradeLevel, templateType } = req.query;

    const filter = { status: 'approved' };
    if (category) filter.category = category;
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (templateType) filter.templateType = templateType;

    const templates = await CampaignTemplate.find(filter)
      .sort({ 'usageStats.timesUsed': -1 })
      .limit(50);

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

// Get Campaign Monitoring Data
export const getMonitoringData = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Get real-time metrics (mock data for now)
    const monitoringData = {
      campaign: campaign,
      realTimeMetrics: {
        totalParticipants: campaign.metrics.totalParticipants || 0,
        activeParticipants: campaign.metrics.activeParticipants || 0,
        completedParticipants: campaign.metrics.completedParticipants || 0,
        engagementRate: campaign.metrics.engagementRate || 0,
        completionRate: campaign.completionPercentage || 0,
        averageSessionDuration: campaign.metrics.averageEngagementTime || 0
      },
      schoolBreakdown: campaign.scope.targetSchools.map(schoolId => ({
        schoolId,
        participants: Math.floor(Math.random() * 100),
        completionRate: Math.floor(Math.random() * 100),
        engagementScore: Math.floor(Math.random() * 100)
      })),
      gradeBreakdown: campaign.scope.gradeLevels.map(grade => ({
        grade,
        participants: Math.floor(Math.random() * 50),
        completionRate: Math.floor(Math.random() * 100),
        averageScore: Math.floor(Math.random() * 100)
      })),
      recentActivity: [
        {
          timestamp: new Date(),
          type: 'completion',
          message: 'Student completed Financial Literacy module',
          studentId: 'mock_student_1'
        },
        {
          timestamp: new Date(Date.now() - 3600000),
          type: 'engagement',
          message: 'High engagement detected in Grade 7',
          grade: '7'
        }
      ]
    };

    res.json({
      success: true,
      data: monitoringData
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monitoring data',
      error: error.message
    });
  }
};

// Generate Campaign Report
export const generateReport = async (req, res) => {
  try {
    const { campaignId, reportType = 'comprehensive' } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Generate comprehensive report
    const report = {
      campaign: {
        title: campaign.title,
        description: campaign.description,
        status: campaign.status,
        duration: campaign.duration,
        startDate: campaign.timeline.startDate,
        endDate: campaign.timeline.endDate
      },
      metrics: {
        totalParticipants: campaign.metrics.totalParticipants,
        completionRate: campaign.completionPercentage,
        engagementRate: campaign.metrics.engagementRate,
        satisfactionScore: campaign.metrics.satisfactionScore,
        knowledgeImprovement: campaign.metrics.knowledgeImprovement
      },
      nepMapping: {
        competenciesCovered: campaign.templates.length,
        domains: [...new Set(campaign.templates.map(t => t.category))],
        gradeLevels: campaign.scope.gradeLevels
      },
      certificates: {
        totalIssued: campaign.metrics.completedParticipants,
        byCategory: campaign.templates.map(template => ({
          category: template.category,
          count: Math.floor(campaign.metrics.completedParticipants / campaign.templates.length)
        }))
      },
      impact: {
        schoolsReached: campaign.scope.targetSchools.length,
        studentsImpacted: campaign.metrics.totalParticipants,
        budgetUtilization: ((campaign.budget.spentBudget / campaign.budget.totalBudget) * 100).toFixed(2),
        healCoinsDistributed: campaign.healCoins.spent
      },
      recommendations: [
        'Continue similar campaigns in other schools',
        'Expand to additional grade levels',
        'Increase HealCoins rewards for better engagement'
      ]
    };

    res.json({
      success: true,
      data: report,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

import BudgetAlert from '../models/BudgetAlert.js';
import Campaign from '../models/Campaign.js';
import SpendLedger from '../models/SpendLedger.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Get live budget tracking for organization
export const getLiveBudgetTracking = async (req, res) => {
  try {
    const { campaignId, includeAlerts = true } = req.query;

    // Get campaigns
    const campaigns = campaignId && campaignId !== 'undefined' ? 
      await Campaign.findById(campaignId) :
      await Campaign.find({ 
        organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011',
        status: { $in: ['active', 'pilot', 'rollout'] }
      });

    if (!campaigns || (Array.isArray(campaigns) && campaigns.length === 0)) {
      return res.json({
        success: true,
        data: {
          campaigns: [],
          totalBudget: 0,
          totalSpent: 0,
          totalRemaining: 0,
          alerts: []
        }
      });
    }

    const campaignList = Array.isArray(campaigns) ? campaigns : [campaigns];
    const budgetData = [];

    for (const campaign of campaignList) {
      // Get spend data for this campaign
      const spendData = await SpendLedger.aggregate([
        {
          $match: {
            organizationId: new mongoose.Types.ObjectId(req.user?.organizationId || '507f1f77bcf86cd799439011'),
            campaignId: campaign._id,
            direction: 'outbound'
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$amount' },
            totalHealCoinsSpent: { $sum: '$healCoinsAmount' },
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      const spent = spendData[0]?.totalSpent || 0;
      const healCoinsSpent = spendData[0]?.totalHealCoinsSpent || 0;
      const remaining = campaign.budget.totalBudget - spent;
      const spendPercentage = (spent / campaign.budget.totalBudget) * 100;

      // Get recent transactions
      const recentTransactions = await SpendLedger.find({
        organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011',
        campaignId: campaign._id,
        direction: 'outbound'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name email');

      budgetData.push({
        campaignId: campaign._id,
        campaignName: campaign.title,
        budget: {
          total: campaign.budget.totalBudget,
          allocated: campaign.budget.allocatedBudget,
          spent: spent,
          remaining: remaining,
          spendPercentage: Math.round(spendPercentage * 100) / 100
        },
        healCoins: {
          total: campaign.healCoins.totalFunded,
          allocated: campaign.healCoins.allocated,
          spent: healCoinsSpent,
          remaining: campaign.healCoins.totalFunded - healCoinsSpent
        },
        status: getBudgetStatus(spendPercentage),
        recentTransactions,
        lastUpdated: new Date()
      });
    }

    // Get active alerts if requested
    let alerts = [];
    if (includeAlerts === 'true') {
      alerts = await BudgetAlert.find({
        organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011',
        status: { $in: ['active', 'acknowledged'] }
      })
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);
    }

    // Calculate totals
    const totalBudget = campaignList.reduce((sum, campaign) => sum + campaign.budget.totalBudget, 0);
    const totalSpent = budgetData.reduce((sum, data) => sum + data.budget.spent, 0);
    const totalRemaining = totalBudget - totalSpent;

    res.json({
      success: true,
      data: {
        campaigns: budgetData,
        totalBudget,
        totalSpent,
        totalRemaining,
        overallSpendPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        alerts,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching live budget tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live budget tracking',
      error: error.message
    });
  }
};

// Get budget alerts
export const getBudgetAlerts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      alertType,
      severity,
      campaignId
    } = req.query;

    const filter = {
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011'
    };

    if (status) filter.status = status;
    if (alertType) filter.alertType = alertType;
    if (severity) filter['alertDetails.severity'] = severity;
    if (campaignId) filter.campaignId = campaignId;

    const alerts = await BudgetAlert.find(filter)
      .populate('campaignId', 'title')
      .populate('createdBy', 'name email')
      .populate('acknowledgment.acknowledgedBy', 'name email')
      .populate('resolution.resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BudgetAlert.countDocuments(filter);

    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching budget alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget alerts',
      error: error.message
    });
  }
};

// Acknowledge budget alert
export const acknowledgeAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes, action } = req.body;

    const alert = await BudgetAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.acknowledge(req.user._id, notes, action);
    await alert.save();

    res.json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to acknowledge alert',
      error: error.message
    });
  }
};

// Resolve budget alert
export const resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes, action } = req.body;

    const alert = await BudgetAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    alert.resolve(req.user._id, notes, action);
    await alert.save();

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve alert',
      error: error.message
    });
  }
};

// Create budget alert manually
export const createBudgetAlert = async (req, res) => {
  try {
    const {
      campaignId,
      alertType,
      budgetInfo,
      healCoinsInfo,
      alertDetails,
      notificationSettings
    } = req.body;

    const alert = new BudgetAlert({
      organizationId: req.user?.organizationId || '507f1f77bcf86cd799439011',
      campaignId,
      alertType,
      budgetInfo,
      healCoinsInfo,
      alertDetails,
      notificationSettings: notificationSettings || {
        emailEnabled: true,
        smsEnabled: false,
        inAppEnabled: true,
        recipients: [{
          userId: req.user._id,
          email: req.user.email,
          role: 'admin'
        }]
      },
      createdBy: req.user._id
    });

    await alert.save();

    res.status(201).json({
      success: true,
      message: 'Budget alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Error creating budget alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create budget alert',
      error: error.message
    });
  }
};

// Check and create threshold alerts
export const checkThresholdAlerts = async (req, res) => {
  try {
    const { campaignId } = req.query;

    const alerts = await BudgetAlert.checkThresholdAlerts(
      req.user?.organizationId || '507f1f77bcf86cd799439011',
      campaignId
    );

    // Save new alerts
    const savedAlerts = [];
    for (const alert of alerts) {
      await alert.save();
      savedAlerts.push(alert);
    }

    res.json({
      success: true,
      message: `Created ${savedAlerts.length} new threshold alerts`,
      data: savedAlerts
    });
  } catch (error) {
    console.error('Error checking threshold alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check threshold alerts',
      error: error.message
    });
  }
};

// Get budget analytics
export const getBudgetAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, campaignId } = req.query;

    const matchCriteria = {
      organizationId: new mongoose.Types.ObjectId(req.user.organizationId),
      direction: 'outbound'
    };

    if (campaignId) {
      matchCriteria.campaignId = new mongoose.Types.ObjectId(campaignId);
    }

    if (startDate || endDate) {
      matchCriteria.createdAt = {};
      if (startDate) matchCriteria.createdAt.$gte = new Date(startDate);
      if (endDate) matchCriteria.createdAt.$lte = new Date(endDate);
    }

    // Get spending by category
    const spendingByCategory = await SpendLedger.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          totalHealCoins: { $sum: '$healCoinsAmount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Get spending by month
    const spendingByMonth = await SpendLedger.aggregate([
      { $match: matchCriteria },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' },
          totalHealCoins: { $sum: '$healCoinsAmount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get spending by campaign
    const spendingByCampaign = await SpendLedger.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign'
        }
      },
      {
        $group: {
          _id: '$campaignId',
          campaignName: { $first: { $arrayElemAt: ['$campaign.title', 0] } },
          totalAmount: { $sum: '$amount' },
          totalHealCoins: { $sum: '$healCoinsAmount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Get alert statistics
    const alertStats = await BudgetAlert.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user?.organizationId || '507f1f77bcf86cd799439011')
        }
      },
      {
        $group: {
          _id: '$alertType',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        spendingByCategory,
        spendingByMonth,
        spendingByCampaign,
        alertStats,
        period: {
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching budget analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget analytics',
      error: error.message
    });
  }
};

// Helper function to determine budget status
function getBudgetStatus(spendPercentage) {
  if (spendPercentage >= 100) return 'exceeded';
  if (spendPercentage >= 95) return 'critical';
  if (spendPercentage >= 80) return 'warning';
  if (spendPercentage >= 60) return 'moderate';
  return 'healthy';
}

export default {
  getLiveBudgetTracking,
  getBudgetAlerts,
  acknowledgeAlert,
  resolveAlert,
  createBudgetAlert,
  checkThresholdAlerts,
  getBudgetAnalytics
};

// Mock Budget Tracking Controller
// This provides mock data without requiring database connections

// Get live budget tracking (Mock)
export const getLiveBudgetTracking = async (req, res) => {
  try {
    console.log('getLiveBudgetTracking (MOCK) called with:', req.query);
    
    const { campaignId, includeAlerts = true } = req.query;

    // Mock budget data
    const mockCampaigns = [
      {
        campaignId: 'mock_campaign_1',
        campaignName: 'Financial Literacy Drive',
        budget: {
          total: 100000,
          allocated: 80000,
          spent: 65000,
          remaining: 35000,
          spendPercentage: 65.0
        },
        healCoins: {
          total: 20000,
          allocated: 15000,
          spent: 12000,
          remaining: 8000
        },
        status: 'moderate',
        recentTransactions: [
          {
            description: 'Student rewards distribution',
            amount: 5000,
            createdAt: new Date('2024-01-20')
          },
          {
            description: 'Teacher training materials',
            amount: 3000,
            createdAt: new Date('2024-01-19')
          },
          {
            description: 'Platform fees',
            amount: 2000,
            createdAt: new Date('2024-01-18')
          }
        ],
        lastUpdated: new Date()
      },
      {
        campaignId: 'mock_campaign_2',
        campaignName: 'Mental Wellness Program',
        budget: {
          total: 150000,
          allocated: 120000,
          spent: 125000,
          remaining: 25000,
          spendPercentage: 83.3
        },
        healCoins: {
          total: 30000,
          allocated: 25000,
          spent: 24000,
          remaining: 6000
        },
        status: 'warning',
        recentTransactions: [
          {
            description: 'Counselor fees',
            amount: 15000,
            createdAt: new Date('2024-01-21')
          },
          {
            description: 'Workshop materials',
            amount: 8000,
            createdAt: new Date('2024-01-20')
          },
          {
            description: 'Student incentives',
            amount: 12000,
            createdAt: new Date('2024-01-19')
          }
        ],
        lastUpdated: new Date()
      },
      {
        campaignId: 'mock_campaign_3',
        campaignName: 'Values Education Initiative',
        budget: {
          total: 80000,
          allocated: 60000,
          spent: 85000,
          remaining: -5000,
          spendPercentage: 106.3
        },
        healCoins: {
          total: 15000,
          allocated: 12000,
          spent: 15000,
          remaining: 0
        },
        status: 'exceeded',
        recentTransactions: [
          {
            description: 'Emergency budget allocation',
            amount: 10000,
            createdAt: new Date('2024-01-22')
          },
          {
            description: 'Additional materials',
            amount: 5000,
            createdAt: new Date('2024-01-21')
          },
          {
            description: 'Transportation costs',
            amount: 3000,
            createdAt: new Date('2024-01-20')
          }
        ],
        lastUpdated: new Date()
      }
    ];

    // Filter by campaign if specified
    const filteredCampaigns = campaignId && campaignId !== 'all' 
      ? mockCampaigns.filter(c => c.campaignId === campaignId)
      : mockCampaigns;

    // Calculate totals
    const totalBudget = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget.total, 0);
    const totalSpent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.budget.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const overallSpendPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Mock alerts
    const mockAlerts = includeAlerts === 'true' ? [
      {
        _id: 'mock_alert_1',
        alertType: 'threshold_warning',
        campaignId: 'mock_campaign_2',
        campaignName: 'Mental Wellness Program',
        budgetInfo: {
          totalBudget: 150000,
          spentBudget: 125000,
          remainingBudget: 25000,
          thresholdPercentage: 80,
          thresholdAmount: 120000
        },
        alertDetails: {
          title: 'Budget 80% Threshold Reached',
          message: 'Campaign "Mental Wellness Program" has reached 80% of its budget (₹125,000 of ₹150,000)',
          severity: 'high',
          currentSpendPercentage: 83.3,
          recommendedAction: 'Consider budget adjustment or campaign scope review'
        },
        status: 'active',
        createdAt: new Date('2024-01-21')
      },
      {
        _id: 'mock_alert_2',
        alertType: 'budget_exceeded',
        campaignId: 'mock_campaign_3',
        campaignName: 'Values Education Initiative',
        budgetInfo: {
          totalBudget: 80000,
          spentBudget: 85000,
          remainingBudget: -5000,
          thresholdPercentage: 100,
          thresholdAmount: 80000
        },
        alertDetails: {
          title: 'Budget Exceeded',
          message: 'Campaign "Values Education Initiative" has exceeded its budget by ₹5,000',
          severity: 'critical',
          currentSpendPercentage: 106.3,
          recommendedAction: 'Immediate budget review and additional funding required'
        },
        status: 'active',
        createdAt: new Date('2024-01-22')
      }
    ] : [];

    res.json({
      success: true,
      data: {
        campaigns: filteredCampaigns,
        totalBudget,
        totalSpent,
        totalRemaining,
        overallSpendPercentage: Math.round(overallSpendPercentage * 100) / 100,
        alerts: mockAlerts,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching live budget tracking (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live budget tracking',
      error: error.message
    });
  }
};

// Get budget alerts (Mock)
export const getBudgetAlerts = async (req, res) => {
  try {
    console.log('getBudgetAlerts (MOCK) called with:', req.query);
    
    const { page = 1, limit = 10, status, alertType, severity } = req.query;

    // Mock alerts data
    const mockAlerts = [
      {
        _id: 'mock_alert_1',
        alertType: 'threshold_warning',
        campaignId: {
          _id: 'mock_campaign_2',
          title: 'Mental Wellness Program'
        },
        budgetInfo: {
          totalBudget: 150000,
          spentBudget: 125000,
          remainingBudget: 25000,
          thresholdPercentage: 80,
          thresholdAmount: 120000,
          currency: 'INR'
        },
        alertDetails: {
          title: 'Budget 80% Threshold Reached',
          message: 'Campaign "Mental Wellness Program" has reached 80% of its budget',
          severity: 'high',
          currentSpendPercentage: 83.3,
          recommendedAction: 'Consider budget adjustment or campaign scope review'
        },
        status: 'active',
        createdBy: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date('2024-01-21')
      },
      {
        _id: 'mock_alert_2',
        alertType: 'budget_exceeded',
        campaignId: {
          _id: 'mock_campaign_3',
          title: 'Values Education Initiative'
        },
        budgetInfo: {
          totalBudget: 80000,
          spentBudget: 85000,
          remainingBudget: -5000,
          thresholdPercentage: 100,
          thresholdAmount: 80000,
          currency: 'INR'
        },
        alertDetails: {
          title: 'Budget Exceeded',
          message: 'Campaign "Values Education Initiative" has exceeded its budget by ₹5,000',
          severity: 'critical',
          currentSpendPercentage: 106.3,
          recommendedAction: 'Immediate budget review and additional funding required'
        },
        status: 'active',
        createdBy: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date('2024-01-22')
      },
      {
        _id: 'mock_alert_3',
        alertType: 'threshold_warning',
        campaignId: {
          _id: 'mock_campaign_1',
          title: 'Financial Literacy Drive'
        },
        budgetInfo: {
          totalBudget: 100000,
          spentBudget: 75000,
          remainingBudget: 25000,
          thresholdPercentage: 80,
          thresholdAmount: 80000,
          currency: 'INR'
        },
        alertDetails: {
          title: 'Budget 80% Threshold Approaching',
          message: 'Campaign "Financial Literacy Drive" is approaching 80% of its budget',
          severity: 'medium',
          currentSpendPercentage: 75.0,
          recommendedAction: 'Monitor spending closely'
        },
        status: 'acknowledged',
        acknowledgment: {
          acknowledgedBy: {
            _id: 'mock_user_2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          acknowledgedAt: new Date('2024-01-20'),
          acknowledgmentNotes: 'Monitoring budget closely',
          actionTaken: 'Reduced non-essential expenses'
        },
        createdBy: {
          _id: 'mock_user_1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        createdAt: new Date('2024-01-19')
      }
    ];

    // Filter based on query parameters
    let filteredAlerts = mockAlerts;
    
    if (status && status !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }
    
    if (alertType && alertType !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.alertType === alertType);
    }
    
    if (severity && severity !== 'all') {
      filteredAlerts = filteredAlerts.filter(alert => alert.alertDetails.severity === severity);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedAlerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredAlerts.length,
        totalPages: Math.ceil(filteredAlerts.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching budget alerts (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget alerts',
      error: error.message
    });
  }
};

// Acknowledge alert (Mock)
export const acknowledgeAlert = async (req, res) => {
  try {
    console.log('acknowledgeAlert (MOCK) called with:', req.params, req.body);
    
    const { alertId } = req.params;
    const { notes, action } = req.body;

    // Mock acknowledgment
    const mockAlert = {
      _id: alertId,
      status: 'acknowledged',
      acknowledgment: {
        acknowledgedBy: 'mock_user_1',
        acknowledgedAt: new Date(),
        acknowledgmentNotes: notes || 'Alert acknowledged',
        actionTaken: action || 'Monitoring budget closely'
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: mockAlert
    });
  } catch (error) {
    console.error('Error acknowledging alert (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to acknowledge alert',
      error: error.message
    });
  }
};

// Resolve alert (Mock)
export const resolveAlert = async (req, res) => {
  try {
    console.log('resolveAlert (MOCK) called with:', req.params, req.body);
    
    const { alertId } = req.params;
    const { notes, action } = req.body;

    // Mock resolution
    const mockAlert = {
      _id: alertId,
      status: 'resolved',
      resolution: {
        resolvedBy: 'mock_user_1',
        resolvedAt: new Date(),
        resolutionNotes: notes || 'Alert resolved',
        resolutionAction: action || 'Budget adjusted'
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: mockAlert
    });
  } catch (error) {
    console.error('Error resolving alert (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve alert',
      error: error.message
    });
  }
};

// Create budget alert (Mock)
export const createBudgetAlert = async (req, res) => {
  try {
    console.log('createBudgetAlert (MOCK) called with:', req.body);
    
    const {
      campaignId,
      alertType,
      budgetInfo,
      healCoinsInfo,
      alertDetails,
      notificationSettings
    } = req.body;

    // Mock alert creation
    const mockAlert = {
      _id: 'mock_alert_' + Date.now(),
      alertId: `ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      alertType: alertType || 'threshold_warning',
      campaignId: campaignId || 'mock_campaign_1',
      budgetInfo: budgetInfo || {
        totalBudget: 100000,
        spentBudget: 80000,
        remainingBudget: 20000,
        thresholdPercentage: 80,
        thresholdAmount: 80000,
        currency: 'INR'
      },
      healCoinsInfo: healCoinsInfo || {
        totalHealCoins: 20000,
        spentHealCoins: 16000,
        remainingHealCoins: 4000,
        thresholdPercentage: 80,
        thresholdAmount: 16000
      },
      alertDetails: alertDetails || {
        title: 'Budget Threshold Alert',
        message: 'Campaign has reached 80% of its budget',
        severity: 'medium',
        currentSpendPercentage: 80.0,
        recommendedAction: 'Monitor spending closely'
      },
      status: 'active',
      notificationSettings: notificationSettings || {
        emailEnabled: true,
        smsEnabled: false,
        inAppEnabled: true,
        recipients: [{
          userId: 'mock_user_1',
          email: 'admin@example.com',
          role: 'admin'
        }]
      },
      createdBy: 'mock_user_1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Budget alert created successfully',
      data: mockAlert
    });
  } catch (error) {
    console.error('Error creating budget alert (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create budget alert',
      error: error.message
    });
  }
};

// Check threshold alerts (Mock)
export const checkThresholdAlerts = async (req, res) => {
  try {
    console.log('checkThresholdAlerts (MOCK) called with:', req.query);
    
    const { campaignId } = req.query;

    // Mock threshold check results
    const mockAlerts = [
      {
        _id: 'mock_alert_' + Date.now(),
        alertType: 'threshold_warning',
        campaignId: campaignId || 'mock_campaign_1',
        budgetInfo: {
          totalBudget: 100000,
          spentBudget: 85000,
          remainingBudget: 15000,
          thresholdPercentage: 80,
          thresholdAmount: 80000,
          currency: 'INR'
        },
        alertDetails: {
          title: 'Budget 80% Threshold Reached',
          message: 'Campaign has reached 80% of its budget (₹85,000 of ₹100,000)',
          severity: 'high',
          currentSpendPercentage: 85.0,
          recommendedAction: 'Consider budget adjustment or campaign scope review'
        },
        status: 'active',
        createdBy: 'mock_user_1',
        createdAt: new Date()
      }
    ];

    res.json({
      success: true,
      message: `Created ${mockAlerts.length} new threshold alerts`,
      data: mockAlerts
    });
  } catch (error) {
    console.error('Error checking threshold alerts (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check threshold alerts',
      error: error.message
    });
  }
};

// Get budget analytics (Mock)
export const getBudgetAnalytics = async (req, res) => {
  try {
    console.log('getBudgetAnalytics (MOCK) called with:', req.query);
    
    const { startDate, endDate, campaignId } = req.query;

    // Mock analytics data
    const mockAnalytics = {
      spendingByCategory: [
        { _id: 'campaign_funding', totalAmount: 200000, totalHealCoins: 50000, transactionCount: 15 },
        { _id: 'student_rewards', totalAmount: 150000, totalHealCoins: 30000, transactionCount: 120 },
        { _id: 'platform_fees', totalAmount: 50000, totalHealCoins: 10000, transactionCount: 8 },
        { _id: 'teacher_training', totalAmount: 75000, totalHealCoins: 15000, transactionCount: 12 }
      ],
      spendingByMonth: [
        { _id: { year: 2024, month: 1 }, totalAmount: 125000, totalHealCoins: 25000, transactionCount: 25 },
        { _id: { year: 2024, month: 2 }, totalAmount: 150000, totalHealCoins: 30000, transactionCount: 30 },
        { _id: { year: 2024, month: 3 }, totalAmount: 100000, totalHealCoins: 20000, transactionCount: 20 }
      ],
      spendingByCampaign: [
        { _id: 'mock_campaign_1', campaignName: 'Financial Literacy Drive', totalAmount: 200000, totalHealCoins: 40000, transactionCount: 35 },
        { _id: 'mock_campaign_2', campaignName: 'Mental Wellness Program', totalAmount: 180000, totalHealCoins: 36000, transactionCount: 28 },
        { _id: 'mock_campaign_3', campaignName: 'Values Education Initiative', totalAmount: 120000, totalHealCoins: 24000, transactionCount: 22 }
      ],
      alertStats: [
        { _id: 'threshold_warning', count: 8, activeCount: 3 },
        { _id: 'budget_exceeded', count: 2, activeCount: 1 },
        { _id: 'low_balance', count: 5, activeCount: 2 }
      ],
      period: {
        startDate: startDate ? new Date(startDate) : new Date('2024-01-01'),
        endDate: endDate ? new Date(endDate) : new Date()
      }
    };

    res.json({
      success: true,
      data: mockAnalytics
    });
  } catch (error) {
    console.error('Error fetching budget analytics (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget analytics',
      error: error.message
    });
  }
};

export default {
  getLiveBudgetTracking,
  getBudgetAlerts,
  acknowledgeAlert,
  resolveAlert,
  createBudgetAlert,
  checkThresholdAlerts,
  getBudgetAnalytics
};

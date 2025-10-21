// Mock Budget Transaction Controller
// This provides mock data without requiring database connections

// Get budget summary and transactions
export const getBudgetSummary = async (req, res) => {
  try {
    console.log('getBudgetSummary (MOCK) called with:', req.query);
    
    const { 
      organizationId,
      startDate,
      endDate,
      campaignId,
      type
    } = req.query;

    // Mock budget summary data
    const budgetSummary = {
      totalBudget: 1000000,
      totalSpent: 750000,
      remainingBudget: 250000,
      healCoinsSummary: {
        totalFunded: 500000,
        totalSpent: 375000,
        totalRewards: 300000,
        totalAdminFees: 45000,
        totalOperationalCosts: 30000,
        availableBalance: 125000,
        utilizationRate: 75.0
      },
      monthlyTrends: [
        { month: 'Jun', year: 2024, total: 120000, rewards: 84000, admin: 12000, operational: 8000 },
        { month: 'Jul', year: 2024, total: 135000, rewards: 94500, admin: 13500, operational: 9000 },
        { month: 'Aug', year: 2024, total: 125000, rewards: 87500, admin: 12500, operational: 8300 },
        { month: 'Sep', year: 2024, total: 145000, rewards: 101500, admin: 14500, operational: 9600 },
        { month: 'Oct', year: 2024, total: 155000, rewards: 108500, admin: 15500, operational: 10300 },
        { month: 'Nov', year: 2024, total: 140000, rewards: 98000, admin: 14000, operational: 9300 }
      ],
      topCategories: [
        { _id: 'Rewards', totalAmount: 300000 },
        { _id: 'Admin Fees', totalAmount: 45000 },
        { _id: 'Operational', totalAmount: 30000 },
        { _id: 'Marketing', totalAmount: 25000 },
        { _id: 'Infrastructure', totalAmount: 20000 }
      ],
      spendingBreakdown: [
        {
          category: 'Rewards',
          amount: 300000,
          percentage: 40.0,
          description: 'Student rewards and incentives'
        },
        {
          category: 'Admin Fees',
          amount: 45000,
          percentage: 6.0,
          description: 'Administrative and processing fees'
        },
        {
          category: 'Operational',
          amount: 30000,
          percentage: 4.0,
          description: 'Platform operational costs'
        },
        {
          category: 'Marketing',
          amount: 25000,
          percentage: 3.3,
          description: 'Marketing and outreach'
        },
        {
          category: 'Infrastructure',
          amount: 20000,
          percentage: 2.7,
          description: 'Infrastructure and hosting'
        }
      ],
      period: {
        startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: endDate ? new Date(endDate) : new Date()
      },
      calculatedAt: new Date()
    };

    res.json({
      success: true,
      data: budgetSummary
    });
  } catch (error) {
    console.error('Error fetching budget summary (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget summary',
      error: error.message
    });
  }
};

// Get transactions list
export const getTransactions = async (req, res) => {
  try {
    console.log('getTransactions (MOCK) called with:', req.query);
    
    const { 
      page = 1,
      limit = 10,
      type,
      status,
      startDate,
      endDate
    } = req.query;

    // Mock transactions data
    const mockTransactions = [
      {
        _id: 'mock_transaction_1',
        transactionId: 'TXN001',
        type: 'healcoins_funded',
        amount: 100000,
        healCoinsAmount: 100000,
        description: 'Initial HealCoins funding for Q4 campaign',
        status: 'completed',
        createdAt: new Date('2024-10-01'),
        organizationId: 'mock_org_1'
      },
      {
        _id: 'mock_transaction_2',
        transactionId: 'TXN002',
        type: 'reward_distribution',
        amount: 25000,
        healCoinsAmount: 25000,
        description: 'Rewards distributed for Financial Literacy campaign',
        status: 'completed',
        createdAt: new Date('2024-10-05'),
        organizationId: 'mock_org_1'
      },
      {
        _id: 'mock_transaction_3',
        transactionId: 'TXN003',
        type: 'admin_fee',
        amount: 2500,
        healCoinsAmount: 2500,
        description: 'Administrative fees for October',
        status: 'completed',
        createdAt: new Date('2024-10-10'),
        organizationId: 'mock_org_1'
      },
      {
        _id: 'mock_transaction_4',
        transactionId: 'TXN004',
        type: 'operational_cost',
        amount: 5000,
        healCoinsAmount: 5000,
        description: 'Platform operational costs',
        status: 'pending',
        createdAt: new Date('2024-10-15'),
        organizationId: 'mock_org_1'
      },
      {
        _id: 'mock_transaction_5',
        transactionId: 'TXN005',
        type: 'healcoins_spent',
        amount: 15000,
        healCoinsAmount: 15000,
        description: 'HealCoins spent on student incentives',
        status: 'completed',
        createdAt: new Date('2024-10-18'),
        organizationId: 'mock_org_1'
      }
    ];

    // Filter transactions based on query parameters
    let filteredTransactions = mockTransactions;
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Get HealCoins balance
export const getHealCoinsBalance = async (req, res) => {
  try {
    console.log('getHealCoinsBalance (MOCK) called with:', req.query);
    
    const { organizationId, campaignId } = req.query;

    // Mock HealCoins balance data
    const healCoinsBalance = {
      totalFunded: 500000,
      totalSpent: 375000,
      availableBalance: 125000,
      utilizationRate: 75.0,
      pendingTransactions: 25000,
      reservedBalance: 50000,
      breakdown: {
        rewards: 300000,
        adminFees: 45000,
        operationalCosts: 30000
      },
      recentActivity: [
        {
          type: 'fund',
          amount: 100000,
          description: 'Q4 campaign funding',
          date: new Date('2024-10-01')
        },
        {
          type: 'spend',
          amount: 25000,
          description: 'Reward distribution',
          date: new Date('2024-10-05')
        },
        {
          type: 'spend',
          amount: 15000,
          description: 'Student incentives',
          date: new Date('2024-10-18')
        }
      ],
      period: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date()
      },
      calculatedAt: new Date()
    };

    res.json({
      success: true,
      data: healCoinsBalance
    });
  } catch (error) {
    console.error('Error fetching HealCoins balance (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch HealCoins balance',
      error: error.message
    });
  }
};

// Create new transaction
export const createTransaction = async (req, res) => {
  try {
    console.log('createTransaction (MOCK) called with:', req.body);
    
    const { type, amount, healCoinsAmount, description, campaignId } = req.body;

    // Mock created transaction
    const newTransaction = {
      _id: 'mock_transaction_new',
      transactionId: `TXN${Date.now()}`,
      type,
      amount,
      healCoinsAmount,
      description,
      status: 'pending',
      createdAt: new Date(),
      organizationId: 'mock_org_1',
      campaignId
    };

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: newTransaction
    });
  } catch (error) {
    console.error('Error creating transaction (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// Fund HealCoins
export const fundHealCoins = async (req, res) => {
  try {
    console.log('fundHealCoins (MOCK) called with:', req.body);
    
    const { amount, source, description, campaignId } = req.body;

    // Mock funding transaction
    const fundingTransaction = {
      _id: 'mock_funding_new',
      transactionId: `FUND${Date.now()}`,
      type: 'healcoins_funded',
      amount,
      healCoinsAmount: amount,
      description: description || 'HealCoins funding',
      status: 'completed',
      createdAt: new Date(),
      organizationId: 'mock_org_1',
      campaignId,
      source
    };

    res.status(201).json({
      success: true,
      message: 'HealCoins funded successfully',
      data: fundingTransaction
    });
  } catch (error) {
    console.error('Error funding HealCoins (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fund HealCoins',
      error: error.message
    });
  }
};

// Record HealCoins spend
export const recordHealCoinsSpend = async (req, res) => {
  try {
    console.log('recordHealCoinsSpend (MOCK) called with:', req.body);
    
    const { amount, category, description, campaignId } = req.body;

    // Mock spending transaction
    const spendingTransaction = {
      _id: 'mock_spending_new',
      transactionId: `SPEND${Date.now()}`,
      type: 'healcoins_spent',
      amount,
      healCoinsAmount: amount,
      description: description || 'HealCoins spent',
      status: 'completed',
      createdAt: new Date(),
      organizationId: 'mock_org_1',
      campaignId,
      category
    };

    res.status(201).json({
      success: true,
      message: 'HealCoins spend recorded successfully',
      data: spendingTransaction
    });
  } catch (error) {
    console.error('Error recording HealCoins spend (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record HealCoins spend',
      error: error.message
    });
  }
};

// Update transaction status
export const updateTransactionStatus = async (req, res) => {
  try {
    console.log('updateTransactionStatus (MOCK) called with:', req.params, req.body);
    
    const { transactionId } = req.params;
    const { status } = req.body;

    // Mock updated transaction
    const updatedTransaction = {
      _id: transactionId,
      transactionId,
      status,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction status (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction status',
      error: error.message
    });
  }
};

// Export transactions
export const exportTransactions = async (req, res) => {
  try {
    console.log('exportTransactions (MOCK) called with:', req.query);
    
    const { format = 'csv' } = req.query;

    // Mock export data
    const exportData = {
      format,
      filename: `transactions_${new Date().toISOString().split('T')[0]}.${format}`,
      downloadUrl: `/api/csr/budget/transactions/download?format=${format}`,
      recordCount: 25,
      generatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Export prepared successfully',
      data: exportData
    });
  } catch (error) {
    console.error('Error exporting transactions (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export transactions',
      error: error.message
    });
  }
};

// Mock CSR Payment Controller
// This provides mock data without requiring database connections

import mongoose from 'mongoose';

// Create new CSR payment (Mock)
export const createPayment = async (req, res) => {
  try {
    console.log('createPayment (MOCK) called with:', req.body);
    
    const {
      paymentType,
      campaignId,
      amount,
      currency,
      healCoinsAmount,
      paymentMethod,
      budgetCategory,
      paymentSchedule,
      scheduledDate,
      description
    } = req.body;

    // Mock payment creation
    const mockPayment = {
      _id: 'mock_payment_' + Date.now(),
      paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paymentType: paymentType || 'per_campaign',
      organizationId: 'mock_org_1',
      organizationName: 'Mock CSR Organization',
      csrContactId: 'mock_user_1',
      campaignId: campaignId || null,
      amount: parseInt(amount) || 0,
      currency: currency || 'INR',
      healCoinsAmount: parseInt(healCoinsAmount) || 0,
      healCoinsExchangeRate: 1,
      paymentMethod: paymentMethod || 'bank_transfer',
      budgetCategory: budgetCategory || 'campaign_funding',
      paymentSchedule: paymentSchedule || 'immediate',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      description: description || 'Mock payment',
      status: 'pending',
      approvalStatus: parseInt(amount) > 100000 ? 'pending_approval' : 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: mockPayment
    });
  } catch (error) {
    console.error('Error creating payment (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: error.message
    });
  }
};

// Get all payments for organization (Mock)
export const getPayments = async (req, res) => {
  try {
    console.log('getPayments (MOCK) called with:', req.query);
    
    const { page = 1, limit = 10, status, paymentType, startDate, endDate } = req.query;

    // Mock payments data
    const mockPayments = [
      {
        _id: 'mock_payment_1',
        paymentId: 'PAY_20241020_001',
        paymentType: 'per_campaign',
        organizationId: 'mock_org_1',
        organizationName: 'Mock CSR Organization',
        campaignId: 'mock_campaign_1',
        amount: 50000,
        currency: 'INR',
        healCoinsAmount: 50000,
        paymentMethod: 'bank_transfer',
        budgetCategory: 'campaign_funding',
        status: 'completed',
        approvalStatus: 'approved',
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-10-15')
      },
      {
        _id: 'mock_payment_2',
        paymentId: 'PAY_20241020_002',
        paymentType: 'healcoins_pool',
        organizationId: 'mock_org_1',
        organizationName: 'Mock CSR Organization',
        amount: 100000,
        currency: 'INR',
        healCoinsAmount: 100000,
        paymentMethod: 'upi',
        budgetCategory: 'healcoins_pool',
        status: 'processing',
        approvalStatus: 'approved',
        createdAt: new Date('2024-10-18'),
        updatedAt: new Date('2024-10-18')
      },
      {
        _id: 'mock_payment_3',
        paymentId: 'PAY_20241020_003',
        paymentType: 'subscription',
        organizationId: 'mock_org_1',
        organizationName: 'Mock CSR Organization',
        amount: 25000,
        currency: 'INR',
        healCoinsAmount: 0,
        paymentMethod: 'credit_card',
        budgetCategory: 'platform_fees',
        status: 'pending',
        approvalStatus: 'pending_approval',
        createdAt: new Date('2024-10-20'),
        updatedAt: new Date('2024-10-20')
      }
    ];

    // Filter based on query parameters
    let filteredPayments = mockPayments;
    
    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }
    
    if (paymentType) {
      filteredPayments = filteredPayments.filter(p => p.paymentType === paymentType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedPayments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredPayments.length,
        totalPages: Math.ceil(filteredPayments.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payments (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Get payment by ID (Mock)
export const getPaymentById = async (req, res) => {
  try {
    console.log('getPaymentById (MOCK) called with:', req.params);
    
    const { paymentId } = req.params;

    // Mock payment details
    const mockPayment = {
      _id: paymentId,
      paymentId: `PAY_20241020_${paymentId}`,
      paymentType: 'per_campaign',
      organizationId: 'mock_org_1',
      organizationName: 'Mock CSR Organization',
      csrContactId: 'mock_user_1',
      campaignId: 'mock_campaign_1',
      amount: 50000,
      currency: 'INR',
      healCoinsAmount: 50000,
      paymentMethod: 'bank_transfer',
      budgetCategory: 'campaign_funding',
      status: 'completed',
      approvalStatus: 'approved',
      approvedBy: 'mock_approver_1',
      approvedAt: new Date('2024-10-15'),
      processingDetails: {
        initiatedAt: new Date('2024-10-15'),
        processedAt: new Date('2024-10-15'),
        completedAt: new Date('2024-10-15'),
        gatewayResponse: { status: 'success', transactionId: 'TXN123456' }
      },
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-10-15')
    };

    res.json({
      success: true,
      data: mockPayment
    });
  } catch (error) {
    console.error('Error fetching payment (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};

// Update payment status (Mock)
export const updatePaymentStatus = async (req, res) => {
  try {
    console.log('updatePaymentStatus (MOCK) called with:', req.params, req.body);
    
    const { paymentId } = req.params;
    const { status, notes } = req.body;

    // Mock status update
    const mockUpdatedPayment = {
      _id: paymentId,
      paymentId: `PAY_20241020_${paymentId}`,
      status: status,
      approvalNotes: notes,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: mockUpdatedPayment
    });
  } catch (error) {
    console.error('Error updating payment status (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

// Approve payment (Mock)
export const approvePayment = async (req, res) => {
  try {
    console.log('approvePayment (MOCK) called with:', req.params, req.body);
    
    const { paymentId } = req.params;
    const { action, notes } = req.body;

    // Mock approval response
    const mockApprovedPayment = {
      _id: paymentId,
      paymentId: `PAY_20241020_${paymentId}`,
      approvalStatus: action === 'approve' ? 'approved' : 'rejected',
      approvedBy: 'mock_approver_1',
      approvedAt: new Date(),
      approvalNotes: notes,
      status: action === 'approve' ? 'processing' : 'cancelled',
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: `Payment ${action}d successfully`,
      data: mockApprovedPayment
    });
  } catch (error) {
    console.error('Error approving payment (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve payment',
      error: error.message
    });
  }
};

// Process payment (Mock)
export const processPayment = async (req, res) => {
  try {
    console.log('processPayment (MOCK) called with:', req.params, req.body);
    
    const { paymentId } = req.params;
    const { gatewayResponse, processingNotes } = req.body;

    // Mock payment processing
    const mockProcessedPayment = {
      _id: paymentId,
      paymentId: `PAY_20241020_${paymentId}`,
      status: 'completed',
      financeTeam: {
        assignedTo: 'mock_finance_user_1',
        processedAt: new Date(),
        processingNotes: processingNotes,
        invoiceGenerated: true,
        invoiceId: 'mock_invoice_1'
      },
      processingDetails: {
        gatewayResponse: gatewayResponse,
        processedAt: new Date(),
        completedAt: new Date()
      },
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: mockProcessedPayment
    });
  } catch (error) {
    console.error('Error processing payment (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  }
};

// Get spend ledger (Mock)
export const getSpendLedger = async (req, res) => {
  try {
    console.log('getSpendLedger (MOCK) called with:', req.query);
    
    const { page = 1, limit = 50, category, transactionType, startDate, endDate } = req.query;

    // Mock spend ledger data
    const mockTransactions = [
      {
        _id: 'mock_transaction_1',
        transactionId: 'TXN_20241020_001',
        transactionType: 'payment',
        organizationId: 'mock_org_1',
        campaignId: 'mock_campaign_1',
        amount: 50000,
        currency: 'INR',
        healCoinsAmount: 0,
        category: 'campaign_funding',
        description: 'Payment for Financial Literacy Campaign',
        direction: 'inbound',
        runningBalance: 50000,
        healCoinsBalance: 0,
        status: 'completed',
        processedAt: new Date('2024-10-15'),
        createdAt: new Date('2024-10-15')
      },
      {
        _id: 'mock_transaction_2',
        transactionId: 'TXN_20241020_002',
        transactionType: 'healcoins_fund',
        organizationId: 'mock_org_1',
        amount: 0,
        currency: 'INR',
        healCoinsAmount: 100000,
        category: 'healcoins_pool',
        description: 'HealCoins pool funding',
        direction: 'inbound',
        runningBalance: 50000,
        healCoinsBalance: 100000,
        status: 'completed',
        processedAt: new Date('2024-10-18'),
        createdAt: new Date('2024-10-18')
      },
      {
        _id: 'mock_transaction_3',
        transactionId: 'TXN_20241020_003',
        transactionType: 'healcoins_spend',
        organizationId: 'mock_org_1',
        campaignId: 'mock_campaign_1',
        amount: 0,
        currency: 'INR',
        healCoinsAmount: 25000,
        category: 'student_rewards',
        description: 'Student rewards distribution',
        direction: 'outbound',
        runningBalance: 50000,
        healCoinsBalance: 75000,
        status: 'completed',
        processedAt: new Date('2024-10-19'),
        createdAt: new Date('2024-10-19')
      },
      {
        _id: 'mock_transaction_4',
        transactionId: 'TXN_20241020_004',
        transactionType: 'fee',
        organizationId: 'mock_org_1',
        amount: 5000,
        currency: 'INR',
        healCoinsAmount: 0,
        category: 'platform_fees',
        description: 'Platform service fee',
        direction: 'outbound',
        runningBalance: 45000,
        healCoinsBalance: 75000,
        status: 'completed',
        processedAt: new Date('2024-10-20'),
        createdAt: new Date('2024-10-20')
      }
    ];

    // Filter based on query parameters
    let filteredTransactions = mockTransactions;
    
    if (category) {
      filteredTransactions = filteredTransactions.filter(t => t.category === category);
    }
    
    if (transactionType) {
      filteredTransactions = filteredTransactions.filter(t => t.transactionType === transactionType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Mock balance
    const mockBalance = {
      balance: 45000,
      healCoinsBalance: 75000
    };

    res.json({
      success: true,
      data: paginatedTransactions,
      balance: mockBalance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching spend ledger (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spend ledger',
      error: error.message
    });
  }
};

// Get financial summary (Mock)
export const getFinancialSummary = async (req, res) => {
  try {
    console.log('getFinancialSummary (MOCK) called with:', req.query);
    
    const { startDate, endDate } = req.query;

    // Mock financial summary
    const mockSummary = {
      balance: {
        balance: 45000,
        healCoinsBalance: 75000
      },
      spendSummary: [
        {
          _id: 'campaign_funding',
          totalAmount: 50000,
          totalHealCoins: 0,
          transactionCount: 1
        },
        {
          _id: 'student_rewards',
          totalAmount: 0,
          totalHealCoins: 25000,
          transactionCount: 1
        },
        {
          _id: 'platform_fees',
          totalAmount: 5000,
          totalHealCoins: 0,
          transactionCount: 1
        },
        {
          _id: 'healcoins_pool',
          totalAmount: 0,
          totalHealCoins: 100000,
          transactionCount: 1
        }
      ],
      paymentStats: [
        {
          _id: 'completed',
          count: 2,
          totalAmount: 150000
        },
        {
          _id: 'processing',
          count: 1,
          totalAmount: 100000
        },
        {
          _id: 'pending',
          count: 1,
          totalAmount: 25000
        }
      ],
      healCoinsSummary: [
        {
          _id: 'inbound',
          totalHealCoins: 100000
        },
        {
          _id: 'outbound',
          totalHealCoins: 25000
        }
      ],
      period: {
        startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: endDate ? new Date(endDate) : new Date()
      }
    };

    res.json({
      success: true,
      data: mockSummary
    });
  } catch (error) {
    console.error('Error fetching financial summary (MOCK):', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial summary',
      error: error.message
    });
  }
};

export default {
  createPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  approvePayment,
  processPayment,
  getSpendLedger,
  getFinancialSummary
};

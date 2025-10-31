import PaymentTransaction from '../models/PaymentTransaction.js';
import Transaction from '../models/Transaction.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all payment transactions across platform
export const getAllPaymentTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, gateway, startDate, endDate, organization } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (gateway) query.gatewayName = gateway;
    if (organization) query.organizationId = organization;
    
    if (startDate || endDate) {
      query.initiatedAt = {};
      if (startDate) query.initiatedAt.$gte = new Date(startDate);
      if (endDate) query.initiatedAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      PaymentTransaction.find(query)
        .populate('userId', 'name email role')
        .populate('organizationId', 'name')
        .sort({ initiatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PaymentTransaction.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

// Get payment statistics
export const getPaymentStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.initiatedAt = {};
      if (startDate) dateQuery.initiatedAt.$gte = new Date(startDate);
      if (endDate) dateQuery.initiatedAt.$lte = new Date(endDate);
    }

    const [stats, gatewayStats, statusStats, orgStats] = await Promise.all([
      // Overall statistics
      PaymentTransaction.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            totalNetAmount: { $sum: '$netAmount' },
            totalFees: { $sum: '$processingFee.totalFee' },
            completedTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            failedTransactions: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            avgAmount: { $avg: '$amount' }
          }
        }
      ]),
      
      // Gateway statistics
      PaymentTransaction.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: '$gatewayName',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            netAmount: { $sum: '$netAmount' }
          }
        },
        { $sort: { totalAmount: -1 } }
      ]),
      
      // Status statistics
      PaymentTransaction.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]),
      
      // Organization statistics
      PaymentTransaction.aggregate([
        { $match: dateQuery },
        {
          $group: {
            _id: '$organizationId',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        },
        { $lookup: {
          from: 'organizations',
          localField: '_id',
          foreignField: '_id',
          as: 'organization'
        }},
        { $unwind: '$organization' },
        { $project: {
          organizationName: '$organization.name',
          count: 1,
          totalAmount: 1
        }},
        { $sort: { totalAmount: -1 } },
        { $limit: 10 }
      ])
    ]);

    const overallStats = stats[0] || {
      totalTransactions: 0,
      totalAmount: 0,
      totalNetAmount: 0,
      totalFees: 0,
      completedTransactions: 0,
      failedTransactions: 0,
      avgAmount: 0
    };

    const successRate = overallStats.totalTransactions > 0
      ? (overallStats.completedTransactions / overallStats.totalTransactions * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        overall: {
          ...overallStats,
          successRate: parseFloat(successRate)
        },
        byGateway: gatewayStats,
        byStatus: statusStats,
        topOrganizations: orgStats
      }
    });
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
  }
};

// Get transactions by organization
export const getTransactionsByOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      PaymentTransaction.find({ organizationId })
        .populate('userId', 'name email role')
        .sort({ initiatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PaymentTransaction.countDocuments({ organizationId })
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching organization transactions:', error);
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
};

// Get refund statistics
export const getRefundStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.initiatedAt = {};
      if (startDate) dateQuery.initiatedAt.$gte = new Date(startDate);
      if (endDate) dateQuery.initiatedAt.$lte = new Date(endDate);
    }

    const refundStats = await PaymentTransaction.aggregate([
      { $match: dateQuery },
      { $unwind: { path: '$refunds', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalRefunds: { $sum: { $cond: [{ $ne: ['$refunds', null] }, 1, 0] } },
          totalRefundAmount: { $sum: '$refunds.amount' },
          completedRefunds: {
            $sum: { $cond: [{ $eq: ['$refunds.status', 'completed'] }, 1, 0] }
          },
          pendingRefunds: {
            $sum: { $cond: [{ $eq: ['$refunds.status', 'processing'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: refundStats[0] || {
        totalRefunds: 0,
        totalRefundAmount: 0,
        completedRefunds: 0,
        pendingRefunds: 0
      }
    });
  } catch (error) {
    console.error('Error fetching refund statistics:', error);
    res.status(500).json({ success: false, message: 'Error fetching refund statistics' });
  }
};

// Process refund
export const processRefund = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { amount, reason } = req.body;

    const transaction = await PaymentTransaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (!transaction.canRefund()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction cannot be refunded' 
      });
    }

    const refundAmount = amount || transaction.amount;
    
    if (refundAmount > transaction.amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refund amount cannot exceed transaction amount' 
      });
    }

    transaction.addRefund({
      refundId: `RF${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      amount: refundAmount,
      reason: reason || 'Admin requested refund',
      status: 'processing',
      initiatedBy: req.user._id,
      gatewayRefundId: null,
      gatewayResponse: {}
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ success: false, message: 'Error processing refund' });
  }
};

// Get transaction details
export const getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await PaymentTransaction.findById(transactionId)
      .populate('userId', 'name email role')
      .populate('organizationId', 'name type')
      .populate('refunds.initiatedBy', 'name email');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ success: false, message: 'Error fetching transaction details' });
  }
};

export default {
  getAllPaymentTransactions,
  getPaymentStatistics,
  getTransactionsByOrganization,
  getRefundStatistics,
  processRefund,
  getTransactionDetails
};


import User from '../models/User.js';
import Organization from '../models/Organization.js';
import PaymentTransaction from '../models/PaymentTransaction.js';
import mongoose from 'mongoose';

// Real-time Revenue Dashboard
export const getRevenueDashboard = async (filters = {}) => {
  try {
    const { timeRange = 'month', startDate, endDate } = filters;
    
    // Calculate date range
    const now = new Date();
    let startDateObj, endDateObj;

    if (startDate && endDate) {
      startDateObj = new Date(startDate);
      endDateObj = new Date(endDate);
    } else {
      switch (timeRange) {
        case 'day':
          startDateObj = new Date(now.setHours(0, 0, 0, 0));
          endDateObj = new Date();
          break;
        case 'week':
          startDateObj = new Date(now.setDate(now.getDate() - 7));
          endDateObj = new Date();
          break;
        case 'month':
          startDateObj = new Date(now.setMonth(now.getMonth() - 1));
          endDateObj = new Date();
          break;
        case 'quarter':
          startDateObj = new Date(now.setMonth(now.getMonth() - 3));
          endDateObj = new Date();
          break;
        case 'year':
          startDateObj = new Date(now.setFullYear(now.getFullYear() - 1));
          endDateObj = new Date();
          break;
        default:
          startDateObj = new Date(now.setMonth(now.getMonth() - 1));
          endDateObj = new Date();
      }
    }

    const dateFilter = { createdAt: { $gte: startDateObj, $lte: endDateObj } };

    // Get revenue metrics
    const [totalRevenue, successfulTransactions, failedTransactions, refundedAmount, 
           revenueByGateway, revenueByOrganization, dailyRevenue] = await Promise.all([
      // Total revenue
      PaymentTransaction.aggregate([
        { $match: { ...dateFilter, status: 'completed' }},
        { $group: { _id: null, total: { $sum: '$amount' }, net: { $sum: '$netAmount' } }}
      ]),
      // Successful transactions
      PaymentTransaction.countDocuments({ ...dateFilter, status: 'completed' }),
      // Failed transactions
      PaymentTransaction.countDocuments({ ...dateFilter, status: 'failed' }),
      // Refunded amount
      PaymentTransaction.aggregate([
        { $match: { ...dateFilter, status: 'refunded' }},
        { $group: { _id: null, total: { $sum: '$amount' } }}
      ]),
      // Revenue by gateway
      PaymentTransaction.aggregate([
        { $match: { ...dateFilter, status: 'completed' }},
        { $group: {
          _id: '$gatewayName',
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 },
          netRevenue: { $sum: '$netAmount' }
        }},
        { $sort: { revenue: -1 }}
      ]),
      // Revenue by organization
      PaymentTransaction.aggregate([
        { $match: { ...dateFilter, status: 'completed' }},
        { $lookup: {
          from: 'organizations',
          localField: 'organizationId',
          foreignField: '_id',
          as: 'organization'
        }},
        { $unwind: { path: '$organization', preserveNullAndEmptyArrays: true }},
        { $group: {
          _id: '$organizationId',
          organizationName: { $first: '$organization.name' },
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 },
          netRevenue: { $sum: '$netAmount' }
        }},
        { $sort: { revenue: -1 }},
        { $limit: 20 }
      ]),
      // Daily revenue trend
      PaymentTransaction.aggregate([
        { $match: { ...dateFilter, status: 'completed' }},
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }},
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 }
        }},
        { $sort: { _id: 1 }}
      ])
    ]);

    const revenueData = totalRevenue[0] || { total: 0, net: 0 };
    const refundData = refundedAmount[0] || { total: 0 };

    // Calculate previous period for comparison
    const periodDiff = endDateObj - startDateObj;
    const previousStart = new Date(startDateObj.getTime() - periodDiff);
    const previousEnd = new Date(startDateObj);

    const previousRevenue = await PaymentTransaction.aggregate([
      { $match: { 
        createdAt: { $gte: previousStart, $lte: previousEnd },
        status: 'completed'
      }},
      { $group: { _id: null, total: { $sum: '$amount' } }}
    ]);

    const prevRevenue = previousRevenue[0]?.total || 0;
    const revenueGrowth = prevRevenue > 0 
      ? ((revenueData.total - prevRevenue) / prevRevenue) * 100 
      : revenueData.total > 0 ? 100 : 0;

    return {
      totalRevenue: revenueData.total || 0,
      netRevenue: revenueData.net || 0,
      refundedAmount: refundData.total || 0,
      successfulTransactions,
      failedTransactions,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      revenueByGateway: revenueByGateway || [],
      revenueByOrganization: revenueByOrganization || [],
      dailyRevenue: dailyRevenue || [],
      period: {
        start: startDateObj,
        end: endDateObj
      }
    };
  } catch (error) {
    console.error('Error getting revenue dashboard:', error);
    throw error;
  }
};

// Per-School ARPU, MRR/ARR
export const getSchoolMetrics = async (filters = {}) => {
  try {
    const { schoolId, timeRange = 'month' } = filters;
    
    const now = new Date();
    let startDateObj, endDateObj;

    switch (timeRange) {
      case 'month':
        startDateObj = new Date(now.setMonth(now.getMonth() - 1));
        endDateObj = new Date();
        break;
      case 'quarter':
        startDateObj = new Date(now.setMonth(now.getMonth() - 3));
        endDateObj = new Date();
        break;
      case 'year':
        startDateObj = new Date(now.setFullYear(now.getFullYear() - 1));
        endDateObj = new Date();
        break;
      default:
        startDateObj = new Date(now.setMonth(now.getMonth() - 1));
        endDateObj = new Date();
    }

    const schoolFilter = schoolId 
      ? { organizationId: new mongoose.Types.ObjectId(schoolId) }
      : {};

    // Get all schools
    const schools = await Organization.find({
      type: 'school',
      isActive: true,
      ...(schoolId && { _id: new mongoose.Types.ObjectId(schoolId) })
    });

    const schoolMetrics = await Promise.all(schools.map(async (school) => {
      const [transactions, students, activeStudents] = await Promise.all([
        PaymentTransaction.find({
          organizationId: school._id,
          status: 'completed',
          createdAt: { $gte: startDateObj, $lte: endDateObj }
        }),
        User.countDocuments({
          role: 'school_student',
          tenantId: school.tenantId
        }),
        User.countDocuments({
          role: 'school_student',
          tenantId: school.tenantId
        })
      ]);

      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const transactionCount = transactions.length;
      
      // ARPU (Average Revenue Per User)
      const arpu = students > 0 ? totalRevenue / students : 0;
      
      // MRR (Monthly Recurring Revenue) - assuming monthly subscriptions
      const mrr = transactionCount > 0 ? totalRevenue / transactionCount : 0;
      
      // ARR (Annual Recurring Revenue)
      const arr = mrr * 12;

      // Calculate retention rate (simplified - in real system would check attendance/activity)
      const retentionRate = students > 0 ? (activeStudents / students) * 100 : 0;

      return {
        schoolId: school._id,
        schoolName: school.name,
        tenantId: school.tenantId,
        totalRevenue,
        transactionCount,
        students,
        activeStudents,
        arpu: Math.round(arpu * 100) / 100,
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(arr * 100) / 100,
        retentionRate: Math.round(retentionRate * 10) / 10
      };
    }));

    // Sort by ARPU descending
    schoolMetrics.sort((a, b) => b.arpu - a.arpu);

    // Aggregate metrics
    const totalSchools = schoolMetrics.length;
    const totalRevenue = schoolMetrics.reduce((sum, s) => sum + s.totalRevenue, 0);
    const totalMRR = schoolMetrics.reduce((sum, s) => sum + s.mrr, 0);
    const totalARR = totalMRR * 12;
    const avgARPU = totalSchools > 0 
      ? schoolMetrics.reduce((sum, s) => sum + s.arpu, 0) / totalSchools 
      : 0;

    return {
      schools: schoolMetrics,
      summary: {
        totalSchools,
        totalRevenue,
        totalMRR: Math.round(totalMRR * 100) / 100,
        totalARR: Math.round(totalARR * 100) / 100,
        avgARPU: Math.round(avgARPU * 100) / 100,
        avgRetentionRate: totalSchools > 0
          ? Math.round((schoolMetrics.reduce((sum, s) => sum + s.retentionRate, 0) / totalSchools) * 10) / 10
          : 0
      }
    };
  } catch (error) {
    console.error('Error getting school metrics:', error);
    throw error;
  }
};

// Auto-Invoice Generation
export const generateInvoice = async (invoiceData) => {
  try {
    const {
      organizationId,
      tenantId,
      amount,
      description,
      items,
      dueDate,
      taxRate,
      currency = 'INR'
    } = invoiceData;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const taxAmount = taxRate ? (amount * taxRate / 100) : 0;
    const totalAmount = amount + taxAmount;

    const invoice = {
      invoiceNumber,
      organizationId,
      tenantId,
      amount,
      taxRate: taxRate || 0,
      taxAmount,
      totalAmount,
      currency,
      description,
      items: items || [{ description, quantity: 1, amount }],
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real system, you'd save this to an Invoice collection
    // For now, we'll return the invoice object
    return invoice;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

// Payment Retries + Dunning Management
export const getPaymentRetries = async (filters = {}) => {
  try {
    const { status = 'all', daysThreshold = 7 } = filters;

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    // Find failed transactions that need retry
    const failedTransactions = await PaymentTransaction.find({
      status: 'failed',
      createdAt: { $gte: thresholdDate }
    }).sort({ createdAt: -1 }).limit(100);

    // Get transactions with retry attempts
    const retryData = await Promise.all(failedTransactions.map(async (transaction) => {
      const retryCount = transaction.retryAttempts || 0;
      const lastRetry = transaction.lastRetryAt || transaction.createdAt;
      const daysSinceFailure = Math.floor((new Date() - new Date(lastRetry)) / (1000 * 60 * 60 * 24));

      // Determine retry strategy
      let nextRetryDate = null;
      let dunningStage = 'initial';
      
      if (retryCount === 0) {
        nextRetryDate = new Date(lastRetry);
        nextRetryDate.setDate(nextRetryDate.getDate() + 3);
        dunningStage = 'first_reminder';
      } else if (retryCount === 1) {
        nextRetryDate = new Date(lastRetry);
        nextRetryDate.setDate(nextRetryDate.getDate() + 7);
        dunningStage = 'second_reminder';
      } else if (retryCount === 2) {
        nextRetryDate = new Date(lastRetry);
        nextRetryDate.setDate(nextRetryDate.getDate() + 14);
        dunningStage = 'final_reminder';
      } else {
        dunningStage = 'escalated';
      }

      return {
        transactionId: transaction._id,
        organizationId: transaction.organizationId,
        tenantId: transaction.tenantId,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        failedAt: transaction.createdAt,
        retryCount,
        lastRetryAt: lastRetry,
        daysSinceFailure,
        nextRetryDate,
        dunningStage,
        canRetry: daysSinceFailure >= 3 && retryCount < 3,
        needsEscalation: retryCount >= 3
      };
    }));

    // Filter by status
    let filteredRetries = retryData;
    if (status === 'can_retry') {
      filteredRetries = retryData.filter(r => r.canRetry);
    } else if (status === 'escalated') {
      filteredRetries = retryData.filter(r => r.needsEscalation);
    }

    // Summary
    const summary = {
      total: filteredRetries.length,
      canRetry: retryData.filter(r => r.canRetry).length,
      escalated: retryData.filter(r => r.needsEscalation).length,
      totalAmount: filteredRetries.reduce((sum, r) => sum + r.amount, 0)
    };

    return {
      retries: filteredRetries,
      summary
    };
  } catch (error) {
    console.error('Error getting payment retries:', error);
    throw error;
  }
};

// Refund Operations
export const processRefund = async (refundData) => {
  try {
    const { transactionId, amount, reason, initiatedBy } = refundData;

    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'completed') {
      throw new Error('Can only refund completed transactions');
    }

    const refundAmount = amount || transaction.amount;
    
    if (refundAmount > transaction.amount) {
      throw new Error('Refund amount cannot exceed transaction amount');
    }

    // Create refund record
    const refund = {
      transactionId: transaction._id,
      originalTransactionId: transaction.transactionId,
      organizationId: transaction.organizationId,
      tenantId: transaction.tenantId,
      amount: refundAmount,
      currency: transaction.currency,
      reason: reason || 'Customer request',
      initiatedBy,
      status: 'pending',
      createdAt: new Date()
    };

    // Update transaction status
    transaction.status = refundAmount === transaction.amount ? 'refunded' : 'partially_refunded';
    transaction.refundAmount = (transaction.refundAmount || 0) + refundAmount;
    await transaction.save();

    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
};

// Coupons, Bundles, Promotions
export const getCouponsAndPromotions = async (filters = {}) => {
  try {
    // In a real system, you'd have a Coupon/Promotion model
    // For now, we'll simulate this data
    const coupons = [
      {
        id: 'coupon-1',
        code: 'SCHOOL2025',
        type: 'percentage',
        discount: 20,
        description: '20% off for schools',
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageCount: 45,
        maxUsage: 1000,
        status: 'active'
      },
      {
        id: 'coupon-2',
        code: 'FAMILY1000',
        type: 'flat',
        discount: 1000,
        description: '₹1000 off on Student + Parent Premium Pro plan',
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        usageCount: 120,
        maxUsage: 500,
        status: 'active'
      }
    ];

    const bundles = [
      {
        id: 'bundle-1',
        name: 'Premium Education Package',
        description: 'Complete education solution with all features',
        price: 9999,
        savings: 2000,
        includes: ['Student Premium Plan', 'Analytics Add-on', 'Support Package'],
        status: 'active'
      }
    ];

    return {
      coupons,
      bundles,
      totalCoupons: coupons.length,
      activeCoupons: coupons.filter(c => c.status === 'active').length,
      totalUsage: coupons.reduce((sum, c) => sum + c.usageCount, 0)
    };
  } catch (error) {
    console.error('Error getting coupons and promotions:', error);
    throw error;
  }
};

// Region-wise Tax/VAT Compliance
export const getTaxCompliance = async (filters = {}) => {
  try {
    const { region, timeRange = 'month' } = filters;

    const now = new Date();
    let startDateObj, endDateObj;

    switch (timeRange) {
      case 'month':
        startDateObj = new Date(now.setMonth(now.getMonth() - 1));
        endDateObj = new Date();
        break;
      case 'quarter':
        startDateObj = new Date(now.setMonth(now.getMonth() - 3));
        endDateObj = new Date();
        break;
      case 'year':
        startDateObj = new Date(now.setFullYear(now.getFullYear() - 1));
        endDateObj = new Date();
        break;
      default:
        startDateObj = new Date(now.setMonth(now.getMonth() - 1));
        endDateObj = new Date();
    }

    // Get organizations by region
    const organizations = await Organization.find({
      type: 'school',
      isActive: true,
      ...(region && { 'settings.address.state': region })
    });

    // Tax rates by region (India-specific)
    const taxRates = {
      'Maharashtra': { GST: 18, SGST: 9, CGST: 9 },
      'Karnataka': { GST: 18, SGST: 9, CGST: 9 },
      'Tamil Nadu': { GST: 18, SGST: 9, CGST: 9 },
      'Delhi': { GST: 18, SGST: 9, CGST: 9 },
      'Gujarat': { GST: 18, SGST: 9, CGST: 9 },
      'default': { GST: 18, SGST: 9, CGST: 9 }
    };

    const regionTaxData = await Promise.all(organizations.map(async (org) => {
      const state = org.settings?.address?.state || 'Unknown';
      const taxes = taxRates[state] || taxRates['default'];

      const transactions = await PaymentTransaction.find({
        organizationId: org._id,
        status: 'completed',
        createdAt: { $gte: startDateObj, $lte: endDateObj }
      });

      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const gstAmount = totalRevenue * (taxes.GST / 100);
      const sgstAmount = totalRevenue * (taxes.SGST / 100);
      const cgstAmount = totalRevenue * (taxes.CGST / 100);

      return {
        organizationId: org._id,
        organizationName: org.name,
        region: state,
        totalRevenue,
        taxRates: taxes,
        taxAmount: {
          gst: Math.round(gstAmount * 100) / 100,
          sgst: Math.round(sgstAmount * 100) / 100,
          cgst: Math.round(cgstAmount * 100) / 100,
          total: Math.round(gstAmount * 100) / 100
        },
        transactions: transactions.length
      };
    }));

    // Group by region
    const regionMap = {};
    regionTaxData.forEach(data => {
      if (!regionMap[data.region]) {
        regionMap[data.region] = {
          region: data.region,
          organizations: [],
          totalRevenue: 0,
          totalTax: 0,
          transactionCount: 0,
          taxRates: data.taxRates
        };
      }
      regionMap[data.region].organizations.push(data);
      regionMap[data.region].totalRevenue += data.totalRevenue;
      regionMap[data.region].totalTax += data.taxAmount.total;
      regionMap[data.region].transactionCount += data.transactions;
    });

    const byRegion = Object.values(regionMap).map(region => ({
      ...region,
      avgRevenue: region.organizations.length > 0
        ? region.totalRevenue / region.organizations.length
        : 0
    }));

    // Summary
    const totalRevenue = regionTaxData.reduce((sum, r) => sum + r.totalRevenue, 0);
    const totalTax = regionTaxData.reduce((sum, r) => sum + r.taxAmount.total, 0);
    const complianceRate = 100; // Assuming all transactions are compliant

    return {
      byRegion,
      summary: {
        totalRegions: byRegion.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTax: Math.round(totalTax * 100) / 100,
        complianceRate,
        totalOrganizations: organizations.length
      },
      detailed: regionTaxData
    };
  } catch (error) {
    console.error('Error getting tax compliance:', error);
    throw error;
  }
};

export default {
  getRevenueDashboard,
  getSchoolMetrics,
  generateInvoice,
  getPaymentRetries,
  processRefund,
  getCouponsAndPromotions,
  getTaxCompliance
};


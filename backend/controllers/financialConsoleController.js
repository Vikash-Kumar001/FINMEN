import financialConsoleService from '../services/financialConsoleService.js';

// Get Revenue Dashboard
export const getRevenueDashboard = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    
    const data = await financialConsoleService.getRevenueDashboard({
      timeRange,
      startDate,
      endDate
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('financial:revenue:update', data);
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getRevenueDashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue dashboard',
      error: error.message
    });
  }
};

// Get School Metrics (ARPU, MRR, ARR)
export const getSchoolMetrics = async (req, res) => {
  try {
    const { schoolId, timeRange } = req.query;
    
    const data = await financialConsoleService.getSchoolMetrics({
      schoolId,
      timeRange
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('financial:school-metrics:update', data);
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getSchoolMetrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching school metrics',
      error: error.message
    });
  }
};

// Generate Invoice
export const generateInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    
    const invoice = await financialConsoleService.generateInvoice(invoiceData);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('financial:invoice:generated', invoice);
    }

    res.json({
      success: true,
      data: invoice,
      message: 'Invoice generated successfully'
    });
  } catch (error) {
    console.error('Error in generateInvoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice',
      error: error.message
    });
  }
};

// Get Payment Retries
export const getPaymentRetries = async (req, res) => {
  try {
    const { status, daysThreshold } = req.query;
    
    const data = await financialConsoleService.getPaymentRetries({
      status,
      daysThreshold: daysThreshold ? parseInt(daysThreshold) : 7
    });

    // Emit alert for escalated retries
    const io = req.app.get('io');
    if (io && data.summary.escalated > 0) {
      io.to('admin').emit('financial:retry:alert', {
        escalated: data.summary.escalated,
        message: `${data.summary.escalated} payment(s) need manual intervention`,
        data
      });
    }

    // Emit real-time update
    if (io) {
      io.to('admin').emit('financial:retries:update', data);
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getPaymentRetries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment retries',
      error: error.message
    });
  }
};

// Process Refund
export const processRefund = async (req, res) => {
  try {
    const refundData = {
      ...req.body,
      initiatedBy: req.user._id
    };
    
    const refund = await financialConsoleService.processRefund(refundData);

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('financial:refund:processed', refund);
      io.to(refundData.organizationId?.toString()).emit('organization:refund:notification', refund);
    }

    res.json({
      success: true,
      data: refund,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    console.error('Error in processRefund:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing refund',
      error: error.message
    });
  }
};

// Get Coupons and Promotions
export const getCouponsAndPromotions = async (req, res) => {
  try {
    const data = await financialConsoleService.getCouponsAndPromotions();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getCouponsAndPromotions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons and promotions',
      error: error.message
    });
  }
};

// Get Tax Compliance
export const getTaxCompliance = async (req, res) => {
  try {
    const { region, timeRange } = req.query;
    
    const data = await financialConsoleService.getTaxCompliance({
      region,
      timeRange
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error in getTaxCompliance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tax compliance',
      error: error.message
    });
  }
};

// Get All Financial Console Data (Dashboard Summary)
export const getAllFinancialConsole = async (req, res) => {
  try {
    const { timeRange = 'month', startDate, endDate } = req.query;
    
    const [revenue, schoolMetrics, retries, coupons, taxCompliance] = await Promise.all([
      financialConsoleService.getRevenueDashboard({ timeRange, startDate, endDate }),
      financialConsoleService.getSchoolMetrics({ timeRange }),
      financialConsoleService.getPaymentRetries({ status: 'all' }),
      financialConsoleService.getCouponsAndPromotions(),
      financialConsoleService.getTaxCompliance({ timeRange })
    ]);

    const summary = {
      totalRevenue: revenue.totalRevenue,
      netRevenue: revenue.netRevenue,
      totalMRR: schoolMetrics.summary.totalMRR,
      totalARR: schoolMetrics.summary.totalARR,
      pendingRetries: retries.summary.canRetry,
      escalatedRetries: retries.summary.escalated,
      totalTax: taxCompliance.summary.totalTax,
      complianceRate: taxCompliance.summary.complianceRate
    };

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('financial:console:summary', summary);
      
      // Emit alerts if needed
      if (retries.summary.escalated > 0) {
        io.to('admin').emit('financial:retry:alert', {
          escalated: retries.summary.escalated,
          message: `${retries.summary.escalated} payment(s) need manual intervention`
        });
      }
    }

    res.json({
      success: true,
      data: {
        summary,
        revenue,
        schoolMetrics,
        retries,
        coupons,
        taxCompliance
      }
    });
  } catch (error) {
    console.error('Error in getAllFinancialConsole:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial console data',
      error: error.message
    });
  }
};

export default {
  getRevenueDashboard,
  getSchoolMetrics,
  generateInvoice,
  getPaymentRetries,
  processRefund,
  getCouponsAndPromotions,
  getTaxCompliance,
  getAllFinancialConsole
};


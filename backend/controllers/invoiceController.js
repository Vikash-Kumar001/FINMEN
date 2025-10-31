import Invoice from '../models/Invoice.js';
import CSRPayment from '../models/CSRPayment.js';
import Organization from '../models/Organization.js';
import mongoose from 'mongoose';

// Get all invoices for organization
export const getInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      paymentId
    } = req.query;

    const filter = {
      organizationId: req.user.organizationId
    };

    if (status) filter.status = status;
    if (paymentId) filter.paymentId = paymentId;
    if (startDate || endDate) {
      filter.issueDate = {};
      if (startDate) filter.issueDate.$gte = new Date(startDate);
      if (endDate) filter.issueDate.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(filter)
      .populate('paymentId', 'paymentId paymentType')
      .populate('generatedBy', 'name email')
      .populate('financeTeam.assignedTo', 'name email')
      .sort({ issueDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId)
      .populate('paymentId')
      .populate('organizationId')
      .populate('generatedBy', 'name email')
      .populate('financeTeam.assignedTo', 'name email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
};

// Generate invoice for payment
export const generateInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { 
      customLineItems,
      additionalNotes,
      dueDate,
      paymentTerms 
    } = req.body;

    const payment = await CSRPayment.findById(paymentId)
      .populate('organizationId')
      .populate('campaignId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({ paymentId: payment._id });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this payment'
      });
    }

    const organization = payment.organizationId;

    // Create line items
    let lineItems = customLineItems || [{
      description: `${payment.paymentType} - ${payment.campaignId?.title || 'General Payment'}`,
      quantity: 1,
      unitPrice: payment.amount,
      totalPrice: payment.amount,
      category: payment.budgetCategory
    }];

    // Calculate totals
    let subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    let taxAmount = lineItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    let totalAmount = subtotal + taxAmount;

    const invoice = new Invoice({
      paymentId: payment._id,
      organizationId: payment.organizationId,
      organizationDetails: {
        name: organization.name,
        address: organization.address,
        contactPerson: organization.contactPerson,
        email: organization.email,
        phone: organization.phone,
        gstNumber: organization.gstNumber,
        panNumber: organization.panNumber
      },
      currency: payment.currency,
      issueDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lineItems,
      subtotal,
      taxAmount,
      totalAmount,
      paymentTerms: paymentTerms || 'Net 30',
      generatedBy: req.user._id,
      status: 'draft'
    });

    await invoice.save();

    // Update payment record
    payment.financeTeam.invoiceGenerated = true;
    payment.financeTeam.invoiceId = invoice._id;
    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Invoice generated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice',
      error: error.message
    });
  }
};

// Send invoice
export const sendInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { deliveryMethod = 'email', customMessage } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update invoice status
    invoice.status = 'sent';
    invoice.sentAt = new Date();
    invoice.deliveryMethod = deliveryMethod;
    invoice.deliveryStatus = 'sent';

    // Add delivery attempt
    invoice.deliveryAttempts += 1;

    await invoice.save();

    // TODO: Implement actual email/portal delivery logic here
    // For now, we'll just update the status

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invoice',
      error: error.message
    });
  }
};

// Record payment for invoice
export const recordPayment = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const {
      paymentAmount,
      paymentMethod,
      paymentDate,
      gatewayTransactionId,
      notes
    } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Create payment reference
    const paymentReference = {
      paymentId: `PAY_${Date.now()}`,
      paymentMethod,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      amount: paymentAmount,
      gatewayTransactionId
    };

    // Add payment reference
    invoice.addPaymentReference(paymentReference);

    // Update invoice status
    if (invoice.paidAmount >= invoice.totalAmount) {
      invoice.status = 'paid';
      invoice.paidAt = new Date();
    } else {
      invoice.status = 'partially_paid';
    }

    await invoice.save();

    // Update related payment status
    const payment = await CSRPayment.findById(invoice.paymentId);
    if (payment) {
      payment.status = 'completed';
      payment.processingDetails.completedAt = new Date();
      await payment.save();
    }

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message
    });
  }
};

// Get invoice analytics
export const getInvoiceAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const defaultStartDate = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const defaultEndDate = endDate ? new Date(endDate) : new Date();

    const analytics = await Invoice.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user.organizationId),
          issueDate: { $gte: defaultStartDate, $lte: defaultEndDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' }
        }
      }
    ]);

    // Get overdue invoices
    const overdueInvoices = await Invoice.find({
      organizationId: req.user.organizationId,
      dueDate: { $lt: new Date() },
      status: { $nin: ['paid', 'cancelled'] }
    }).countDocuments();

    // Get average payment time
    const avgPaymentTime = await Invoice.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(req.user.organizationId),
          status: 'paid',
          paidAt: { $exists: true },
          issueDate: { $gte: defaultStartDate, $lte: defaultEndDate }
        }
      },
      {
        $project: {
          paymentDays: {
            $divide: [
              { $subtract: ['$paidAt', '$issueDate'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgPaymentDays: { $avg: '$paymentDays' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: analytics,
        overdueInvoices,
        avgPaymentDays: avgPaymentTime[0]?.avgPaymentDays || 0,
        period: {
          startDate: defaultStartDate,
          endDate: defaultEndDate
        }
      }
    });
  } catch (error) {
    console.error('Error fetching invoice analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice analytics',
      error: error.message
    });
  }
};

// Download invoice PDF (mock implementation)
export const downloadInvoicePDF = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // TODO: Implement actual PDF generation
    // For now, return invoice data as JSON
    res.json({
      success: true,
      message: 'PDF generation not implemented yet',
      data: invoice
    });
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download invoice PDF',
      error: error.message
    });
  }
};

export default {
  getInvoices,
  getInvoiceById,
  generateInvoice,
  sendInvoice,
  recordPayment,
  getInvoiceAnalytics,
  downloadInvoicePDF
};

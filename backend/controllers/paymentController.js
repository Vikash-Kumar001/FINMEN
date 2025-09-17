import PaymentGateway from "../models/PaymentGateway.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import FeePayment from "../models/FeePayment.js";
import User from "../models/User.js";
import { getTenantQuery, addTenantData } from "../middlewares/tenantMiddleware.js";
import crypto from "crypto";
import Razorpay from "razorpay";

// Payment Gateway Configuration
export const configurePaymentGateway = async (req, res) => {
  try {
    const {
      gatewayName,
      displayName,
      credentials,
      settings,
      webhooks,
    } = req.body;

    if (!gatewayName || !displayName || !credentials) {
      return res.status(400).json({
        message: "Gateway name, display name, and credentials are required",
      });
    }

    // Check if gateway already exists
    const existingGateway = await PaymentGateway.findOne(
      getTenantQuery(req, { gatewayName })
    );

    if (existingGateway) {
      return res.status(400).json({
        message: "Payment gateway already configured",
      });
    }

    // Encrypt sensitive credentials
    const encryptedCredentials = {
      ...credentials,
      keySecret: credentials.keySecret ? encrypt(credentials.keySecret) : undefined,
      merchantKey: credentials.merchantKey ? encrypt(credentials.merchantKey) : undefined,
      webhookSecret: credentials.webhookSecret ? encrypt(credentials.webhookSecret) : undefined,
    };

    const gatewayData = addTenantData(req, {
      gatewayName,
      displayName,
      credentials: encryptedCredentials,
      settings: settings || {},
      webhooks: webhooks || {},
      configuredBy: req.user.id,
    });

    const gateway = await PaymentGateway.create(gatewayData);

    res.status(201).json({
      message: "Payment gateway configured successfully",
      gateway: {
        ...gateway.toObject(),
        credentials: {
          ...gateway.credentials,
          keySecret: gateway.credentials.keySecret ? "[ENCRYPTED]" : undefined,
          merchantKey: gateway.credentials.merchantKey ? "[ENCRYPTED]" : undefined,
          webhookSecret: gateway.credentials.webhookSecret ? "[ENCRYPTED]" : undefined,
        },
      },
    });
  } catch (error) {
    console.error("Configure payment gateway error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaymentGateways = async (req, res) => {
  try {
    const { isActive } = req.query;

    const query = getTenantQuery(req, {});
    if (isActive !== undefined) query["settings.isActive"] = isActive === "true";

    const gateways = await PaymentGateway.find(query)
      .populate('configuredBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .sort({ "settings.isPrimary": -1, gatewayName: 1 });

    // Hide sensitive credentials
    const sanitizedGateways = gateways.map(gateway => ({
      ...gateway.toObject(),
      credentials: {
        ...gateway.credentials,
        keySecret: gateway.credentials.keySecret ? "[ENCRYPTED]" : undefined,
        merchantKey: gateway.credentials.merchantKey ? "[ENCRYPTED]" : undefined,
        webhookSecret: gateway.credentials.webhookSecret ? "[ENCRYPTED]" : undefined,
      },
    }));

    res.status(200).json({ gateways: sanitizedGateways });
  } catch (error) {
    console.error("Get payment gateways error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePaymentGateway = async (req, res) => {
  try {
    const { gatewayId } = req.params;
    const updateData = req.body;

    const gateway = await PaymentGateway.findOne(
      getTenantQuery(req, { _id: gatewayId })
    );

    if (!gateway) {
      return res.status(404).json({ message: "Payment gateway not found" });
    }

    // Encrypt sensitive credentials if provided
    if (updateData.credentials) {
      const encryptedCredentials = { ...gateway.credentials };
      
      if (updateData.credentials.keySecret) {
        encryptedCredentials.keySecret = encrypt(updateData.credentials.keySecret);
      }
      if (updateData.credentials.merchantKey) {
        encryptedCredentials.merchantKey = encrypt(updateData.credentials.merchantKey);
      }
      if (updateData.credentials.webhookSecret) {
        encryptedCredentials.webhookSecret = encrypt(updateData.credentials.webhookSecret);
      }
      
      updateData.credentials = encryptedCredentials;
    }

    updateData.lastUpdatedBy = req.user.id;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        gateway[key] = updateData[key];
      }
    });

    await gateway.save();

    res.status(200).json({
      message: "Payment gateway updated successfully",
      gateway: {
        ...gateway.toObject(),
        credentials: {
          ...gateway.credentials,
          keySecret: gateway.credentials.keySecret ? "[ENCRYPTED]" : undefined,
          merchantKey: gateway.credentials.merchantKey ? "[ENCRYPTED]" : undefined,
          webhookSecret: gateway.credentials.webhookSecret ? "[ENCRYPTED]" : undefined,
        },
      },
    });
  } catch (error) {
    console.error("Update payment gateway error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Payment Processing
export const initiatePayment = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      description,
      relatedEntity,
      paymentMethod,
      userDetails,
      metadata,
    } = req.body;

    if (!amount || !description || !relatedEntity) {
      return res.status(400).json({
        message: "Amount, description, and related entity are required",
      });
    }

    // Get primary payment gateway
    const gateway = await PaymentGateway.getPrimaryGateway(
      req.organization._id,
      req.organization.tenantId
    );

    if (!gateway) {
      return res.status(400).json({
        message: "No active payment gateway configured",
      });
    }

    // Generate transaction ID
    const transactionId = PaymentTransaction.generateTransactionId();

    // Create transaction record
    const transactionData = addTenantData(req, {
      transactionId,
      gatewayId: gateway._id,
      gatewayName: gateway.gatewayName,
      amount,
      currency,
      description,
      userId: req.user.id,
      userDetails: userDetails || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      relatedEntity,
      paymentMethod: paymentMethod || {},
      metadata: metadata || {},
      netAmount: amount,
    });

    const transaction = await PaymentTransaction.create(transactionData);

    // Calculate processing fee
    transaction.calculateProcessingFee(gateway);
    await transaction.save();

    // Initialize payment with gateway
    let gatewayResponse;
    try {
      gatewayResponse = await initializeGatewayPayment(gateway, transaction);
    } catch (gatewayError) {
      transaction.status = "failed";
      transaction.gatewayResponse = {
        success: false,
        message: gatewayError.message,
        errorCode: gatewayError.code,
      };
      await transaction.save();
      
      return res.status(400).json({
        message: "Payment initialization failed",
        error: gatewayError.message,
      });
    }

    // Update transaction with gateway response
    transaction.gatewayOrderId = gatewayResponse.orderId;
    transaction.gatewayTransactionId = gatewayResponse.transactionId;
    transaction.status = "pending";
    transaction.gatewayResponse = {
      success: true,
      message: "Payment initialized successfully",
      rawResponse: gatewayResponse,
    };
    await transaction.save();

    res.status(200).json({
      message: "Payment initiated successfully",
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
      },
      paymentDetails: gatewayResponse,
    });
  } catch (error) {
    console.error("Initiate payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, gatewayResponse } = req.body;

    if (!transactionId || !gatewayResponse) {
      return res.status(400).json({
        message: "Transaction ID and gateway response are required",
      });
    }

    const transaction = await PaymentTransaction.findOne(
      getTenantQuery(req, { transactionId })
    ).populate('gatewayId');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Verify payment with gateway
    let verificationResult;
    try {
      verificationResult = await verifyGatewayPayment(
        transaction.gatewayId,
        transaction,
        gatewayResponse
      );
    } catch (verificationError) {
      transaction.status = "failed";
      transaction.gatewayResponse = {
        success: false,
        message: verificationError.message,
        errorCode: verificationError.code,
        rawResponse: gatewayResponse,
      };
      await transaction.save();
      
      return res.status(400).json({
        message: "Payment verification failed",
        error: verificationError.message,
      });
    }

    // Update transaction status
    if (verificationResult.success) {
      transaction.status = "completed";
      transaction.completedAt = new Date();
      transaction.paymentMethod = {
        ...transaction.paymentMethod,
        ...verificationResult.paymentMethod,
      };
      
      // Update gateway statistics
      transaction.gatewayId.updateStatistics(transaction);
      await transaction.gatewayId.save();
      
      // Update related entity (e.g., fee payment)
      await updateRelatedEntity(transaction);
    } else {
      transaction.status = "failed";
    }

    transaction.gatewayResponse = {
      success: verificationResult.success,
      message: verificationResult.message,
      rawResponse: gatewayResponse,
    };
    
    await transaction.save();

    res.status(200).json({
      message: verificationResult.success ? "Payment verified successfully" : "Payment verification failed",
      transaction: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        amount: transaction.amount,
        completedAt: transaction.completedAt,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaymentTransactions = async (req, res) => {
  try {
    const {
      status,
      gatewayName,
      userId,
      entityType,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const query = getTenantQuery(req, { isActive: true });

    // Apply filters
    if (status) query.status = status;
    if (gatewayName) query.gatewayName = gatewayName;
    if (userId) query.userId = userId;
    if (entityType) query["relatedEntity.entityType"] = entityType;
    
    if (startDate && endDate) {
      query.initiatedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await PaymentTransaction.find(query)
      .populate('userId', 'name email')
      .populate('gatewayId', 'gatewayName displayName')
      .sort({ initiatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PaymentTransaction.countDocuments(query);

    res.status(200).json({
      transactions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get payment transactions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const initiateRefund = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { amount, reason } = req.body;

    if (!amount || !reason) {
      return res.status(400).json({
        message: "Refund amount and reason are required",
      });
    }

    const transaction = await PaymentTransaction.findOne(
      getTenantQuery(req, { transactionId })
    ).populate('gatewayId');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!transaction.canRefund()) {
      return res.status(400).json({
        message: "Transaction cannot be refunded",
      });
    }

    if (amount > (transaction.amount - transaction.totalRefunded)) {
      return res.status(400).json({
        message: "Refund amount exceeds available amount",
      });
    }

    // Process refund with gateway
    let refundResponse;
    try {
      refundResponse = await processGatewayRefund(
        transaction.gatewayId,
        transaction,
        amount,
        reason
      );
    } catch (refundError) {
      return res.status(400).json({
        message: "Refund processing failed",
        error: refundError.message,
      });
    }

    // Add refund to transaction
    const refundData = {
      refundId: refundResponse.refundId,
      amount,
      reason,
      status: refundResponse.status || "initiated",
      initiatedBy: req.user.id,
      gatewayRefundId: refundResponse.gatewayRefundId,
      gatewayResponse: refundResponse,
    };

    await transaction.addRefund(refundData);

    res.status(200).json({
      message: "Refund initiated successfully",
      refund: refundData,
    });
  } catch (error) {
    console.error("Initiate refund error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Payment Analytics
export const getPaymentAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, gatewayName } = req.query;

    const dateRange = startDate && endDate ? { startDate, endDate } : null;

    // Get overall statistics
    const overallStats = await PaymentTransaction.getTransactionStats(
      req.organization._id,
      req.organization.tenantId,
      dateRange
    );

    // Get gateway-wise statistics
    const gatewayStats = await PaymentTransaction.aggregate([
      {
        $match: {
          ...getTenantQuery(req, { isActive: true }),
          ...(dateRange && {
            initiatedAt: {
              $gte: new Date(dateRange.startDate),
              $lte: new Date(dateRange.endDate),
            },
          }),
          ...(gatewayName && { gatewayName }),
        },
      },
      {
        $group: {
          _id: "$gatewayName",
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          completedTransactions: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get daily transaction trends
    const dailyTrends = await PaymentTransaction.aggregate([
      {
        $match: {
          ...getTenantQuery(req, { isActive: true }),
          ...(dateRange && {
            initiatedAt: {
              $gte: new Date(dateRange.startDate),
              $lte: new Date(dateRange.endDate),
            },
          }),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$initiatedAt" },
          },
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          completedTransactions: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      analytics: {
        overall: overallStats,
        gatewayWise: gatewayStats,
        dailyTrends,
      },
    });
  } catch (error) {
    console.error("Get payment analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Webhook Handler
export const handleWebhook = async (req, res) => {
  try {
    const { gatewayName } = req.params;
    const webhookPayload = req.body;
    const signature = req.headers['x-razorpay-signature'] || req.headers['stripe-signature'];

    // Find gateway configuration
    const gateway = await PaymentGateway.findOne(
      getTenantQuery(req, { gatewayName, "settings.isActive": true })
    );

    if (!gateway) {
      return res.status(404).json({ message: "Gateway not found" });
    }

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(
      gateway,
      webhookPayload,
      signature
    );

    if (!isValidSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    // Process webhook
    await processWebhook(gateway, webhookPayload);

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Handle webhook error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper Functions
const encrypt = (text) => {
  const algorithm = 'aes-256-cbc';
  const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars!!';
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (text) => {
  const algorithm = 'aes-256-cbc';
  const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-32-chars!!';
  
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

const initializeGatewayPayment = async (gateway, transaction) => {
  switch (gateway.gatewayName) {
    case 'razorpay':
      return initializeRazorpayPayment(gateway, transaction);
    case 'stripe':
      return initializeStripePayment(gateway, transaction);
    default:
      throw new Error(`Unsupported gateway: ${gateway.gatewayName}`);
  }
};

const initializeRazorpayPayment = async (gateway, transaction) => {
  const razorpay = new Razorpay({
    key_id: gateway.credentials.keyId,
    key_secret: decrypt(gateway.credentials.keySecret),
  });

  const options = {
    amount: transaction.amount * 100, // Convert to paise
    currency: transaction.currency,
    receipt: transaction.transactionId,
    notes: {
      transactionId: transaction.transactionId,
      description: transaction.description,
    },
  };

  const order = await razorpay.orders.create(options);
  
  return {
    orderId: order.id,
    transactionId: transaction.transactionId,
    amount: transaction.amount,
    currency: transaction.currency,
    keyId: gateway.credentials.keyId,
    gatewayName: 'razorpay',
  };
};

const initializeStripePayment = async (gateway, transaction) => {
  // Stripe implementation would go here
  throw new Error('Stripe integration not implemented yet');
};

const verifyGatewayPayment = async (gateway, transaction, gatewayResponse) => {
  switch (gateway.gatewayName) {
    case 'razorpay':
      return verifyRazorpayPayment(gateway, transaction, gatewayResponse);
    case 'stripe':
      return verifyStripePayment(gateway, transaction, gatewayResponse);
    default:
      throw new Error(`Unsupported gateway: ${gateway.gatewayName}`);
  }
};

const verifyRazorpayPayment = async (gateway, transaction, gatewayResponse) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = gatewayResponse;
  
  const expectedSignature = crypto
    .createHmac('sha256', decrypt(gateway.credentials.keySecret))
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    throw new Error('Invalid payment signature');
  }

  // Fetch payment details from Razorpay
  const razorpay = new Razorpay({
    key_id: gateway.credentials.keyId,
    key_secret: decrypt(gateway.credentials.keySecret),
  });

  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  
  return {
    success: payment.status === 'captured',
    message: payment.status === 'captured' ? 'Payment successful' : 'Payment failed',
    paymentMethod: {
      type: payment.method,
      details: {
        cardType: payment.card?.type,
        cardNetwork: payment.card?.network,
        last4Digits: payment.card?.last4,
        bankName: payment.bank,
      },
    },
  };
};

const verifyStripePayment = async (gateway, transaction, gatewayResponse) => {
  // Stripe verification implementation would go here
  throw new Error('Stripe verification not implemented yet');
};

const processGatewayRefund = async (gateway, transaction, amount, reason) => {
  switch (gateway.gatewayName) {
    case 'razorpay':
      return processRazorpayRefund(gateway, transaction, amount, reason);
    case 'stripe':
      return processStripeRefund(gateway, transaction, amount, reason);
    default:
      throw new Error(`Unsupported gateway: ${gateway.gatewayName}`);
  }
};

const processRazorpayRefund = async (gateway, transaction, amount, reason) => {
  const razorpay = new Razorpay({
    key_id: gateway.credentials.keyId,
    key_secret: decrypt(gateway.credentials.keySecret),
  });

  const refund = await razorpay.payments.refund(transaction.gatewayTransactionId, {
    amount: amount * 100, // Convert to paise
    notes: {
      reason: reason,
      transactionId: transaction.transactionId,
    },
  });

  return {
    refundId: refund.id,
    gatewayRefundId: refund.id,
    status: refund.status === 'processed' ? 'completed' : 'processing',
    amount: refund.amount / 100, // Convert back to rupees
  };
};

const processStripeRefund = async (gateway, transaction, amount, reason) => {
  // Stripe refund implementation would go here
  throw new Error('Stripe refund not implemented yet');
};

const verifyWebhookSignature = (gateway, payload, signature) => {
  // Implementation depends on gateway
  return true; // Simplified for now
};

const processWebhook = async (gateway, payload) => {
  // Process webhook based on event type
  console.log('Processing webhook:', payload);
};

const updateRelatedEntity = async (transaction) => {
  if (transaction.relatedEntity.entityType === 'fee_payment') {
    await FeePayment.findByIdAndUpdate(
      transaction.relatedEntity.entityId,
      {
        status: 'completed',
        'paymentDetails.paymentDate': transaction.completedAt,
        'paymentDetails.transactionId': transaction.transactionId,
        'paymentDetails.paymentMode': 'online',
      }
    );
  }
};
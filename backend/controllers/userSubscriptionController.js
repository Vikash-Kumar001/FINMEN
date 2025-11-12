import UserSubscription from '../models/UserSubscription.js';
import User from '../models/User.js';
import Stripe from 'stripe';
import crypto from 'crypto';

// Initialize Stripe only if secret key is available
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.error('Stripe initialization error:', error);
}

// Plan configurations
const YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
const RENEWAL_WINDOW_DAYS = 45;

const normalizeContext = (context, userRole) => {
  const allowed = ['student', 'parent', 'admin', 'system'];
  if (context && allowed.includes(context)) {
    return context;
  }
  if (userRole && allowed.includes(userRole)) {
    return userRole;
  }
  return 'student';
};

const buildInitiatorProfile = (user, contextOverride) => ({
  userId: user._id,
  role: user.role,
  name: user.name || user.fullName || 'Unknown',
  email: user.email,
  context: normalizeContext(contextOverride, user.role),
});

const finalizeSubscriptionPayment = async (subscription, paymentIntent) => {
  if (!subscription || !paymentIntent) {
    return { updated: false };
  }

  const paymentIntentId = paymentIntent.id;
  const transaction = subscription.transactions?.find(
    (tx) => tx.stripePaymentIntentId === paymentIntentId
  );

  if (!transaction) {
    return { updated: false };
  }

  const now = new Date();

  transaction.status = 'completed';
  transaction.paymentDate = now;
  transaction.receiptUrl = paymentIntent.charges?.data[0]?.receipt_url || null;
  transaction.metadata = {
    ...(transaction.metadata || {}),
    paymentIntentStatus: paymentIntent.status,
  };

  subscription.status = 'active';

  const baseDate = (() => {
    if (!subscription.endDate) {
      return now;
    }
    const existingEnd = new Date(subscription.endDate);
    return existingEnd > now ? existingEnd : now;
  })();

  subscription.endDate = new Date(baseDate.getTime() + YEAR_IN_MS);
  subscription.lastPaymentAt = now;

  if (transaction.mode === 'renewal') {
    subscription.renewalCount = (subscription.renewalCount || 0) + 1;
    subscription.lastRenewedBy = {
      ...(transaction.initiatedBy || {}),
      renewedAt: now,
    };
  } else if (!subscription.purchasedBy?.userId) {
    subscription.purchasedBy = {
      ...(transaction.initiatedBy || {}),
      purchasedAt: now,
    };
  }

  await subscription.save();

  return {
    updated: true,
    subscription,
    transaction,
  };
};

const PLAN_CONFIGS = {
  free: {
    name: 'Free Plan',
    amount: 0,
    firstYearAmount: 0,
    renewalAmount: 0,
    features: {
      fullAccess: false,
      parentDashboard: false,
      advancedAnalytics: false,
      certificates: false,
      wiseClubAccess: false,
      inavoraAccess: false,
      gamesPerPillar: 5,
      totalGames: 50,
    },
  },
  student_premium: {
    name: 'Students Premium Plan',
    firstYearAmount: 4499,
    renewalAmount: 999,
    features: {
      fullAccess: true,
      parentDashboard: false,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1, // Unlimited
      totalGames: 2200,
    },
  },
  student_parent_premium_pro: {
    name: 'Student + Parent Premium Pro Plan',
    firstYearAmount: 4999,
    renewalAmount: 1499,
    features: {
      fullAccess: true,
      parentDashboard: true,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1, // Unlimited
      totalGames: 2200,
    },
  },
  educational_institutions_premium: {
    name: 'Educational Institutions Premium Plan',
    firstYearAmount: 0,
    renewalAmount: 0,
    features: {
      fullAccess: true,
      parentDashboard: true,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1,
      totalGames: 2200,
    },
  },
};

// Create payment intent for subscription
export const createSubscriptionPayment = async (req, res) => {
  try {
    const {
      planType,
      context: requestedContext,
      mode: requestedMode,
    } = req.body;

    const user = req.user;
    const userId = user.id;
    const context = normalizeContext(requestedContext, user.role);
    const mode = requestedMode === 'renew' ? 'renewal' : 'purchase';

    if (!planType || !PLAN_CONFIGS[planType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan type',
      });
    }

    if (planType === 'educational_institutions_premium') {
      return res.status(403).json({
        success: false,
        message: 'Educational plans are provisioned directly by your institution.',
      });
    }

    if ((user.role === 'parent' || context === 'parent') && planType !== 'student_parent_premium_pro') {
      return res.status(400).json({
        success: false,
        message: 'Parents can only purchase the Student + Parent Premium Pro Plan',
      });
    }

    const planConfig = PLAN_CONFIGS[planType];

    // Determine initiator
    const initiator = buildInitiatorProfile(user, context);

    // Load current subscriptions
    const existingActiveSubscription = await UserSubscription.getActiveSubscription(userId);
    const latestPlanSubscription = await UserSubscription.findOne({ userId, planType })
      .sort({ createdAt: -1 });

    const hasCompletedPlanBefore = Boolean(
      latestPlanSubscription &&
      (latestPlanSubscription.status === 'active' ||
        latestPlanSubscription.transactions?.some(tx => tx.status === 'completed'))
    );

    const isRenewalFlow = mode === 'renewal' || hasCompletedPlanBefore;
    const isFirstYear = !hasCompletedPlanBefore;

    if (existingActiveSubscription && existingActiveSubscription.planType === planType) {
      if (!isRenewalFlow) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active subscription for this plan',
        });
      }
    }

    const amount = isFirstYear ? planConfig.firstYearAmount : planConfig.renewalAmount;

    if (amount === 0) {
      // Free plan - activate immediately
      const subscription = await UserSubscription.create({
        userId,
        planType,
        planName: planConfig.name,
        amount: 0,
        firstYearAmount: planConfig.firstYearAmount,
        renewalAmount: planConfig.renewalAmount,
        isFirstYear: true,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + YEAR_IN_MS),
        features: planConfig.features,
        purchasedBy: {
          ...initiator,
          purchasedAt: new Date(),
        },
        transactions: [{
          transactionId: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          amount: 0,
          currency: 'INR',
          status: 'completed',
          mode: 'purchase',
          initiatedBy: initiator,
          paymentDate: new Date(),
        }],
      });

      const io = req.app.get('io');
      if (io) {
        const payload = subscription.toObject();
        io.to(userId.toString()).emit('subscription:activated', {
          subscription: payload,
        });
        io.emit('subscription:activated', {
          userId: userId.toString(),
          subscription: payload,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Free plan activated successfully',
        subscription,
      });
    }

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please contact support.',
      });
    }

    let stripeCustomerId;
    const userDoc = await User.findById(userId);

    if (!userDoc?.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for payment',
      });
    }

    const userSub = await UserSubscription.findOne({ userId }).sort({ createdAt: -1 });
    if (userSub?.stripeCustomerId) {
      stripeCustomerId = userSub.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: userDoc.email,
        name: userDoc.name || userDoc.fullName,
        metadata: {
          userId: userId.toString(),
        },
      });
      stripeCustomerId = customer.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      customer: stripeCustomerId,
      payment_method_types: ['card', 'upi', 'netbanking'],
      metadata: {
        userId: userId.toString(),
        planType,
        isFirstYear: isFirstYear.toString(),
        mode,
        context,
        initiatedByRole: user.role,
      },
      description: `Subscription: ${planConfig.name}`,
    });

    const transactionId = `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const transactionPayload = {
      transactionId,
      amount,
      currency: 'INR',
      status: 'pending',
      mode,
      initiatedBy: initiator,
      stripePaymentIntentId: paymentIntent.id,
    };

    let subscription;

    if (existingActiveSubscription && existingActiveSubscription.planType === planType) {
      subscription = existingActiveSubscription;
      subscription.transactions = subscription.transactions || [];
      subscription.transactions.push(transactionPayload);
      subscription.lastRenewedBy = {
        ...initiator,
        renewedAt: null,
      };
      await subscription.save();
    } else {
      subscription = await UserSubscription.create({
        userId,
        planType,
        planName: planConfig.name,
        amount,
        firstYearAmount: planConfig.firstYearAmount,
        renewalAmount: planConfig.renewalAmount,
        isFirstYear,
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(Date.now() + YEAR_IN_MS),
        stripeCustomerId,
        features: planConfig.features,
        purchasedBy: isFirstYear ? { ...initiator, purchasedAt: new Date() } : undefined,
        renewalCount: 0,
        transactions: [transactionPayload],
      });
    }

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription._id,
      amount,
      currency: 'INR',
      mode,
      isFirstYear,
    });
  } catch (error) {
    console.error('Create subscription payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

// Verify and activate subscription after payment
export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { subscriptionId, paymentIntentId } = req.body;
    const userId = req.user.id;

    if (!subscriptionId || !paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID and payment intent ID are required',
      });
    }

    const subscription = await UserSubscription.findOne({
      _id: subscriptionId,
      userId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: `Payment ${paymentIntent.status}`,
      });
    }

    // Locate matching transaction
    const transaction = subscription.transactions?.find(
      (tx) => tx.stripePaymentIntentId === paymentIntentId
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Matching transaction not found for this payment',
      });
    }

    const { updated, subscription: updatedSubscription } = await finalizeSubscriptionPayment(
      subscription,
      paymentIntent,
    );

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Unable to finalize subscription payment',
      });
    }

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const subscriptionData = updatedSubscription.toObject
        ? updatedSubscription.toObject()
        : updatedSubscription;
      // Emit to user's room (all their connected clients)
      io.to(userId.toString()).emit('subscription:activated', {
        userId: userId.toString(),
        subscription: subscriptionData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription activated successfully',
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error('Verify subscription payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

// Get user's current subscription
export const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await UserSubscription.getActiveSubscription(userId);
    
    if (!subscription) {
      // Return free plan defaults
      const freePlan = {
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: PLAN_CONFIGS.free.features,
        isFirstYear: true,
        amount: 0,
      };
      return res.status(200).json({
        success: true,
        subscription: freePlan,
      });
    }

    // Add computed fields for frontend
    const subscriptionData = subscription.toObject ? subscription.toObject() : subscription;
    subscriptionData.daysRemaining = subscription.daysRemaining ? subscription.daysRemaining() : null;
    subscriptionData.latestTransaction = subscriptionData.transactions?.length
      ? subscriptionData.transactions[subscriptionData.transactions.length - 1]
      : null;

    if (subscriptionData.endDate) {
      const endDate = new Date(subscriptionData.endDate);
      const now = new Date();
      const renewalWindowStart = new Date(endDate.getTime() - RENEWAL_WINDOW_DAYS * 24 * 60 * 60 * 1000);
      subscriptionData.isRenewalDue = endDate <= now;
      subscriptionData.isWithinRenewalWindow = now >= renewalWindowStart;
    } else {
      subscriptionData.isRenewalDue = false;
      subscriptionData.isWithinRenewalWindow = true;
    }

    res.status(200).json({
      success: true,
      subscription: subscriptionData,
    });
  } catch (error) {
    console.error('Get current subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message,
    });
  }
};

// Get subscription history
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await UserSubscription.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(); // Use lean() for better performance

    // Format subscriptions for frontend
    const formattedSubscriptions = subscriptions.map(sub => ({
      ...sub,
      planName: sub.planName || PLAN_CONFIGS[sub.planType]?.name || 'Unknown Plan',
      amount: sub.amount || (sub.isFirstYear ? PLAN_CONFIGS[sub.planType]?.firstYearAmount : PLAN_CONFIGS[sub.planType]?.renewalAmount) || 0,
    }));

    res.status(200).json({
      success: true,
      subscriptions: formattedSubscriptions,
    });
  } catch (error) {
    console.error('Get subscription history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription history',
      error: error.message,
    });
  }
};

export const getSubscriptionTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscriptions = await UserSubscription.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();

    const activeSubscription = subscriptions.find((sub) => {
      if (sub.status !== 'active') return false;
      if (!sub.endDate) return true;
      return new Date(sub.endDate) > now;
    }) || null;

    const transactions = [];
    let totalSpend = 0;
    let totalRenewals = 0;
    let lastPaymentDate = null;

    subscriptions.forEach((sub) => {
      const planName = sub.planName || PLAN_CONFIGS[sub.planType]?.name || 'Unknown Plan';

      (sub.transactions || []).forEach((tx) => {
        const paymentDate = tx.paymentDate ? new Date(tx.paymentDate) : null;
        const createdAt = tx.createdAt ? new Date(tx.createdAt) : new Date(sub.createdAt);
        const mode = tx.mode || (sub.isFirstYear ? 'purchase' : 'renewal');
        const status = tx.status || 'pending';
        const amount = typeof tx.amount === 'number' ? tx.amount : (sub.amount || 0);

        if (status === 'completed') {
          totalSpend += amount;
          if (mode === 'renewal') {
            totalRenewals += 1;
          }
          if (paymentDate && (!lastPaymentDate || paymentDate > lastPaymentDate)) {
            lastPaymentDate = paymentDate;
          }
        }

        transactions.push({
          transactionId: tx.transactionId,
          subscriptionId: sub._id,
          planType: sub.planType,
          planName,
          amount,
          currency: tx.currency || 'INR',
          status,
          mode,
          paymentDate,
          createdAt,
          receiptUrl: tx.receiptUrl,
          initiatedBy: tx.initiatedBy || sub.purchasedBy || null,
          metadata: tx.metadata || {},
        });
      });
    });

    transactions.sort((a, b) => {
      const aDate = a.paymentDate || a.createdAt;
      const bDate = b.paymentDate || b.createdAt;
      return new Date(bDate) - new Date(aDate);
    });

    res.status(200).json({
      success: true,
      transactions,
      summary: {
        totalSpend,
        totalTransactions: transactions.length,
        totalRenewals,
        lastPaymentDate,
        nextRenewalDate: activeSubscription?.endDate || null,
        activePlan: activeSubscription
          ? {
              planName: activeSubscription.planName || PLAN_CONFIGS[activeSubscription.planType]?.name,
              planType: activeSubscription.planType,
              status: activeSubscription.status,
              endDate: activeSubscription.endDate,
              renewalCount: activeSubscription.renewalCount || 0,
              purchasedBy: activeSubscription.purchasedBy || null,
              lastRenewedBy: activeSubscription.lastRenewedBy || null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Get subscription transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription transactions',
      error: error.message,
    });
  }
};

export const updateAutoRenewSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      enabled,
      method,
      paymentMethodId,
      paymentMethodLabel,
      lastFour,
      brand,
    } = req.body || {};

    if (typeof enabled !== 'boolean' && !method && !paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to update',
      });
    }

    const subscription = await UserSubscription.getActiveSubscription(userId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    const nextEnabled = typeof enabled === 'boolean'
      ? enabled
      : subscription.autoRenewSettings?.enabled ?? subscription.autoRenew ?? false;

    const nextMethod = method || subscription.autoRenewSettings?.method || 'card';

    subscription.autoRenew = nextEnabled;
    subscription.autoRenewSettings = {
      ...(subscription.autoRenewSettings?.toObject
        ? subscription.autoRenewSettings.toObject()
        : subscription.autoRenewSettings),
      enabled: nextEnabled,
      method: nextMethod,
      paymentMethodId: paymentMethodId || subscription.autoRenewSettings?.paymentMethodId || null,
      paymentMethodLabel: paymentMethodLabel || subscription.autoRenewSettings?.paymentMethodLabel || null,
      lastFour: lastFour || subscription.autoRenewSettings?.lastFour || null,
      brand: brand || subscription.autoRenewSettings?.brand || null,
      mandateStatus: subscription.autoRenewSettings?.mandateStatus || (nextEnabled ? 'pending' : 'not_required'),
      nextDebitDate: subscription.endDate || subscription.autoRenewSettings?.nextDebitDate || null,
      updatedAt: new Date(),
      updatedBy: {
        userId: req.user._id || req.user.id,
        role: req.user.role,
        name: req.user.name || req.user.fullName,
        email: req.user.email,
      },
    };

    if (paymentMethodId) {
      subscription.stripePaymentMethodId = paymentMethodId;
    }

    await subscription.save();

    const io = req.app.get('io');
    if (io) {
      const payload = subscription.toObject ? subscription.toObject() : subscription;
      io.to(userId.toString()).emit('subscription:autoRenewUpdated', {
        userId: userId.toString(),
        subscription: payload,
      });
    }

    res.status(200).json({
      success: true,
      message: `Auto-renew ${nextEnabled ? 'enabled' : 'disabled'} successfully`,
      subscription,
    });
  } catch (error) {
    console.error('Update auto-renew settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update auto-renew settings',
      error: error.message,
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const subscription = await UserSubscription.getActiveSubscription(userId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.autoRenew = false;

    // Cancel Stripe subscription if exists
    if (subscription.stripeSubscriptionId && stripe) {
      try {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } catch (error) {
        console.error('Error cancelling Stripe subscription:', error);
      }
    }

    await subscription.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      const subscriptionData = subscription.toObject ? subscription.toObject() : subscription;
      subscriptionData.daysRemaining = subscription.daysRemaining ? subscription.daysRemaining() : null;
      io.to(userId.toString()).emit('subscription:cancelled', {
        userId: userId.toString(),
        subscription: subscriptionData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription,
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message,
    });
  }
};

// Handle Stripe webhook
export const handleStripeWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          const subscription = await UserSubscription.findOne({
            userId,
            'transactions.stripePaymentIntentId': paymentIntent.id,
          });

          if (subscription) {
            const { updated } = await finalizeSubscriptionPayment(subscription, paymentIntent);

            if (updated) {
              const io = req.app.get('io');
              if (io) {
                const payload = subscription.toObject ? subscription.toObject() : subscription;
                io.to(userId.toString()).emit('subscription:activated', {
                  userId: userId.toString(),
                  subscription: payload,
                });
              }
            }
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          const subscription = await UserSubscription.findOne({
            userId,
            'transactions.stripePaymentIntentId': paymentIntent.id,
          });

          if (subscription) {
            const transaction = subscription.transactions.find(
              t => t.stripePaymentIntentId === paymentIntent.id
            );
            if (transaction) {
              transaction.status = 'failed';
              transaction.metadata = {
                ...(transaction.metadata || {}),
                paymentIntentStatus: paymentIntent.status,
                failureReason: paymentIntent.last_payment_error?.message,
              };
            }
            await subscription.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};


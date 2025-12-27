import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Crown, RefreshCw, Users, Shield, HeartHandshake, TrendingUp, BarChart3, Calendar, CalendarClock, Sparkles, ArrowRight, Loader2, Star, MessageCircleHeart, LineChart, ShieldCheck, Zap, Heart, CreditCard, Clock, AlertCircle, Receipt, Download, X, CheckCircle
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

const PARENT_PLAN = {
  planType: 'student_parent_premium_pro',
  name: 'Student + Parent Premium Pro Plan',
  tagline: 'The complete wellbeing & progress suite for modern families',
  firstYearPrice: 4999,
  renewalPrice: 1499,
  billingFrequency: 'per year',
  highlights: [
    'Personalised growth journeys for every child',
    'Parent mental wellness & coaching support',
    'Family dashboard with real-time insights',
    'Smart alerts for academic & emotional changes',
  ],
  features: [
    {
      title: 'Family Dashboard',
      icon: Users,
      description: 'Monitor academic, emotional and extracurricular progress with AI-powered insights.'
    },
    {
      title: 'Parent Wellness Hub',
      icon: MessageCircleHeart,
      description: 'Workshops, guided reflections and tools designed for mindful parenting.'
    },
    {
      title: 'Expert Support',
      icon: HeartHandshake,
      description: 'Access certified counsellors, growth coaches and curated learning journeys.'
    },
    {
      title: 'Advanced Analytics',
      icon: LineChart,
      description: 'Predictive alerts, comparison benchmarks and individualised growth recommendations.'
    },
  ],
  extras: [
    {
      title: 'Real-time Notifications',
      description: 'Instant alerts for wins, wellbeing shifts and upcoming milestones.'
    },
    {
      title: 'Progress Reports',
      description: 'Monthly deep-dive reports with actionable insights and curated challenges.'
    },
    {
      title: 'Co-learning Experiences',
      description: 'Family challenges, weekend workshops and collaborative learning missions.'
    },
  ],
};

const PARENT_DASHBOARD_PLAN = {
  planType: 'parent_dashboard',
  name: 'Parent Dashboard Plan',
  tagline: 'Parent dashboard access for existing premium plans',
  renewalPrice: 1000,
  billingFrequency: 'per year',
  highlights: [
    'Parent dashboard access',
    'Monitor your child\'s progress',
    'Real-time insights and updates',
    'Family progress tracking',
  ],
  features: [
    {
      title: 'Parent Dashboard',
      icon: Users,
      description: 'Access to parent dashboard to monitor your child\'s academic and emotional progress.'
    },
    {
      title: 'Progress Tracking',
      icon: LineChart,
      description: 'Track your child\'s learning journey and achievements in real-time.'
    },
    {
      title: 'Family Insights',
      icon: HeartHandshake,
      description: 'Get insights into your child\'s wellbeing and academic performance.'
    },
  ],
};

const AUTO_RENEW_METHODS = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'upi', label: 'UPI AutoPay' },
  { value: 'netbanking', label: 'NetBanking Standing Instruction' },
  { value: 'manual', label: 'Manual Payment Reminders' },
];

const ParentUpgrade = () => {
  const navigate = useNavigate();
  const { subscription, refreshSubscription } = useSubscription();
  const socket = useSocket();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const autoRenewSettings = subscription?.autoRenewSettings || null;
  const [autoRenewForm, setAutoRenewForm] = useState({
    enabled: autoRenewSettings?.enabled ?? subscription?.autoRenew ?? false,
    method: autoRenewSettings?.method || AUTO_RENEW_METHODS[0].value,
  });
  const [autoRenewUpdating, setAutoRenewUpdating] = useState(false);

  useEffect(() => {
    setAutoRenewForm({
      enabled: autoRenewSettings?.enabled ?? subscription?.autoRenew ?? false,
      method: autoRenewSettings?.method || AUTO_RENEW_METHODS[0].value,
    });
  }, [
    autoRenewSettings?.enabled,
    autoRenewSettings?.method,
    subscription?.autoRenew,
  ]);

  // Prevent background scrolling when plan selection modal is open
  useEffect(() => {
    if (showPlanSelection) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showPlanSelection]);

  const isPremium = subscription?.planType === PARENT_PLAN.planType && subscription?.status === 'active';
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    [],
  );

  const hasParentPlanHistory = useMemo(
    () => history?.some((entry) => entry.planType === PARENT_PLAN.planType && entry.status !== 'pending'),
    [history],
  );

  const canUpgrade = !isPremium;
  const canRenew =
    subscription?.planType === PARENT_PLAN.planType &&
    (subscription?.isWithinRenewalWindow || subscription?.isRenewalDue);
  const renewDisabledReason = useMemo(() => {
    if (subscription?.planType !== PARENT_PLAN.planType) {
      return 'Activate the premium plan to enable renewals.';
    }
    if (canRenew) return null;
    if (!subscription?.endDate) return 'Renewals will be available closer to your billing date.';
    return 'Renewals open 45 days before your term ends.';
  }, [subscription?.planType, subscription?.endDate, canRenew]);

  const nextRenewalDate = useMemo(
    () => (subscription?.endDate ? new Date(subscription.endDate) : null),
    [subscription?.endDate],
  );
  const lastPaymentDate = useMemo(
    () =>
      transactionSummary?.lastPaymentDate
        ? new Date(transactionSummary.lastPaymentDate)
        : null,
    [transactionSummary?.lastPaymentDate],
  );

  const formatShortDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '—';
    }
  };

  const selectedAutoRenewMethod =
    AUTO_RENEW_METHODS.find((option) => option.value === autoRenewForm.method) ||
    AUTO_RENEW_METHODS[0];
  const autoRenewNextDebit = autoRenewForm.enabled
    ? formatShortDate(autoRenewSettings?.nextDebitDate || subscription?.endDate)
    : 'Not scheduled';
  const autoRenewStatusText = autoRenewForm.enabled
    ? `Auto debit active · Next charge ${autoRenewNextDebit}`
    : 'Auto debit is off. We will remind you before renewal.';
  const autoRenewUpdatedAt = autoRenewSettings?.updatedAt
    ? formatDateTime(autoRenewSettings.updatedAt)
    : null;

  const planInvestmentPrice = useMemo(() => {
    if (subscription?.planType === PARENT_PLAN.planType && subscription?.status === 'active') {
      return subscription?.isFirstYear ? PARENT_PLAN.firstYearPrice : PARENT_PLAN.renewalPrice;
    }
    if (hasParentPlanHistory) {
      return PARENT_PLAN.renewalPrice;
    }
    return PARENT_PLAN.firstYearPrice;
  }, [
    hasParentPlanHistory,
    subscription?.isFirstYear,
    subscription?.planType,
    subscription?.status,
  ]);

  const planInvestmentLabel = planInvestmentPrice === PARENT_PLAN.firstYearPrice
    ? 'First year access · premium onboarding & multi-child coverage'
    : 'Renewal pricing · keep premium analytics & wellbeing support unlocked';

  const sendAutoRenewUpdate = useCallback(
    async ({ enabled, method }) => {
      const methodMeta = AUTO_RENEW_METHODS.find((option) => option.value === method);
      setAutoRenewUpdating(true);
      try {
        const response = await api.patch('/api/subscription/auto-renew', {
          enabled,
          method,
          paymentMethodLabel: methodMeta?.label,
        });
        if (response.data?.success && response.data.subscription) {
          const updated = response.data.subscription;
          setAutoRenewForm({
            enabled: updated.autoRenewSettings?.enabled ?? updated.autoRenew ?? false,
            method: updated.autoRenewSettings?.method || AUTO_RENEW_METHODS[0].value,
          });
          toast.success(`Auto debit ${enabled ? 'enabled' : 'disabled'} successfully`);
          await refreshSubscription();
        }
      } catch (error) {
        console.error('Error updating auto-renew settings:', error);
        toast.error(error.response?.data?.message || 'Failed to update auto debit settings');
        setAutoRenewForm({
          enabled: subscription?.autoRenewSettings?.enabled ?? subscription?.autoRenew ?? false,
          method: subscription?.autoRenewSettings?.method || AUTO_RENEW_METHODS[0].value,
        });
      } finally {
        setAutoRenewUpdating(false);
      }
    },
    [refreshSubscription, subscription?.autoRenewSettings?.enabled, subscription?.autoRenewSettings?.method, subscription?.autoRenew],
  );

  const handleAutoRenewToggle = useCallback(async () => {
    if (autoRenewUpdating) return;
    const nextEnabled = !autoRenewForm.enabled;
    setAutoRenewForm((prev) => ({ ...prev, enabled: nextEnabled }));
    await sendAutoRenewUpdate({ enabled: nextEnabled, method: autoRenewForm.method });
  }, [autoRenewUpdating, autoRenewForm.enabled, autoRenewForm.method, sendAutoRenewUpdate]);

  const handleAutoRenewMethodChange = useCallback(
    async (event) => {
      const nextMethod = event.target.value;
      if (autoRenewUpdating || nextMethod === autoRenewForm.method) {
        return;
      }
      setAutoRenewForm((prev) => ({ ...prev, method: nextMethod }));
      await sendAutoRenewUpdate({ enabled: autoRenewForm.enabled, method: nextMethod });
    },
    [autoRenewUpdating, autoRenewForm.enabled, autoRenewForm.method, sendAutoRenewUpdate],
  );

  const statusTone = {
    active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    failed: 'bg-rose-100 text-rose-600 border border-rose-200',
    cancelled: 'bg-gray-100 text-gray-700 border border-gray-200',
    expired: 'bg-gray-100 text-gray-700 border border-gray-200',
    refunded: 'bg-blue-100 text-blue-700 border border-blue-200',
  };

  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get('/api/subscription/history');
      if (response.data.success) {
        setHistory(response.data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching subscription history:', error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);
      const response = await api.get('/api/subscription/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions || []);
        setTransactionSummary(response.data.summary || null);
      }
    } catch (error) {
      console.error('Error fetching subscription transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  const initializeRazorpayPayment = useCallback(
    async (orderId, keyId, amount, currentSubscriptionId) => {
      try {
        const Razorpay = await loadRazorpay();
        if (!Razorpay) {
          throw new Error('Payment gateway not available right now.');
        }

        const options = {
          key: keyId,
          amount: Math.round(amount * 100), // Convert to paise
          currency: 'INR',
          name: 'Wise Student',
          description: `Subscription: ${PARENT_PLAN.name}`,
          order_id: orderId,
          handler: async function (response) {
            // Payment successful
            setPaymentLoading(true);
            try {
              const verifyResponse = await api.post('/api/subscription/verify-payment', {
                subscriptionId: currentSubscriptionId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyResponse.data.success) {
                toast.success('Payment successful! Your subscription is now active.');
                await refreshSubscription();
                fetchHistory();
                fetchTransactions();

                if (socket?.socket) {
                  socket.socket.emit('subscription:activated', {
                    subscription: verifyResponse.data.subscription,
                  });
                }
              } else {
                throw new Error(verifyResponse.data.message || 'Failed to activate subscription');
              }
            } catch (verifyError) {
              console.error('Subscription activation error:', verifyError);
              toast.error('Payment succeeded but subscription activation failed. Please contact support.');
            } finally {
              setPaymentLoading(false);
            }
          },
          prefill: {
            name: user?.name || user?.fullName || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#6366f1',
          },
          modal: {
            ondismiss: async function () {
              setPaymentLoading(false);
              
              // Update backend to mark payment as cancelled
              if (currentSubscriptionId) {
                try {
                  await api.post('/api/subscription/cancel-payment', {
                    subscriptionId: currentSubscriptionId,
                  });
                  // Refresh transactions and history after cancellation
                  fetchTransactions();
                  fetchHistory();
                  await refreshSubscription();
                } catch (error) {
                  console.error('Error cancelling payment:', error);
                }
              }
            },
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
        setPaymentLoading(true);
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        toast.error(error.message || 'Unable to initialize payment.');
        setPaymentLoading(false);
      }
    },
    [socket, refreshSubscription, user, fetchHistory, fetchTransactions],
  );

  const handlePlanCheckout = useCallback(
    async (mode = 'purchase', selectedPlanType = PARENT_PLAN.planType) => {
      const normalizedMode = mode === 'renew' ? 'renew' : 'purchase';
      
      // Determine amount based on selected plan
      let amount;
      if (selectedPlanType === 'parent_dashboard') {
        amount = PARENT_DASHBOARD_PLAN.renewalPrice;
      } else {
        const nextIsFirstYear = normalizedMode === 'renew' ? false : !hasParentPlanHistory;
        amount = normalizedMode === 'renew' || !nextIsFirstYear
          ? PARENT_PLAN.renewalPrice
          : PARENT_PLAN.firstYearPrice;
      }

      try {
        setPaymentLoading(true);
        setShowPlanSelection(false);
        
        const response = await api.post('/api/subscription/create-payment', {
          planType: selectedPlanType === 'parent_dashboard' ? PARENT_PLAN.planType : selectedPlanType,
          context: 'parent',
          mode: normalizedMode,
          amount: selectedPlanType === 'parent_dashboard' ? PARENT_DASHBOARD_PLAN.renewalPrice : undefined,
        });

        if (response.data.success) {
          const currentSubscriptionId = response.data.subscriptionId;
          const responseAmount = response.data.amount || amount; // Use backend amount if provided
          setSubscriptionId(currentSubscriptionId);
          await initializeRazorpayPayment(response.data.orderId, response.data.keyId, responseAmount, currentSubscriptionId);
        } else {
          throw new Error(response.data.message || 'Failed to initialize payment');
        }
      } catch (error) {
        console.error('Payment initialization error:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to initialize payment');
        setPaymentLoading(false);
      }
    },
    [hasParentPlanHistory, initializeRazorpayPayment],
  );

  const planStatus = subscription?.status || (isPremium ? 'active' : 'free');
  const statusBadgeClass =
    statusTone[planStatus] || 'bg-slate-100 text-slate-700 border border-slate-200';
  const planStatusLabel = planStatus
    ? planStatus.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Free Plan';
  const purchasedBy =
    subscription?.purchasedBy || subscription?.latestTransaction?.initiatedBy || null;

  const modeLabel = (mode) => {
    switch (mode) {
      case 'renewal':
        return 'Renewal';
      case 'upgrade':
        return 'Upgrade';
      default:
        return 'Purchase';
    }
  };

  const summaryCards = useMemo(
    () => [
      {
        title: 'Current status',
        value: planStatusLabel,
        description: isPremium
          ? 'Full access to premium analytics and wellbeing insights.'
          : 'Premium dashboard awaiting activation.',
        icon: ShieldCheck,
        tone: isPremium ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-slate-600 bg-slate-50 border border-slate-100',
      },
      {
        title: 'Transactions tracked',
        value: transactionSummary?.totalTransactions
          ? `${transactionSummary.totalTransactions}`
          : `${transactions.length}`,
        description: 'Includes purchases, renewals and real-time status updates.',
        icon: BarChart3,
        tone: 'text-indigo-600 bg-indigo-50 border border-indigo-100',
      },
      {
        title: 'Next renewal',
        value: isPremium && nextRenewalDate ? formatShortDate(nextRenewalDate) : 'Not scheduled',
        description: isPremium
          ? 'Keep the plan active by renewing before the billed date.'
          : 'Activate to schedule your renewal.',
        icon: Calendar,
        tone: 'text-purple-600 bg-purple-50 border border-purple-100',
      },
      {
        title: 'Renewal streak',
        value: transactionSummary?.totalRenewals
          ? `${transactionSummary.totalRenewals}`
          : '0',
        description: transactionSummary?.totalRenewals
          ? 'Renewals completed by your family to date.'
          : 'Build your renewal history to maintain continuity.',
        icon: RefreshCw,
        tone: 'text-amber-600 bg-amber-50 border border-amber-100',
      },
    ],
    [
      planStatusLabel,
      isPremium,
      transactionSummary?.totalTransactions,
      transactions.length,
      transactionSummary?.totalRenewals,
      nextRenewalDate,
    ],
  );

  useEffect(() => {
    fetchHistory();
    fetchTransactions();
  }, [fetchHistory, fetchTransactions]);

  useEffect(() => {
    if (!socket?.socket) return;

    const handleSubscriptionActivated = (data) => {
      if (data?.subscription) {
        toast.success('Subscription updated successfully!');
        refreshSubscription();
        fetchHistory();
        fetchTransactions();
      }
    };

    const handleSubscriptionCancelled = () => {
      toast.success('Subscription cancelled.');
      refreshSubscription();
      fetchHistory();
      fetchTransactions();
    };

    const handleAutoRenewUpdated = (data) => {
      if (data?.subscription) {
        setAutoRenewForm({
          enabled: data.subscription.autoRenewSettings?.enabled ?? data.subscription.autoRenew ?? false,
          method: data.subscription.autoRenewSettings?.method || AUTO_RENEW_METHODS[0].value,
        });
        fetchTransactions();
        refreshSubscription();
      }
    };

    socket.socket.on('subscription:activated', handleSubscriptionActivated);
    socket.socket.on('subscription:cancelled', handleSubscriptionCancelled);
    socket.socket.on('subscription:autoRenewUpdated', handleAutoRenewUpdated);

    return () => {
      socket.socket.off('subscription:activated', handleSubscriptionActivated);
      socket.socket.off('subscription:cancelled', handleSubscriptionCancelled);
      socket.socket.off('subscription:autoRenewUpdated', handleAutoRenewUpdated);
    };
  }, [socket, refreshSubscription, fetchHistory, fetchTransactions]);

  useEffect(() => {
    if (!subscription?.endDate) {
      setRemainingTime(null);
      return;
    }

    const computeRemaining = () => {
      const end = new Date(subscription.endDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime({ expired: true, days: 0, hours: 0, minutes: 0, formatted: 'Expired' });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setRemainingTime({
        days,
        hours,
        minutes,
        expired: false,
        formatted: `${days} day${days !== 1 ? 's' : ''} ${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')} hrs`
      });
    };

    computeRemaining();
    const interval = setInterval(computeRemaining, 60 * 1000);
    return () => clearInterval(interval);
  }, [subscription?.endDate]);

  const displayedTransactions = useMemo(() => transactions.slice(0, 8), [transactions]);

  const trustIndicators = [
    { icon: ShieldCheck, title: 'Enterprise Grade Security', description: 'GDPR compliant, ISO 27001 ready infrastructure.' },
    { icon: Heart, title: 'Parent Happiness', description: '4.9/5 average satisfaction score from active families.' },
    { icon: Zap, title: 'Instant Activation', description: 'Upgrade in seconds with realtime dashboard unlock.' },
    { icon: BarChart3, title: 'Insight Engine', description: '2,300+ personalised family reports delivered.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-8 p-6 lg:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {PARENT_PLAN.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${statusBadgeClass}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {planStatusLabel}
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl">
                Monitor your child's progress, track wellbeing, and access premium insights all in one place.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3">
                  <CalendarClock className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Next renewal</p>
                    <p className="text-base font-semibold text-slate-900">
                      {isPremium && nextRenewalDate
                        ? formatShortDate(nextRenewalDate)
                        : 'Not scheduled'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {remainingTime?.formatted || (isPremium ? 'Auto-renews annually' : 'Activate plan')}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3">
                  <CreditCard className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Last payment</p>
                    <p className="text-base font-semibold text-slate-900">
                      {lastPaymentDate ? formatShortDate(lastPaymentDate) : 'No payments yet'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {transactionSummary?.totalSpend
                        ? `${currencyFormatter.format(transactionSummary.totalSpend)} total`
                        : 'Activate to start'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {canUpgrade && (
                  <button
                    onClick={() => handlePlanCheckout('purchase')}
                    disabled={paymentLoading}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Activate Premium Plan
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
                {subscription?.planType === PARENT_PLAN.planType && (
                  <button
                    onClick={() => setShowPlanSelection(true)}
                    disabled={!canRenew || paymentLoading}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${
                      canRenew && !paymentLoading
                        ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        : 'bg-white border border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    title={!canRenew ? renewDisabledReason : undefined}
                  >
                    Renew Plan
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Auto Renew Settings */}
              {isPremium && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-500 mb-1">Auto Renewal</p>
                      <p className="text-sm text-slate-900 font-medium">{autoRenewStatusText}</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Method: {selectedAutoRenewMethod?.label}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={autoRenewForm.method}
                        onChange={handleAutoRenewMethodChange}
                        disabled={autoRenewUpdating}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      >
                        {AUTO_RENEW_METHODS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAutoRenewToggle}
                        disabled={autoRenewUpdating}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                          autoRenewForm.enabled
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } ${autoRenewUpdating ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {autoRenewUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        {autoRenewForm.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!canRenew && subscription?.planType === PARENT_PLAN.planType && renewDisabledReason && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">{renewDisabledReason}</p>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg p-6 space-y-5">
              <div>
                <p className="text-xs font-medium text-white/80 mb-1">Plan Investment</p>
                <h3 className="text-3xl font-bold mt-1">{currencyFormatter.format(planInvestmentPrice)}</h3>
                <p className="text-sm text-white/80 mt-1">
                  {planInvestmentLabel}
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex gap-3">
                  <CreditCard className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Annual renewal {currencyFormatter.format(PARENT_PLAN.renewalPrice)}</p>
                    <p className="text-xs text-white/70">Continue premium access</p>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex gap-3">
                  <Receipt className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">GST compliant receipts</p>
                    <p className="text-xs text-white/70">Instant invoices available</p>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex gap-3">
                  <Shield className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure payments</p>
                    <p className="text-xs text-white/70">Razorpay · UPI · Netbanking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {summaryCards.map(({ title, value, description, icon, tone }) => {
            const IconComponent = icon;
            return (
              <Motion.div
                key={title}
                whileHover={{ y: -2 }}
                className={`rounded-lg p-4 bg-white shadow-sm border ${tone}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      {title}
                    </p>
                    <p className="text-lg font-bold text-slate-900">{value}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">{description}</p>
              </Motion.div>
            );
          })}
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
              <p className="text-xs text-slate-600 mt-1">
                View all transactions and receipts
              </p>
            </div>
            <button
              onClick={() => {
                if (isPremium) {
                  setShowPlanSelection(true);
                } else {
                  handlePlanCheckout('purchase');
                }
              }}
              disabled={paymentLoading}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isPremium ? 'Renew plan' : 'Activate now'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          <div className="overflow-hidden border border-slate-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Initiated By</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {transactionsLoading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={`skeleton-${idx}`}>
                          <td className="px-4 py-3">
                            <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 w-18 bg-slate-100 rounded animate-pulse" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="h-3 w-14 bg-slate-100 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))
                    : displayedTransactions.map((row) => (
                        <tr key={row.transactionId} className="text-sm text-slate-700 hover:bg-slate-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {formatDateTime(row.paymentDate || row.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                              <CreditCard className="w-3 h-3" />
                              {modeLabel(row.mode)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">
                                {row.initiatedBy?.name || '—'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {row.initiatedBy?.role || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-900">
                            {currencyFormatter.format(row.amount || 0)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                                statusTone[row.status] ||
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {row.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {row.receiptUrl ? (
                              <button
                                type="button"
                                onClick={() => window.open(row.receiptUrl, '_blank', 'noopener')}
                                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  {!transactionsLoading && displayedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                        No payment activity yet. Activate the premium plan to generate receipts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Motion.section>

        {/* Trust Indicators */}
        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trustIndicators.map(({ icon, title, description }) => {
            const IconComponent = icon;
            return (
              <Motion.div
                key={title}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg border border-slate-200 shadow-sm p-4"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <IconComponent className="w-5 h-5 text-indigo-600 shrink-0" />
                  <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                </div>
                <p className="text-xs text-slate-600">{description}</p>
              </Motion.div>
            );
          })}
        </Motion.section>

        {/* Plan Features */}
        <Motion.section
          id="plan-features"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Plan Features</h2>
              <p className="text-xs text-slate-600 mt-1">
                Everything you need to track your child's progress and wellbeing
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2">
              <p className="text-xs font-medium text-indigo-700">Family coverage</p>
              <p className="text-sm font-semibold text-indigo-900">Child + Parent/Guardian</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {PARENT_PLAN.features.map(({ title, description, icon }) => {
              const IconComponent = icon;
              return (
                <Motion.div
                  key={title}
                  whileHover={{ y: -2 }}
                  className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
                      <p className="text-xs text-slate-600">{description}</p>
                    </div>
                  </div>
                </Motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PARENT_PLAN.extras.map(({ title, description }) => (
              <div key={title} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-slate-900 mb-1.5">{title}</h5>
                <p className="text-xs text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </Motion.section>

        {/* Outcomes / Benefits */}
        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[ 
            {
              title: 'Proactive Wellbeing Alerts',
              description: 'Early signals when emotional health or motivation shifts, so you can intervene with confidence.',
              icon: Sparkles,
            },
            {
              title: '360° Progress Lens',
              description: 'Academic mastery, life-skills and social-emotional growth tracked in one intuitive space.',
              icon: TrendingUp,
            },
            {
              title: 'Shared Family Journeys',
              description: 'Collaborative reflections, weekend family missions and conversation starters for meaningful bonding.',
              icon: HeartHandshake,
            },
          ].map(({ title, description, icon }) => {
            const IconComponent = icon;
            return (
              <Motion.div
                key={title}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <IconComponent className="w-5 h-5 text-indigo-600 shrink-0" />
                  <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                </div>
                <p className="text-xs text-slate-600">{description}</p>
              </Motion.div>
            );
          })}
        </Motion.section>

        {/* FAQ */}
        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[ 
              {
                q: 'Can both guardians access the dashboard simultaneously?',
                a: 'Yes. Student + Parent Premium Pro Plan supports dual guardian access with individualised preferences, notes and recommendations.'
              },
              {
                q: 'What happens after the first year?',
                a: 'Your family retains all premium benefits at a preferential renewal of ₹1,499/year. Cancel anytime before renewal.'
              },
              {
                q: 'Do you provide professional guidance?',
                a: 'Absolutely. Get priority access to counsellors, monthly parent circles, curated workshops and SOS wellbeing support.'
              },
              {
                q: 'Is family data secure?',
                a: 'Student + Parent Premium Pro Plan follows global privacy benchmarks with encrypted storage, audit trails and consent-based data sharing.'
              },
            ].map(({ q, a }, idx) => (
              <Motion.div
                key={q}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + idx * 0.05 }}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200"
              >
                <h4 className="text-sm font-semibold text-slate-900 mb-2">{q}</h4>
                <p className="text-xs text-slate-600">{a}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.section>

        {/* CTA */}
        <Motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to get started?</h3>
              <p className="text-sm text-white/80">
                Join thousands of parents using Premium Pro Plan for better insights and wellbeing tracking.
              </p>
            </div>
            {canUpgrade && (
              <button
                onClick={() => handlePlanCheckout('purchase')}
                disabled={paymentLoading}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 font-medium px-5 py-2.5 rounded-lg shadow-sm hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Activate Now
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </Motion.section>
      </div>

      {/* Plan Selection Modal */}
      {showPlanSelection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Colorful Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Select Renewal Plan</h2>
              </div>
              <button
                onClick={() => setShowPlanSelection(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30">
              <p className="text-sm text-slate-700 mb-6 font-medium">Choose the plan you want to renew:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Student + Parent Premium Pro Plan */}
                <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative border-2 border-indigo-300 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
                  onClick={() => handlePlanCheckout('renew', PARENT_PLAN.planType)}
                >
                  <div className="absolute top-3 right-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Premium
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{PARENT_PLAN.name}</h3>
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-4 font-medium">{PARENT_PLAN.tagline}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {currencyFormatter.format(PARENT_PLAN.renewalPrice)}
                    </span>
                    <span className="text-sm text-slate-600 ml-1">/year</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {PARENT_PLAN.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <div className="p-0.5 bg-indigo-100 rounded-full mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        </div>
                        <span className="font-medium">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all text-sm shadow-md hover:shadow-lg"
                  >
                    Renew This Plan
                  </button>
                </Motion.div>

                {/* Parent Dashboard Plan */}
                <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative border-2 border-emerald-300 rounded-xl p-6 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50"
                  onClick={() => handlePlanCheckout('renew', 'parent_dashboard')}
                >
                  <div className="absolute top-3 right-3">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Standard
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{PARENT_DASHBOARD_PLAN.name}</h3>
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-4 font-medium">{PARENT_DASHBOARD_PLAN.tagline}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {currencyFormatter.format(PARENT_DASHBOARD_PLAN.renewalPrice)}
                    </span>
                    <span className="text-sm text-slate-600 ml-1">/year</span>
                  </div>
                  <ul className="space-y-2 mb-5">
                    {PARENT_DASHBOARD_PLAN.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <div className="p-0.5 bg-emerald-100 rounded-full mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        </div>
                        <span className="font-medium">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all text-sm shadow-md hover:shadow-lg"
                  >
                    Renew This Plan
                  </button>
                </Motion.div>
              </div>
            </div>
          </Motion.div>
        </div>
      )}
    </div>
  );
};

export default ParentUpgrade;


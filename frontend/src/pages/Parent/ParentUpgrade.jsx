import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Crown, RefreshCw, Users, Shield, HeartHandshake, TrendingUp, BarChart3, Calendar, CalendarClock, CheckCircle2, Sparkles, ArrowRight, Loader2, Star, MessageCircleHeart, LineChart, ShieldCheck, Zap, Heart, CreditCard, Clock, AlertCircle, Receipt, Download, ExternalLink
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

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
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionSummary, setTransactionSummary] = useState(null);
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

  const handlePlanCheckout = useCallback(
    (mode = 'purchase') => {
      const normalizedMode = mode === 'renew' ? 'renew' : 'purchase';
      const nextIsFirstYear = normalizedMode === 'renew' ? false : !hasParentPlanHistory;
      const amount =
        normalizedMode === 'renew' || !nextIsFirstYear
          ? PARENT_PLAN.renewalPrice
          : PARENT_PLAN.firstYearPrice;

      navigate(
        `/parent/upgrade/checkout?plan=${PARENT_PLAN.planType}&firstYear=${nextIsFirstYear ? '1' : '0'}&context=parent&mode=${normalizedMode}`,
        {
          state: {
            planType: PARENT_PLAN.planType,
            planName: PARENT_PLAN.name,
            amount,
            isFirstYear: nextIsFirstYear,
            context: 'parent',
            mode: normalizedMode,
          },
        },
      );
    },
    [navigate, hasParentPlanHistory],
  );

  const planStatus = subscription?.status || (isPremium ? 'active' : 'free');
  const statusBadgeClass =
    statusTone[planStatus] || 'bg-slate-100 text-slate-700 border border-slate-200';
  const planStatusLabel = planStatus
    ? planStatus.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Free Plan';
  const purchasedBy =
    subscription?.purchasedBy || subscription?.latestTransaction?.initiatedBy || null;

  const timelineIconForStatus = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'failed':
      case 'cancelled':
        return AlertCircle;
      default:
        return RefreshCw;
    }
  };

  const timelineAccentForStatus = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'text-emerald-600 bg-emerald-50 border border-emerald-100';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border border-amber-100';
      case 'failed':
      case 'cancelled':
        return 'text-rose-600 bg-rose-50 border border-rose-100';
      default:
        return 'text-indigo-600 bg-indigo-50 border border-indigo-100';
    }
  };

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

  const timelineItems = useMemo(() => {
    if (!transactions?.length) return [];
    return transactions
      .slice(0, 8)
      .map((tx) => ({
        status: tx.status,
        date: tx.paymentDate || tx.createdAt,
        planName: tx.planName,
        amount: tx.amount,
        mode: tx.mode,
        initiatedBy: tx.initiatedBy,
      }));
  }, [transactions]);

  const displayedTransactions = useMemo(() => transactions.slice(0, 8), [transactions]);

  const trustIndicators = [
    { icon: ShieldCheck, title: 'Enterprise Grade Security', description: 'GDPR compliant, ISO 27001 ready infrastructure.' },
    { icon: Heart, title: 'Parent Happiness', description: '4.9/5 average satisfaction score from active families.' },
    { icon: Zap, title: 'Instant Activation', description: 'Upgrade in seconds with realtime dashboard unlock.' },
    { icon: BarChart3, title: 'Insight Engine', description: '2,300+ personalised family reports delivered.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <Motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
        >
          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-10 p-8 sm:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                Family Plan Control Centre
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">
                  {PARENT_PLAN.name}
                </h1>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusBadgeClass}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {planStatusLabel}
                </span>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
                Give your family a realtime command centre for wellbeing, academics and growth. Monitor progress, surface risks early and access premium parent-child experiences without leaving the dashboard.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-purple-100 rounded-2xl p-4 shadow-sm flex gap-3">
                  <CalendarClock className="w-9 h-9 text-purple-600" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">Next renewal</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {isPremium && nextRenewalDate
                        ? formatShortDate(nextRenewalDate)
                        : 'Activate to unlock'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {remainingTime?.formatted || (isPremium ? 'Auto-renews annually' : 'Premium dashboard locked')}
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-purple-100 rounded-2xl p-4 shadow-sm flex gap-3">
                  <CreditCard className="w-9 h-9 text-purple-600" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">Last payment</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {lastPaymentDate ? formatShortDate(lastPaymentDate) : 'Awaiting payment'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transactionSummary?.totalSpend
                        ? `${currencyFormatter.format(transactionSummary.totalSpend)} lifetime spend`
                        : 'No premium payments yet'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-stretch">
                {canUpgrade && (
                  <button
                    onClick={() => handlePlanCheckout('purchase')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition"
                  >
                    Renew Student + Parent Premium Pro Plan
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                {subscription?.planType === PARENT_PLAN.planType && (
                  <button
                    onClick={() => handlePlanCheckout('renew')}
                    disabled={!canRenew}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition ${
                      canRenew
                        ? 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50'
                        : 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title={!canRenew ? renewDisabledReason : undefined}
                  >
                    Renew for {currencyFormatter.format(PARENT_PLAN.renewalPrice)}
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-purple-100 text-gray-700 font-semibold px-5 py-4 rounded-2xl shadow-sm min-w-[260px]">
                  <div className="flex-1 space-y-1">
                    <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold">
                      Auto debit
                    </p>
                    <p className="text-sm text-gray-900 font-semibold">{autoRenewStatusText}</p>
                    <p className="text-xs text-gray-500">
                      Method: {selectedAutoRenewMethod?.label}
                    </p>
                    {autoRenewUpdatedAt && (
                      <p className="text-[11px] text-gray-400">Updated {autoRenewUpdatedAt}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      value={autoRenewForm.method}
                      onChange={handleAutoRenewMethodChange}
                      disabled={autoRenewUpdating}
                      className="w-full border border-purple-100 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
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
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                        autoRenewForm.enabled
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                      } ${autoRenewUpdating ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {autoRenewUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      {autoRenewForm.enabled ? 'Disable auto debit' : 'Enable auto debit'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-purple-100 rounded-2xl p-4 flex gap-3">
                  <Users className="w-10 h-10 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Primary purchaser</p>
                    <p className="text-sm text-gray-700">
                      {purchasedBy?.name || 'Select parent or student during checkout'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {purchasedBy?.role
                        ? `Initiated by ${purchasedBy.role}`
                        : 'Both parents and students can trigger the upgrade.'}
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-purple-100 rounded-2xl p-4 flex gap-3">
                  <HeartHandshake className="w-10 h-10 text-pink-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Dedicated partner success</p>
                    <p className="text-xs text-gray-600">
                      Premium onboarding, quarterly growth reviews and access to counsellor-led circles included.
                    </p>
                  </div>
                </div>
              </div>
              {!canRenew && subscription?.planType === PARENT_PLAN.planType && renewDisabledReason && (
                <p className="text-xs text-amber-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {renewDisabledReason}
                </p>
              )}
            </div>
            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white rounded-2xl p-6 space-y-6 shadow-inner">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/80">Plan investment</p>
                <h3 className="text-3xl font-black mt-2">{currencyFormatter.format(planInvestmentPrice)}</h3>
                <p className="text-sm text-white/80">
                  {planInvestmentLabel}
                </p>
              </div>
              <div className="grid gap-3">
                <div className="bg-white/10 border border-white/10 rounded-xl p-4 flex gap-3">
                  <CreditCard className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-sm font-semibold">Annual renewal {currencyFormatter.format(PARENT_PLAN.renewalPrice)}</p>
                    <p className="text-xs text-white/70">Unlock continued analytics, wellbeing alerts and parent labs.</p>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-4 flex gap-3">
                  <Receipt className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-sm font-semibold">GST compliant receipts</p>
                    <p className="text-xs text-white/70">Instant invoices, download-ready and auto-emailed to guardians.</p>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-4 flex gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  <div>
                    <p className="text-sm font-semibold">Enterprise-grade security</p>
                    <p className="text-xs text-white/70">ISO-ready infrastructure, consent-based sharing & SOC monitoring.</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4 text-xs text-white/70 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Includes exclusive parent wellbeing labs, AI nudges and 24x7 support.
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Billing is processed securely via Razorpay · UPI · Netbanking.
                </div>
              </div>
            </div>
          </div>
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {summaryCards.map(({ title, value, description, icon, tone }) => {
            const IconComponent = icon;
            return (
              <Motion.div
                key={title}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`rounded-2xl p-5 bg-white shadow-lg border ${tone}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className="w-8 h-8" />
                  <div>
                    <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                      {title}
                    </p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </Motion.div>
            );
          })}
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Payment audit trail</h2>
              <p className="text-sm text-gray-600 mt-1">
                Live transactions with roles, receipts and compliance-ready metadata.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handlePlanCheckout(isPremium ? 'renew' : 'purchase')}
                className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-purple-700 transition"
              >
                {isPremium ? 'Renew plan' : 'Activate now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden border border-gray-100 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Initiated By</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {transactionsLoading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <tr key={`skeleton-${idx}`}>
                          <td className="px-5 py-4">
                            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                          </td>
                          <td className="px-5 py-4">
                            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))
                    : displayedTransactions.map((row) => (
                        <tr key={row.transactionId} className="text-sm text-gray-700">
                          <td className="px-5 py-4 whitespace-nowrap">
                            {formatDateTime(row.paymentDate || row.createdAt)}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                              <CreditCard className="w-3 h-3" />
                              {modeLabel(row.mode)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {row.initiatedBy?.name || '—'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {row.initiatedBy?.role ? row.initiatedBy.role : 'Role not captured'}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap font-semibold">
                            {currencyFormatter.format(row.amount || 0)}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                statusTone[row.status] ||
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {row.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            {row.receiptUrl ? (
                              <button
                                type="button"
                                onClick={() => window.open(row.receiptUrl, '_blank', 'noopener')}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  {!transactionsLoading && displayedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                        No payment activity yet. Activate the premium plan to generate receipts.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Motion.section>

        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Lifecycle timeline</h2>
              <p className="text-sm text-gray-600 mt-1">
                Every premium event with who triggered it and when it went live.
              </p>
            </div>
            <button
              onClick={fetchHistory}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800"
            >
              Refresh history
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {timelineItems.length === 0 && !transactionsLoading && (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-sm text-gray-500 text-center">
                No premium activity recorded yet. Your timeline will populate as soon as payments are initiated.
              </div>
            )}

            {timelineItems.map((item, index) => {
              const Icon = timelineIconForStatus(item.status);
              const accent = timelineAccentForStatus(item.status);
              return (
                <div
                  key={`${item.status}-${item.date}-${index}`}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className={`p-3 rounded-xl ${accent}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {modeLabel(item.mode)} · {item.planName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Triggered by {item.initiatedBy?.name || '—'} (
                        {item.initiatedBy?.role || 'role not captured'})
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.amount ? currencyFormatter.format(item.amount) : '—'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(item.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Motion.section>

        {/* Trust Indicators */}
        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trustIndicators.map(({ icon, title, description }) => {
            const IconComponent = icon;
            return (
              <Motion.div
                key={title}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white rounded-2xl border border-white/40 shadow-lg p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className="w-8 h-8 text-purple-600" />
                  <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
              </Motion.div>
            );
          })}
        </Motion.section>

        {/* Plan Features */}
        <Motion.section
          id="plan-features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Everything parents need, in one premium experience</h2>
              <p className="text-sm text-gray-600 mt-2">
                Thoughtfully designed to balance academic excellence, emotional resilience and confident parenting.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4">
              <p className="text-sm font-semibold text-purple-700">Family coverage</p>
              <p className="text-lg text-purple-600">Child + Parent/Guardian (1) </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PARENT_PLAN.features.map(({ title, description, icon }) => {
              const IconComponent = icon;
              return (
                <Motion.div
                  key={title}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-purple-200 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <IconComponent className="w-5 h-5" />
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </Motion.div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARENT_PLAN.extras.map(({ title, description }) => (
              <div key={title} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">{title}</h5>
                <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </Motion.section>

        {/* Outcomes / Benefits */}
        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[ 
            {
              title: 'Proactive Wellbeing Alerts',
              description: 'Early signals when emotional health or motivation shifts, so you can intervene with confidence.',
              icon: Sparkles,
              accent: 'from-pink-500/10 to-orange-400/10',
            },
            {
              title: '360° Progress Lens',
              description: 'Academic mastery, life-skills and social-emotional growth tracked in one intuitive space.',
              icon: TrendingUp,
              accent: 'from-purple-500/10 to-indigo-400/10',
            },
            {
              title: 'Shared Family Journeys',
              description: 'Collaborative reflections, weekend family missions and conversation starters for meaningful bonding.',
              icon: HeartHandshake,
              accent: 'from-emerald-500/10 to-teal-400/10',
            },
          ].map(({ title, description, icon, accent }) => {
            const IconComponent = icon;
            return (
              <Motion.div
                key={title}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`bg-gradient-to-br ${accent} border border-white rounded-3xl p-6 shadow-lg backdrop-blur`}
              >
                <div className="flex items-center gap-3 mb-3 text-purple-600">
                  <IconComponent className="w-6 h-6" />
                  <h4 className="text-lg font-bold text-gray-900">{title}</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              </Motion.div>
            );
          })}
        </Motion.section>

        {/* Subscription Timeline */}
        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Family subscription timeline</h3>
              <p className="text-sm text-gray-600">Stay on top of upgrades, renewals and billing milestones in real time.</p>
            </div>
            <button
              onClick={fetchHistory}
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} />
              Refresh timeline
            </button>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
          ) : timelineItems.length ? (
            <div className="space-y-5">
              {timelineItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                      item.status === 'active'
                        ? 'bg-emerald-100 text-emerald-600'
                        : item.status === 'pending'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    {index !== timelineItems.length - 1 && (
                      <div className="absolute left-1/2 top-11 -translate-x-1/2 w-px h-12 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 border border-gray-100 rounded-2xl p-5 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.planName || 'Subscription'}</p>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Status: {item.status?.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        {item.date && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            {formatShortDate(item.date)}
                          </p>
                        )}
                        {item.amount && (
                          <p className="text-sm font-semibold text-gray-900">₹{item.amount.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No subscription events recorded yet. Complete your family upgrade to populate this view.</p>
            </div>
          )}
        </Motion.section>

        {/* FAQ */}
        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + idx * 0.05 }}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{q}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.section>

        {/* CTA */}
        <Motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          <div className="space-y-3">
            <h3 className="text-3xl font-black">Ready to lead your family’s growth journey?</h3>
            <p className="text-sm text-white/80 max-w-2xl">
              Join thousands of engaged parents using Student + Parent Premium Pro Plan for insight-rich conversations, proactive wellbeing and confident decision making.
            </p>
          </div>
        </Motion.section>
      </div>
    </div>
  );
};

export default ParentUpgrade;


import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck,
  Calendar,
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  XCircle,
  ChevronRight,
  FileText,
  PieChart,
} from 'lucide-react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import SubscriptionExpirationBanner from '../../components/School/SubscriptionExpirationBanner';

const PLAN_CONFIG = {
  free: {
    label: 'Free Plan',
    price: 0,
    limits: {
      students: 100,
      teachers: 10,
    },
  },
  student_premium: {
    label: 'Student Premium Plan',
    price: 4499,
    limits: {
      students: 1000,
      teachers: 100,
    },
  },
  student_parent_premium_pro: {
    label: 'Student + Parent Premium Pro Plan',
    price: 4999,
    limits: {
      students: 1000,
      teachers: 100,
    },
  },
  educational_institutions_premium: {
    label: 'Educational Institutions Premium Plan',
    price: 0,
    limits: {
      students: 10000,
      teachers: 1000,
    },
  },
};

const BILLING_MULTIPLIER = {
  yearly: 12,
};

const EXTRA_USAGE_RATES = {
  student: 40,
  teacher: 120,
};

const determinePlanForCounts = (students = 0, teachers = 0) => {
  if (students <= 100 && teachers <= 10) return 'free';
  return 'educational_institutions_premium';
};

const calculateEstimate = (planName, billingCycle, students = 0, teachers = 0) => {
  const plan = PLAN_CONFIG[planName] || PLAN_CONFIG.free;
  const cycle = billingCycle || 'yearly';
  const multiplier = BILLING_MULTIPLIER[cycle] || BILLING_MULTIPLIER.yearly;

  const planStudentLimit = plan.limits.students;
  const planTeacherLimit = plan.limits.teachers;

  const extraStudents = Number.isFinite(planStudentLimit)
    ? Math.max(0, students - planStudentLimit)
    : 0;
  const extraTeachers = Number.isFinite(planTeacherLimit)
    ? Math.max(0, teachers - planTeacherLimit)
    : 0;

  const baseAmount = plan.price * multiplier;
  const extraAmount = (extraStudents * EXTRA_USAGE_RATES.student + extraTeachers * EXTRA_USAGE_RATES.teacher) * multiplier;

  return {
    amount: baseAmount + extraAmount,
    extraStudents,
    extraTeachers,
  };
};

const formatCurrency = (amount = 0) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount);

const formatDate = (value) => {
  if (!value) return 'N/A';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'N/A';
  }
};

const safePercentage = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, numeric));
};

const SchoolAdminPaymentTracker = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [enhancedDetails, setEnhancedDetails] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewForm, setRenewForm] = useState({
    students: '',
    teachers: '',
    billingCycle: 'yearly',
  });
  const [renewing, setRenewing] = useState(false);
  const { socket } = useSocket();

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/school/admin/subscription/enhanced');
      const { subscription: subscriptionDoc, enhancedDetails: details } = res.data || {};
      setSubscription(subscriptionDoc);
      setEnhancedDetails(details);

      setRenewForm((prev) => {
        const defaultStudents = details?.totalStudentCount ?? subscriptionDoc?.usage?.students ?? '';
        const defaultTeachers = details?.activeTeacherCount ?? subscriptionDoc?.usage?.teachers ?? '';
        return {
          ...prev,
          students: prev.students === '' ? (defaultStudents !== '' ? String(defaultStudents) : '') : prev.students,
          teachers: prev.teachers === '' ? (defaultTeachers !== '' ? String(defaultTeachers) : '') : prev.teachers,
          billingCycle: 'yearly',
        };
      });
    } catch (error) {
      console.error('Error fetching payment tracker:', error);
      toast.error(error.response?.data?.message || 'Failed to load payment tracker');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
    const interval = setInterval(fetchSubscription, 60000);
    return () => clearInterval(interval);
  }, [fetchSubscription]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleSubscriptionUpdate = () => {
      fetchSubscription();
    };

    const handleExpirationNotification = (data) => {
      if (data) {
        toast.info('Subscription expiration notification received', {
          icon: '📧',
          duration: 5000,
        });
        fetchSubscription();
      }
    };

    socket.on('school:subscription:updated', handleSubscriptionUpdate);
    socket.on('subscription:expiration:notification', handleExpirationNotification);

    return () => {
      socket.off('school:subscription:updated', handleSubscriptionUpdate);
      socket.off('subscription:expiration:notification', handleExpirationNotification);
    };
  }, [socket, fetchSubscription]);

  const handleRefresh = () => {
    fetchSubscription();
    toast.success('Payment tracker refreshed');
  };

  const handleOpenRenewModal = () => {
    setRenewForm((prev) => ({
      ...prev,
      students: String(enhancedDetails?.totalStudentCount ?? subscription?.usage?.students ?? prev.students ?? ''),
      teachers: String(enhancedDetails?.activeTeacherCount ?? subscription?.usage?.teachers ?? prev.teachers ?? ''),
      billingCycle: 'yearly',
    }));
    setShowRenewModal(true);
  };

  const handleRenewFieldChange = (field, value) => {
    setRenewForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRenewSubmit = async (event) => {
    event.preventDefault();
    const studentsCount = Number(renewForm.students);
    const teachersCount = Number(renewForm.teachers);

    if (Number.isNaN(studentsCount) || studentsCount < 0) {
      toast.error('Please provide a valid number of students.');
      return;
    }
    if (Number.isNaN(teachersCount) || teachersCount < 0) {
      toast.error('Please provide a valid number of teachers.');
      return;
    }

    try {
      setRenewing(true);
      const response = await api.post('/api/school/admin/subscription/renew', {
        students: studentsCount,
        teachers: teachersCount,
        billingCycle: 'yearly',
      });
      
      if (response.data.status === 'pending') {
        toast.success('Renewal request submitted successfully. It will be reviewed by admin.');
      } else {
        toast.success('Subscription renewed successfully');
      }
      
      setShowRenewModal(false);
      await fetchSubscription();
    } catch (error) {
      console.error('Error renewing subscription:', error);
      toast.error(error.response?.data?.message || 'Failed to submit renewal request');
    } finally {
      setRenewing(false);
    }
  };

  const currentPlanName = subscription?.plan?.name || 'free';
  const currentPlanPrice = subscription?.plan?.price ?? PLAN_CONFIG[currentPlanName]?.price ?? 0;

  // Compute actual status based on endDate (must be before canRenew)
  const actualStatus = useMemo(() => {
    if (!enhancedDetails) return subscription?.status || 'unknown';
    let status = enhancedDetails.status || subscription?.status || 'unknown';
    const endDate = subscription?.endDate || enhancedDetails?.nextBillingDate;
    
    // If status is active/pending but endDate has passed, mark as expired
    if (endDate && (status === 'active' || status === 'pending')) {
      const expiryDate = new Date(endDate);
      const now = new Date();
      if (expiryDate <= now) {
        status = 'expired';
      }
    }
    
    return status;
  }, [enhancedDetails, subscription]);

  const renewAnalytics = useMemo(() => {
    if (!renewForm.students && !renewForm.teachers) {
      return null;
    }
    const studentsCount = Number(renewForm.students) || 0;
    const teachersCount = Number(renewForm.teachers) || 0;
    let plan = determinePlanForCounts(studentsCount, teachersCount);
    if (currentPlanName && currentPlanName !== 'free') {
      plan = currentPlanName;
    }
    const estimate = calculateEstimate(plan, 'yearly', studentsCount, teachersCount);
    return {
      plan,
      students: studentsCount,
      teachers: teachersCount,
      estimate,
    };
  }, [renewForm.students, renewForm.teachers, currentPlanName]);

  const canRenew = useMemo(() => {
    if (!enhancedDetails) return false;
    const { daysRemaining } = enhancedDetails;
    if (!Number.isFinite(Number(daysRemaining))) return actualStatus !== 'active';
    return Number(daysRemaining) <= 60 || actualStatus !== 'active';
  }, [enhancedDetails, actualStatus]);

  const upcomingRenewalText = useMemo(() => {
    if (!enhancedDetails) return 'Renewal details unavailable';
    if (enhancedDetails.nextBillingDate) {
      return `Plan renews on ${formatDate(enhancedDetails.nextBillingDate)} • ${enhancedDetails.daysRemaining ?? '--'} days remaining`;
    }
    return 'No renewal date available';
  }, [enhancedDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const usagePercentages = enhancedDetails?.usagePercentages || {};
  const studentCreatedCount = enhancedDetails?.totalStudentCount ?? subscription?.usage?.students ?? 0;
  const teacherCreatedCount = enhancedDetails?.activeTeacherCount ?? subscription?.usage?.teachers ?? 0;
  const classCreatedCount = subscription?.usage?.classes ?? 0;
  const campusCreatedCount = subscription?.usage?.campuses ?? 0;

  const studentLimit =
    enhancedDetails?.allowedStudentCount ??
    subscription?.limits?.maxStudents ??
    PLAN_CONFIG[currentPlanName]?.limits?.students ??
    0;
  const teacherLimit =
    enhancedDetails?.allowedTeacherCount ??
    subscription?.limits?.maxTeachers ??
    PLAN_CONFIG[currentPlanName]?.limits?.teachers ??
    0;
  const classLimit =
    enhancedDetails?.allowedClassCount ??
    subscription?.limits?.maxClasses ??
    0;
  const campusLimit =
    enhancedDetails?.allowedCampusCount ??
    subscription?.limits?.maxCampuses ??
    0;

  const usageMetrics = [
    {
      title: 'Students',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      created: studentCreatedCount,
      limit: studentLimit,
      percentage: safePercentage(usagePercentages.students),
    },
    {
      title: 'Teachers',
      icon: UserCheck,
      gradient: 'from-blue-500 to-cyan-500',
      created: teacherCreatedCount,
      limit: teacherLimit,
      percentage: safePercentage(usagePercentages.teachers),
    },
    {
      title: 'Classes',
      icon: PieChart,
      gradient: 'from-purple-500 to-pink-500',
      created: classCreatedCount,
      limit: classLimit,
      percentage: safePercentage(usagePercentages.classes),
    },
    {
      title: 'Campuses',
      icon: ShieldCheck,
      gradient: 'from-amber-500 to-orange-500',
      created: campusCreatedCount,
      limit: campusLimit,
      percentage: safePercentage(usagePercentages.campuses),
    },
  ];

  const activePlanLabel = subscription?.plan?.displayName || PLAN_CONFIG[subscription?.plan?.name || 'free']?.label || 'Unknown Plan';
  const recommendedPlanName = renewAnalytics?.plan || currentPlanName;
  const recommendedPlanLabel = PLAN_CONFIG[recommendedPlanName]?.label || activePlanLabel;
  const recommendedAmount = renewAnalytics?.estimate?.amount ?? currentPlanPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-16">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-12 h-12" />
                <div>
                  <h1 className="text-4xl font-black">Subscription Payment Tracker</h1>
                  <p className="text-white/80 font-medium">{activePlanLabel} • {upcomingRenewalText}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleOpenRenewModal}
                disabled={!canRenew}
                data-renew-button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${canRenew ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-white/30 text-white/70 cursor-not-allowed'}`}
              >
                <Sparkles className="w-5 h-5" />
                Renew Plan
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 space-y-10">
        {/* Subscription Expiration Banner */}
        {subscription && subscription.endDate && (
          <SubscriptionExpirationBanner
            subscription={subscription}
            onRenew={() => {
              handleOpenRenewModal();
            }}
          />
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-500">Plan Status</span>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-gray-900 capitalize">{actualStatus}</p>
            <p className="text-sm text-gray-500 mt-2">
              {formatDate(enhancedDetails?.currentCycleStartDate || subscription?.currentCycleStartDate || subscription?.lastRenewedAt || subscription?.startDate)} • 
              {enhancedDetails?.currentCycleStartDate || subscription?.currentCycleStartDate || subscription?.lastRenewedAt ? ' Renewed' : ' Started'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-cyan-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-500">Current Term</span>
              <Calendar className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatDate(enhancedDetails?.nextBillingDate || subscription?.endDate)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {enhancedDetails?.currentCycleStartDate || subscription?.currentCycleStartDate || subscription?.lastRenewedAt
                ? `Cycle: ${formatDate(enhancedDetails?.currentCycleStartDate || subscription?.currentCycleStartDate || subscription?.lastRenewedAt)} - ${formatDate(enhancedDetails?.nextBillingDate || subscription?.endDate)}`
                : 'Next billing cycle'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-500">Renewal Window</span>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">{enhancedDetails?.daysRemaining ?? '--'} days</p>
            <p className="text-sm text-gray-500 mt-2">Remaining in current cycle</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-500">Last Payment</span>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-gray-900">
              {enhancedDetails?.lastPaymentAmount ? formatCurrency(enhancedDetails.lastPaymentAmount) : '—'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {enhancedDetails?.lastPaymentDate ? formatDate(enhancedDetails.lastPaymentDate) : 'Awaiting payment'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                Usage Overview
              </h2>
              <p className="text-gray-500 font-medium">Stay within plan limits while scaling your school</p>
            </div>
            {actualStatus === 'active' && enhancedDetails?.daysRemaining <= 15 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Renewal window is closing soon
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {usageMetrics.map((metric) => {
              const Icon = metric.icon;
              const isUnlimited = metric.limit === -1 || metric.limit === Infinity;
              const allowedLabel = isUnlimited ? 'Unlimited' : metric.limit;
              return (
                <div key={metric.title} className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-500">{metric.title}</span>
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${metric.gradient} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Created</p>
                      <p className="text-2xl font-black text-gray-900">{metric.created}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Allowed</p>
                      <p className="text-lg font-bold text-emerald-600">{allowedLabel}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${isUnlimited ? 100 : metric.percentage}%` }}
                      />
                    </div>
                    {!isUnlimited && (
                      <p className="mt-2 text-xs font-semibold text-gray-500">
                        {metric.percentage.toFixed(1)}% utilized
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Invoice History
                </h3>
                <p className="text-sm text-gray-500">Track payments and invoices for compliance</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="text-left text-sm font-bold text-gray-500 uppercase tracking-wide">
                    <th className="py-4 pr-4">Invoice</th>
                    <th className="py-4 pr-4">Amount</th>
                    <th className="py-4 pr-4">Paid On</th>
                    <th className="py-4 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                  {subscription?.invoices?.length ? (
                    [...subscription.invoices].reverse().map((invoice, index) => (
                      <tr key={`${invoice.invoiceId}-${index}`} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-[13px] tracking-tight">{invoice.invoiceId}</span>
                            <span className="text-xs text-gray-400">{invoice.description}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-gray-900">{formatCurrency(invoice.amount)}</td>
                        <td className="py-4 pr-4">{invoice.paidAt ? formatDate(invoice.paidAt) : 'Pending'}</td>
                        <td className="py-4 pr-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              invoice.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-700'
                                : invoice.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {invoice.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {invoice.status?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-500">
                        No invoices generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-3xl shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-7 h-7" />
                <h3 className="text-2xl font-black">Renewal Insights</h3>
              </div>
              <p className="text-white/90 text-sm mb-6">
                Plan ahead for seamless renewals. Adjust seats for students and teachers to match your growth projections.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold uppercase text-white/70">Renewal Status</p>
                    <p className="text-lg font-bold">{canRenew ? 'Eligible for renewal' : 'Auto-managed'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold uppercase text-white/70">Plan Expiry Date</p>
                    <p className="text-lg font-bold">{formatDate(enhancedDetails?.nextBillingDate || subscription?.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <p className="text-sm font-semibold uppercase text-white/70">Current Load</p>
                    <p className="text-lg font-bold">
                      {subscription?.usage?.students ?? 0} students • {subscription?.usage?.teachers ?? 0} teachers
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenRenewModal}
              className="mt-8 flex items-center justify-between px-5 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-semibold transition-all"
            >
              Renew Subscription
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-6 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">Renew Subscription Plan</h3>
                  <p className="text-white/80 text-sm font-medium">Adjust headcount and confirm renewal preferences</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <form onSubmit={handleRenewSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Students to include</label>
                  <input
                    type="number"
                    min={0}
                    value={renewForm.students}
                    onChange={(event) => handleRenewFieldChange('students', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Total students"
                    required
                  />
                </div>
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Teachers to include</label>
                  <input
                    type="number"
                    min={0}
                    value={renewForm.teachers}
                    onChange={(event) => handleRenewFieldChange('teachers', event.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Total teachers"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Billing cycle</label>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-emerald-200 bg-white">
                    <span className="text-sm font-semibold text-emerald-600">Yearly</span>
                    <span className="text-xs font-medium text-emerald-500 uppercase tracking-wide">Default</span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    All subscriptions renew annually. Prorated adjustments are applied automatically for any headcount changes.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-emerald-500 uppercase mb-2">Recommended Plan</p>
                  <p className="text-lg font-black text-emerald-700">
                    {recommendedPlanLabel}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-emerald-600">
                    <p>
                      Estimated investment:{' '}
                      <span className="font-bold text-emerald-700">
                        {formatCurrency(recommendedAmount)}
                      </span>
                    </p>
                    {renewAnalytics && (renewAnalytics.estimate.extraStudents > 0 || renewAnalytics.estimate.extraTeachers > 0) && (
                      <p>
                        Includes add-ons for{' '}
                        {renewAnalytics.estimate.extraStudents > 0 && (
                          <span className="font-semibold">{renewAnalytics.estimate.extraStudents} extra students</span>
                        )}
                        {renewAnalytics.estimate.extraStudents > 0 && renewAnalytics.estimate.extraTeachers > 0 && ', '}
                        {renewAnalytics.estimate.extraTeachers > 0 && (
                          <span className="font-semibold">{renewAnalytics.estimate.extraTeachers} extra teachers</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                  You can revisit headcount later if projections change.
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRenewModal(false)}
                    className="px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={renewing}
                    className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {renewing ? 'Processing...' : 'Confirm Renewal'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdminPaymentTracker;


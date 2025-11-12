import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
  CreditCard, Crown, ArrowRight, Zap, CheckCircle, Calendar, TrendingUp, ArrowUp, ArrowDown, RefreshCw, Lock, Unlock, Sparkles, Loader2
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();

  // Plan configurations
  const plans = {
    free: {
      name: 'Free Plan',
      price: 0,
      features: ['5 Games per Pillar', 'Basic Dashboard', 'HealCoins Rewards'],
      color: 'from-green-500 to-emerald-500',
      icon: '🎁',
    },
    student_premium: {
      name: 'Students Premium Plan',
      firstYearPrice: 4499,
      renewalPrice: 999,
      features: [
        'Full Access to All 10 Pillars',
        '2200+ Gaming Micro Lessons',
        'Advanced Analytics',
        'Certificates & Achievements',
        'WiseClub Community Access',
        'Inavora Presentation Tool',
      ],
      color: 'from-blue-500 to-cyan-500',
      icon: '⭐',
    },
    student_parent_premium_pro: {
      name: 'Student + Parent Premium Pro Plan',
      firstYearPrice: 4999,
      renewalPrice: 1499,
      features: [
        'Everything in Students Premium',
        'Parent Dashboard',
        'Family Progress Tracking',
        'Parent Mental Health Care',
        'Parent-Child Learning Challenges',
      ],
      color: 'from-purple-500 to-pink-500',
      icon: '👨‍👩‍👧‍👦',
    },
    educational_institutions_premium: {
      name: 'Educational Institutions Premium Plan',
      firstYearPrice: 0,
      renewalPrice: 0,
      features: [
        'Unlimited Academics Access',
        'Advanced Teacher & Admin Dashboards',
        'Comprehensive Analytics & Insights',
        'Certificates & Achievements',
        'WiseClub & Inavora Access',
        'Institution-wide Seat Management',
      ],
      color: 'from-emerald-500 to-green-600',
      icon: '🏫',
      isSchoolPlan: true,
    },
  };

  // Define functions first before using them in useEffect
  const fetchSubscription = useCallback(async () => {
    try {
      const response = await api.get('/api/subscription/current');
      if (response.data.success) {
        setSubscription(response.data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set default free plan if error
      setSubscription({
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: plans.free.features,
      });
    } finally {
      setLoading(false);
    }
  }, [plans.free.features]);

  // Initial data fetch
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Listen for real-time subscription updates
  useEffect(() => {
    if (!socket?.socket) return;

    const handleSubscriptionActivated = (data) => {
      // Check if this update is for the current user
      if (data && data.subscription) {
        toast.success('Subscription updated!', { icon: '🎉' });
        fetchSubscription();
      }
    };

    const handleSubscriptionCancelled = (data) => {
      // Check if this update is for the current user
      if (data && data.subscription) {
        toast.info('Subscription cancelled');
        fetchSubscription();
      }
    };

    socket.socket.on('subscription:activated', handleSubscriptionActivated);
    socket.socket.on('subscription:cancelled', handleSubscriptionCancelled);

    return () => {
      socket.socket.off('subscription:activated', handleSubscriptionActivated);
      socket.socket.off('subscription:cancelled', handleSubscriptionCancelled);
    };
  }, [socket, fetchSubscription]);

  const handleUpgrade = (planType) => {
    const plan = plans[planType];
    if (!plan) {
      toast.error('Invalid plan selected');
      return;
    }

    // Check if user already has this plan
    if (subscription?.planType === planType && subscription?.status === 'active') {
      toast.error('You already have this plan active');
      return;
    }

    // Determine if it's first year or renewal
    const isFirstYear = !subscription || subscription.planType === 'free';
    const amount = isFirstYear
      ? plan.firstYearPrice || plan.renewalPrice || 0
      : plan.renewalPrice || plan.firstYearPrice || 0;

    // Navigate to dedicated checkout page with plan details
    navigate(`/student/payment/checkout?plan=${planType}&firstYear=${isFirstYear ? '1' : '0'}`, {
      state: {
        planType,
        planName: plan.name,
        amount,
        isFirstYear,
      },
    });
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      setUpgrading(true);
      const response = await api.post('/api/subscription/cancel');
      if (response.data.success) {
        toast.success('Subscription cancelled successfully');
        fetchSubscription();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanInfo = (planType) => {
    return plans[planType] || plans.free;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const currentPlan = subscription ? getPlanInfo(subscription.planType) : plans.free;
  const currentPlanType = subscription?.planType || 'free';
  const daysRemaining = subscription?.endDate
    ? Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${currentPlan.color} rounded-xl shadow-lg`}>
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
              <p className="text-sm text-gray-600">Manage your plan and payment methods</p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchSubscription();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Current Subscription Card */}
        <div className={`bg-gradient-to-br ${currentPlan.color} rounded-2xl p-6 mb-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentPlan.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{subscription?.planName || currentPlan.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border-2 mt-2 ${getStatusColor(subscription?.status || 'active').replace('bg-', 'bg-white/20 ').replace('text-', 'text-white ').replace('border-', 'border-white/30 ')}`}>
                    {subscription?.status?.toUpperCase() || 'ACTIVE'}
                  </span>
                </div>
              </div>
              {subscription?.planType !== 'free' && (
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ₹{subscription?.isFirstYear ? (currentPlan.firstYearPrice || currentPlan.renewalPrice).toLocaleString() : (currentPlan.renewalPrice || currentPlan.firstYearPrice).toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">
                    {subscription?.isFirstYear ? 'First Year' : 'Renewal'}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {(() => {
                // Get features from subscription or use plan defaults
                let features = [];
                if (subscription?.features && typeof subscription.features === 'object') {
                  // Convert feature object to array
                  const featureNames = {
                    fullAccess: 'Full Access to All Pillars',
                    parentDashboard: 'Parent Dashboard',
                    advancedAnalytics: 'Advanced Analytics',
                    certificates: 'Certificates & Achievements',
                    wiseClubAccess: 'WiseClub Community Access',
                    inavoraAccess: 'Inavora Presentation Tool',
                  };
                  features = Object.entries(subscription.features)
                    .filter(([, value]) => value === true)
                    .map(([featureKey]) => featureNames[featureKey] || featureKey);
                }
                if (features.length === 0) {
                  features = currentPlan.features || [];
                }
                return features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ));
              })()}
            </div>

            {/* Subscription Details */}
            {subscription && subscription.planType !== 'free' && (
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {subscription.endDate
                      ? `Expires: ${new Date(subscription.endDate).toLocaleDateString()}`
                      : 'Active'}
                  </span>
                </div>
                {daysRemaining !== null && daysRemaining > 0 && (
                  <div className="text-sm font-semibold">
                    {daysRemaining} days remaining
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {subscription?.planType !== 'free' && subscription?.status === 'active' && (
                <button
                  onClick={handleCancel}
                  disabled={upgrading}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel Subscription
                </button>
              )}
              {subscription?.planType === 'free' && (
                <button
                  onClick={() => handleUpgrade('student_premium')}
                  className="flex-1 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Plan Comparison Table */}
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Compare Plans
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="p-4 text-left font-bold text-gray-900 border-b-2 border-purple-200">Features</th>
                  <th className="p-4 text-center font-bold text-gray-900 border-b-2 border-purple-200">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">Free Plan</span>
                      <span className="text-sm font-normal text-gray-600">₹0/year</span>
                    </div>
                  </th>
                  <th className="p-4 text-center font-bold text-gray-900 border-b-2 border-purple-200 bg-purple-100">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">Students Premium</span>
                      <span className="text-sm font-normal text-gray-600">₹4,499/year</span>
                      {currentPlanType === 'free' && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full mt-1">Popular</span>
                      )}
                    </div>
                  </th>
                  <th className="p-4 text-center font-bold text-gray-900 border-b-2 border-purple-200">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">Student + Parent Pro</span>
                      <span className="text-sm font-normal text-gray-600">₹4,999/year</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Games per Pillar', free: '5 games', premium: 'Unlimited', pro: 'Unlimited' },
                  { feature: 'Total Games Access', free: '50 games', premium: '2200+ games', pro: '2200+ games' },
                  { feature: 'Full Access to All 10 Pillars', free: false, premium: true, pro: true },
                  { feature: 'Advanced Analytics', free: false, premium: true, pro: true },
                  { feature: 'Certificates & Achievements', free: false, premium: true, pro: true },
                  { feature: 'WiseClub Community Access', free: false, premium: true, pro: true },
                  { feature: 'Inavora Presentation Tool', free: false, premium: true, pro: true },
                  { feature: 'Parent Dashboard', free: false, premium: false, pro: true },
                  { feature: 'Family Progress Tracking', free: false, premium: false, pro: true },
                  { feature: 'Parent Mental Health Care', free: false, premium: false, pro: true },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-gray-700">{row.free}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-purple-50">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-gray-700 font-semibold">{row.premium}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <CheckCircle className="w-5 h-5 text-green-600 mx-auto" /> : <span className="text-gray-400">—</span>
                      ) : (
                        <span className="text-gray-700 font-semibold">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade Options */}
        {!['student_parent_premium_pro', 'educational_institutions_premium'].includes(currentPlanType) && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Available Upgrades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlanType === 'free' && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`bg-gradient-to-br ${plans.student_premium.color} rounded-2xl p-6 text-white cursor-pointer shadow-xl relative overflow-hidden`}
                    onClick={() => handleUpgrade('student_premium')}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{plans.student_premium.icon}</span>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">POPULAR</span>
                      </div>
                      <h4 className="font-black text-xl mb-3">{plans.student_premium.name}</h4>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black">₹{plans.student_premium.firstYearPrice.toLocaleString()}</span>
                          <span className="text-sm opacity-90">/year</span>
                        </div>
                        <div className="text-xs opacity-75 mt-1">Renewal: ₹{plans.student_premium.renewalPrice.toLocaleString()}/year</div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plans.student_premium.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade('student_parent_premium_pro');
                        }}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Upgrade Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-gradient-to-br ${plans.student_parent_premium_pro.color} rounded-2xl p-6 text-white cursor-pointer shadow-xl relative overflow-hidden`}
                    onClick={() => handleUpgrade('student_parent_premium_pro')}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{plans.student_parent_premium_pro.icon}</span>
                        <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">BEST VALUE</span>
                      </div>
                      <h4 className="font-black text-xl mb-3">{plans.student_parent_premium_pro.name}</h4>
                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black">₹{plans.student_parent_premium_pro.firstYearPrice.toLocaleString()}</span>
                          <span className="text-sm opacity-90">/year</span>
                        </div>
                        <div className="text-xs opacity-75 mt-1">Renewal: ₹{plans.student_parent_premium_pro.renewalPrice.toLocaleString()}/year</div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plans.student_parent_premium_pro.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade('student_premium');
                        }}
                        className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                      >
                        Upgrade Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </>
              )}

              {currentPlanType === 'student_premium' && (
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`bg-gradient-to-br ${plans.student_parent_premium_pro.color} rounded-2xl p-6 text-white cursor-pointer shadow-xl relative overflow-hidden`}
                  onClick={() => handleUpgrade('student_parent_premium_pro')}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{plans.student_parent_premium_pro.icon}</span>
                      <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">BEST VALUE</span>
                    </div>
                    <h4 className="font-black text-xl mb-3">{plans.student_parent_premium_pro.name}</h4>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">
                          ₹{(subscription?.isFirstYear ? plans.student_parent_premium_pro.firstYearPrice : plans.student_parent_premium_pro.renewalPrice).toLocaleString()}
                        </span>
                        <span className="text-sm opacity-90">/year</span>
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {subscription?.isFirstYear ? 'First year pricing' : 'Renewal pricing'}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {plans.student_parent_premium_pro.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpgrade('student_parent_premium_pro');
                      }}
                      className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Upgrade Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

      </motion.div>

    </>
  );
};

export default SubscriptionManagement;


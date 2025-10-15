import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Wallet, Coins, TrendingUp, TrendingDown,
  ShoppingBag, Gift, Calendar, Activity, DollarSign,
  ArrowUpCircle, ArrowDownCircle, Award, Trophy
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { 
  ChildInfoCard, 
  WalletRewardsCard, 
  HealCoinsCard 
} from './ParentDashboard';

const ChildWalletRewards = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parentProfile, setParentProfile] = useState(null);

  useEffect(() => {
    if (childId) {
      fetchChildAnalytics();
    }
  }, [childId]);

  const fetchChildAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsRes, profileRes] = await Promise.all([
        api.get(`/api/parent/child/${childId}/analytics`),
        api.get("/api/user/profile").catch(() => ({ data: null }))
      ]);
      setAnalytics(analyticsRes.data);
      setParentProfile(profileRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load wallet data</p>
          <button
            onClick={() => navigate(`/parent/child/${childId}/analytics`)}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Back to Analytics
          </button>
        </div>
      </div>
    );
  }

  const {
    childCard,
    walletRewards,
    healCoins,
    detailedProgressReport
  } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate(`/parent/child/${childId}/analytics`)}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Analytics Overview</span>
            </button>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <Wallet className="w-10 h-10" />
              Wallet & Rewards Tracking
            </h1>
            <p className="text-lg text-white/90">
              Monitor {childCard?.name || "your child"}'s HealCoins earnings and spending
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Wallet Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Coins className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Current Balance</p>
            <p className="text-3xl font-black text-green-600">
              {healCoins?.currentBalance || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">HealCoins</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <ArrowUpCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Weekly Earned</p>
            <p className="text-3xl font-black text-blue-600">
              {healCoins?.weeklyEarned || 0}
            </p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              This week
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <ArrowDownCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Weekly Spent</p>
            <p className="text-3xl font-black text-red-600">
              {healCoins?.weeklySpent || 0}
            </p>
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Redemptions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Earned</p>
            <p className="text-3xl font-black text-amber-600">
              {detailedProgressReport?.weeklyCoins + detailedProgressReport?.monthlyCoins || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </motion.div>

        {/* Wallet Rewards Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <WalletRewardsCard walletRewards={walletRewards} />
        </motion.div>

        {/* HealCoins Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <HealCoinsCard healCoins={healCoins} />
        </motion.div>
      </div>
    </div>
  );
};

export default ChildWalletRewards;


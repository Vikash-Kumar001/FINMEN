import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BarChart3, Brain, Heart, Wallet, 
  TrendingUp, Activity, Target, Award, Zap, 
  Coins, Flame, BookOpen, Gamepad2, MessageSquare,
  ArrowRight, Eye, Trophy, Star
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { ChildInfoCard, SnapshotKPIsStrip, DigitalTwinGrowthCard, SkillsDistributionCard } from './ParentDashboard';

const ChildAnalyticsOverview = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      fetchChildAnalytics();
    }
  }, [childId]);

  const fetchChildAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/parent/child/${childId}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
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
          <p className="text-gray-600 mb-4">Failed to load analytics</p>
          <button
            onClick={() => navigate('/parent/children')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Back to Children
          </button>
        </div>
      </div>
    );
  }

  const {
    childCard,
    snapshotKPIs,
    level,
    xp,
    streak,
    healCoins,
    digitalTwinData,
    skillsDistribution,
    weeklyEngagement,
    recentAchievements
  } = analytics;

  const QuickAccessCard = ({ title, description, icon: Icon, color, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-300 cursor-pointer transition-all`}
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-purple-600 font-semibold text-sm">View Details</span>
        <ArrowRight className="w-5 h-5 text-purple-600" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => navigate('/parent/children')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to My Children</span>
            </button>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <BarChart3 className="w-10 h-10" />
              {childCard?.name || "Child"}'s Analytics Dashboard
            </h1>
            <p className="text-lg text-white/90">
              Comprehensive overview of learning progress and development
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Child Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ChildInfoCard childCard={childCard} />
        </motion.div>

        {/* Snapshot KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SnapshotKPIsStrip 
            kpis={snapshotKPIs} 
            level={level} 
            xp={xp} 
            streak={streak} 
            healCoins={typeof healCoins === 'object' ? healCoins?.currentBalance : healCoins}
          />
        </motion.div>

        {/* Quick Access Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-7 h-7 text-purple-600" />
            Detailed Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAccessCard
              title="Learning Progress"
              description="Detailed progress reports, achievements, and activity timeline"
              icon={BookOpen}
              color="from-blue-500 to-cyan-600"
              onClick={() => navigate(`/parent/child/${childId}/progress`)}
            />
            <QuickAccessCard
              title="Mood & Wellbeing"
              description="Mental health tracking, conversation prompts, and support plans"
              icon={Heart}
              color="from-pink-500 to-rose-600"
              onClick={() => navigate(`/parent/child/${childId}/wellbeing`)}
            />
            <QuickAccessCard
              title="Wallet & Rewards"
              description="HealCoins transactions, redemptions, and financial activity"
              icon={Wallet}
              color="from-green-500 to-emerald-600"
              onClick={() => navigate(`/parent/child/${childId}/wallet`)}
            />
          </div>
        </motion.div>

        {/* Growth Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-green-600" />
            Growth & Development Charts
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DigitalTwinGrowthCard digitalTwinData={digitalTwinData} />
            <SkillsDistributionCard skillsDistribution={skillsDistribution} />
          </div>
        </motion.div>

        {/* Weekly Engagement Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-7 h-7 text-blue-600" />
            Weekly Engagement Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
              <Gamepad2 className="w-10 h-10 text-blue-600 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Games Played</p>
              <p className="text-4xl font-black text-blue-600">{weeklyEngagement?.gameSessions || 0}</p>
              <p className="text-xs text-gray-600 mt-2">{weeklyEngagement?.gamesMinutes || 0} minutes</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <BookOpen className="w-10 h-10 text-green-600 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Lessons Completed</p>
              <p className="text-4xl font-black text-green-600">{weeklyEngagement?.lessonSessions || 0}</p>
              <p className="text-xs text-gray-600 mt-2">{weeklyEngagement?.lessonsMinutes || 0} minutes</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <Activity className="w-10 h-10 text-purple-600 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Total Time</p>
              <p className="text-4xl font-black text-purple-600">{weeklyEngagement?.totalMinutes || 0}</p>
              <p className="text-xs text-gray-600 mt-2">minutes this week</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        {recentAchievements && recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 mt-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-600" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAchievements.slice(0, 6).map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
                      {achievement.type === 'badge' ? (
                        <Award className="w-6 h-6 text-white" />
                      ) : (
                        <Trophy className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{achievement.game}</p>
                      <p className="text-xs text-gray-600">{achievement.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-yellow-700 font-semibold">{achievement.achievement}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChildAnalyticsOverview;


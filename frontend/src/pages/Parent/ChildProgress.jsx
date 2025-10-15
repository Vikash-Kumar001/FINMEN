import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Trophy, Activity, Target,
  TrendingUp, Star, Award, Zap, Brain, Gamepad2
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { 
  ChildInfoCard, 
  DetailedProgressReportCard, 
  ActivityTimelineCard,
  AchievementsCard
} from './ParentDashboard';

const ChildProgress = () => {
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
      toast.error('Failed to load progress data');
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
          <p className="text-gray-600 mb-4">Failed to load progress data</p>
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
    detailedProgressReport,
    activityTimeline,
    recentAchievements,
    overallMastery
  } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-8 px-6">
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
              <BookOpen className="w-10 h-10" />
              Learning Progress & Development
            </h1>
            <p className="text-lg text-white/90">
              Detailed insights into {childCard?.name || "your child"}'s learning journey
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Overall Mastery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-7 h-7 text-purple-600" />
            Overall Mastery by Pillar
          </h2>
          <div className="space-y-4">
            {overallMastery?.byPillar && Object.entries(overallMastery.byPillar).map(([pillar, percentage], idx) => {
              const colors = [
                'from-blue-500 to-cyan-600',
                'from-green-500 to-emerald-600',
                'from-purple-500 to-pink-600',
                'from-amber-500 to-orange-600',
                'from-red-500 to-rose-600',
                'from-indigo-500 to-violet-600'
              ];
              return (
                <motion.div
                  key={pillar}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">{pillar}</span>
                    <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.05 + 0.3 }}
                      className={`bg-gradient-to-r ${colors[idx % colors.length]} h-3 rounded-full shadow-lg relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Detailed Progress Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <DetailedProgressReportCard progressReport={detailedProgressReport} />
        </motion.div>

        {/* Recent Achievements */}
        {recentAchievements && recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <AchievementsCard achievements={recentAchievements} />
          </motion.div>
        )}

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ActivityTimelineCard activityTimeline={activityTimeline || []} />
        </motion.div>
      </div>
    </div>
  );
};

export default ChildProgress;


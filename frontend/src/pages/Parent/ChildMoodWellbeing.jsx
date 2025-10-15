import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Heart, MessageSquare, Lightbulb, 
  TrendingUp, AlertTriangle, Smile, Frown, Meh,
  Calendar, Activity, Target, Brain
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { 
  ChildInfoCard, 
  MoodWithPromptsCard, 
  HomeSupportPlanCard 
} from './ParentDashboard';

const ChildMoodWellbeing = () => {
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
      toast.error('Failed to load wellbeing data');
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
          <p className="text-gray-600 mb-4">Failed to load wellbeing data</p>
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
    moodSummary,
    homeSupportPlan
  } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white py-8 px-6">
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
              <Heart className="w-10 h-10" />
              Mood & Mental Wellbeing
            </h1>
            <p className="text-lg text-white/90">
              Track {childCard?.name || "your child"}'s emotional health and get support recommendations
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-4">
        {/* Mood Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <MoodWithPromptsCard moodSummary={moodSummary} />
        </motion.div>

        {/* Mood Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Mood Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <Smile className="w-10 h-10 text-green-600 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Positive Days</p>
              <p className="text-4xl font-black text-green-600">
                {moodSummary?.entries?.filter(e => e.score >= 4).length || 0}
              </p>
              <p className="text-xs text-gray-600 mt-2">out of {moodSummary?.entries?.length || 0} entries</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
              <Meh className="w-10 h-10 text-yellow-600 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Neutral Days</p>
              <p className="text-4xl font-black text-yellow-600">
                {moodSummary?.entries?.filter(e => e.score === 3).length || 0}
              </p>
              <p className="text-xs text-gray-600 mt-2">balanced mood</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
              <Frown className="w-10 h-10 text-red-600 mb-3" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Challenging Days</p>
              <p className="text-4xl font-black text-red-600">
                {moodSummary?.entries?.filter(e => e.score <= 2).length || 0}
              </p>
              <p className="text-xs text-gray-600 mt-2">needs attention</p>
            </div>
          </div>
        </motion.div>

        {/* Mood Alerts */}
        {moodSummary?.alerts && moodSummary.alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg border-2 border-red-200 p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-red-600" />
              Mood Alerts & Concerns
            </h2>
            <div className="space-y-3">
              {moodSummary.alerts.map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-5 rounded-xl border-2 ${
                    alert.severity === 'high' 
                      ? 'bg-red-100 border-red-300' 
                      : 'bg-yellow-100 border-yellow-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-6 h-6 ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    } mt-1`} />
                    <div>
                      <p className={`font-bold ${
                        alert.severity === 'high' ? 'text-red-900' : 'text-yellow-900'
                      } mb-1`}>
                        {alert.type === 'alert' ? '⚠️ Alert' : '⚡ Warning'}
                      </p>
                      <p className="text-gray-700">{alert.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Home Support Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HomeSupportPlanCard supportPlan={homeSupportPlan || []} />
        </motion.div>
      </div>
    </div>
  );
};

export default ChildMoodWellbeing;


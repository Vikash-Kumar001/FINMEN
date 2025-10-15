import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Loader, TrendingUp, Coins, Flame, Award, 
  Calendar, Activity, Brain, Heart, Target, Users
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// Import parent dashboard components (reuse them)
import { 
  ChildInfoCard, 
  SnapshotKPIsStrip, 
  MoodWithPromptsCard,
  ActivityTimelineCard,
  DetailedProgressReportCard,
  WalletRewardsCard,
  DigitalTwinGrowthCard,
  SkillsDistributionCard,
  HomeSupportPlanCard,
  MessagesCard
} from '../Parent/ParentDashboard';

const TeacherStudentProgress = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchStudentAnalytics();
    }
  }, [studentId]);

  const fetchStudentAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/school/teacher/student/${studentId}/analytics`);
      
      // Extract data from response (matches parent endpoint structure)
      const data = response.data;
      
      setStudent({
        ...data.student,
        ...data.childCard, // Include childCard data
        level: data.level,
        xp: data.xp,
        streak: data.streak,
        healCoins: typeof data.healCoins === 'object' 
          ? (data.healCoins?.currentBalance || 0)
          : (data.healCoins || 0)
      });
      
      setAnalytics(data); // Store entire response for components to use
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Student not found</p>
          <button
            onClick={() => navigate('/school-teacher/students')}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            Back to All Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/school-teacher/students')}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to All Students</span>
          </button>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Student Progress Report
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive analytics and insights for {student.name}
            </p>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="mb-6">
          <ChildInfoCard childCard={analytics?.childCard || student} />
        </div>

        {/* KPIs Strip */}
        <div className="mb-8">
          <SnapshotKPIsStrip 
            kpis={analytics?.snapshotKPIs} 
            level={analytics?.level || student.level}
            xp={analytics?.xp || student.xp}
            streak={analytics?.streak || student.streak}
            healCoins={
              typeof analytics?.healCoins === 'object' 
                ? (analytics?.healCoins?.currentBalance || 0)
                : (analytics?.healCoins || student.healCoins || 0)
            }
          />
        </div>

        {/* Detailed Progress & Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DetailedProgressReportCard progressReport={analytics?.detailedProgressReport} />
          <WalletRewardsCard walletRewards={analytics?.walletRewards} />
        </div>

        {/* Digital Twin Growth & Skills Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DigitalTwinGrowthCard 
            digitalTwinData={analytics?.digitalTwinData} 
          />
          <SkillsDistributionCard 
            skillsDistribution={analytics?.skillsDistribution} 
          />
        </div>

        {/* Mood Summary with Conversation Prompts */}
        <div className="mb-8">
          <MoodWithPromptsCard moodSummary={analytics?.moodSummary} />
        </div>

        {/* Activity Timeline & Home Support Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityTimelineCard activityTimeline={analytics?.activityTimeline || []} />
          <HomeSupportPlanCard supportPlan={analytics?.homeSupportPlan || []} />
        </div>

        {/* Messages/Notifications */}
        {analytics?.messages && analytics.messages.length > 0 && (
          <div className="mb-8">
            <MessagesCard messages={analytics.messages} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentProgress;


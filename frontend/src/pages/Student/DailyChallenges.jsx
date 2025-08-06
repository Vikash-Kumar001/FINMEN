import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiAward, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useWallet } from '../../context/WalletContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../utils/api';

const DailyChallenges = () => {
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //
  const { refreshWallet } = useWallet();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      // Fetch 10 daily challenges
      const dailyRes = await api.get('/api/daily-challenges');
      setDailyChallenges(dailyRes.data.challenges);
      // Fetch weekly challenge as before
      const weeklyRes = await api.get('/api/daily-challenges/active');
      setWeekly(weeklyRes.data.weekly);
      setError(null);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges. Please try again.');
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (challengeId, step) => {
    try {
      const response = await api.post(`/api/daily-challenges/progress/${challengeId}`, { step });
      setDailyChallenges(prev => prev.map(dc =>
        dc.challenge._id === challengeId
          ? { ...dc, progress: response.data.progress }
          : dc
      ));
      if (response.data.isCompleted) {
        toast.success(
          <div>
            <p>Challenge completed! 🎉</p>
            <p>Rewards: {response.data.rewards.xp} XP, {response.data.rewards.coins} HealCoins</p>
          </div>
        );
        refreshWallet();
      } else {
        toast.success('Progress updated!');
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      toast.error(err.response?.data?.error || 'Failed to update progress');
    }
  };

  const ChallengeCard = ({ challenge, progress }) => {
    if (!challenge) return null;
    const gradientClass = challenge.gradientColors || 'from-green-400 to-emerald-500';
    const totalSteps = challenge.completionSteps;
    const completedSteps = progress?.completedSteps?.length || 0;
    const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300`}
      >
        <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-gradient-to-r ${gradientClass} text-white mr-4`}>
                <FiCalendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
                <p className="text-sm text-gray-500">{challenge.description}</p>
              </div>
            </div>
            {progress?.isCompleted && (
              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                <FiCheckCircle className="mr-1" />
                Completed
              </div>
            )}
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="mr-2" />
              <span>Estimated time: {challenge.estimatedTime}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiAward className="mr-2" />
              <span>Rewards: {challenge.xpReward} XP, {challenge.coinReward} HealCoins</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{completedSteps}/{totalSteps} steps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full bg-gradient-to-r ${gradientClass}`} 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Steps to complete:</h4>
              <div className="space-y-2">
                {Array.from({ length: totalSteps }, (_, i) => {
                  const stepNumber = i + 1;
                  const isCompleted = progress?.completedSteps?.includes(stepNumber);
                  return (
                    <div key={stepNumber} className="flex items-center">
                      <button
                        onClick={() => !isCompleted && !progress?.isCompleted && updateProgress(challenge._id, stepNumber)}
                        disabled={isCompleted || progress?.isCompleted}
                        className={`p-1 rounded-full mr-2 ${isCompleted 
                          ? 'bg-green-100 text-green-600' 
                          : progress?.isCompleted 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {isCompleted ? (
                          <FiCheckCircle className="w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center text-xs font-medium">
                            {stepNumber}
                          </div>
                        )}
                      </button>
                      <span className={`text-sm ${isCompleted ? 'text-green-600 line-through' : 'text-gray-600'}`}>
                        Complete step {stepNumber} of the challenge
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchChallenges}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily & Weekly Challenges</h1>
        <p className="text-gray-600">
          Complete challenges to earn XP and HealCoins. Daily challenges reset every day, while weekly challenges give you the entire week to complete them.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiCalendar className="mr-2" /> Today's 10 Daily Challenges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {dailyChallenges.map((dc) => (
            <ChallengeCard key={dc.challenge._id} challenge={dc.challenge} progress={dc.progress} />
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiTrendingUp className="mr-2" /> Weekly Challenge
        </h2>
        {weekly && (
          <ChallengeCard challenge={weekly.challenge} progress={weekly.progress} />
        )}
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Why Complete Challenges?</h3>
        <ul className="space-y-2">
          {dailyChallenges.daily?.challenge?.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
          {weekly?.challenge?.benefits.map((benefit, index) => (
            <li key={`weekly-${index}`} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyChallenges;
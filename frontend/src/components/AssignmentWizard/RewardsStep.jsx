import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Award, Trophy, Plus, X } from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const RewardsStep = ({ data, updateData }) => {
  const [availableBadges, setAvailableBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get("/api/school/teacher/available-badges");
      setAvailableBadges(response.data.badges || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBadge = (badge) => {
    const isSelected = data.badges.some(b => b._id === badge._id);
    if (isSelected) {
      updateData({ badges: data.badges.filter(b => b._id !== badge._id) });
    } else {
      updateData({ badges: [...data.badges, badge] });
    }
  };

  const bonusMultipliers = [
    { value: 1, label: "1x (Standard)", color: "gray" },
    { value: 1.5, label: "1.5x (Good)", color: "blue" },
    { value: 2, label: "2x (Great)", color: "purple" },
    { value: 3, label: "3x (Amazing)", color: "amber" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Set Rewards</h3>
        <p className="text-gray-600">Motivate students with HealCoins, badges, and certificates</p>
      </div>

      {/* HealCoins */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-6 h-6 text-amber-600" />
          <h4 className="font-bold text-gray-900">HealCoins Reward</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Base Coins: {data.healCoins}
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={data.healCoins}
              onChange={(e) => updateData({ healCoins: parseInt(e.target.value) })}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>10</span>
              <span>500</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Bonus Multiplier</label>
            <div className="grid grid-cols-2 gap-2">
              {bonusMultipliers.map((mult) => {
                const isSelected = data.bonusMultiplier === mult.value;
                
                return (
                  <motion.button
                    key={mult.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateData({ bonusMultiplier: mult.value })}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      isSelected
                        ? `bg-${mult.color}-500 text-white border-${mult.color}-500`
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    {mult.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
            <p className="text-sm text-gray-700">
              <strong>Total Reward:</strong>{" "}
              <span className="text-2xl font-bold text-amber-600">
                {data.healCoins * data.bonusMultiplier}
              </span>{" "}
              <span className="text-amber-600">HealCoins</span>
            </p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-purple-600" />
          <h4 className="font-bold text-gray-900">Achievement Badges ({data.badges.length} selected)</h4>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {availableBadges.map((badge) => {
              const isSelected = data.badges.some(b => b._id === badge._id);
              
              return (
                <motion.button
                  key={badge._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleBadge(badge)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{badge.name}</span>
                    {isSelected && <Award className="w-4 h-4" />}
                  </div>
                  <p className="text-xs opacity-90">{badge.description}</p>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificate */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-bold text-gray-900">Completion Certificate</h4>
              <p className="text-sm text-gray-600 mt-1">Award certificate upon completion</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.certificate}
              onChange={(e) => updateData({ certificate: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default RewardsStep;


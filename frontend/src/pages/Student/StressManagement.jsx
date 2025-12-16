import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HeartPulse,
  Wind,
  Coffee,
  Moon,
  Zap,
  SmilePlus,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";

const QUICK_TIPS = [
  {
    id: 1,
    title: "Box Breathing (4–4–4–4)",
    icon: <Wind className="w-5 h-5" />,
    durationLabel: "3 minutes",
    durationSeconds: 180,
    description:
      "Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat slowly to calm your nervous system.",
  },
  {
    id: 2,
    title: "Micro Break",
    icon: <Coffee className="w-5 h-5" />,
    durationLabel: "4 minutes",
    durationSeconds: 240,
    description:
      "Stand up, stretch your neck and shoulders, and look away from screens. Let your eyes and brain relax.",
  },
  {
    id: 3,
    title: "Gratitude Reset",
    icon: <SmilePlus className="w-5 h-5" />,
    durationLabel: "2 minutes",
    durationSeconds: 120,
    description:
      "Write or think of 3 things you are grateful for today. This shifts your brain from stress to positivity.",
  },
  {
    id: 4,
    title: "Sleep Wind-Down",
    icon: <Moon className="w-5 h-5" />,
    durationLabel: "12 minutes",
    durationSeconds: 720,
    description:
      "Reduce bright screens, take a few deep breaths, and do something calming like reading or light stretching.",
  },
];

const STRESS_LEVELS = [
  { label: "Low", value: 1, color: "from-emerald-400 to-green-500", emoji: "🙂" },
  { label: "Moderate", value: 2, color: "from-yellow-400 to-amber-500", emoji: "😕" },
  { label: "High", value: 3, color: "from-orange-500 to-red-500", emoji: "😣" },
];

export default function StressManagement() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTipId, setSelectedTipId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("idle"); // idle | running | paused | completed
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Load last selections for a smoother, "professional" UX
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ws_stress_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.selectedLevel) setSelectedLevel(parsed.selectedLevel);
        if (parsed.selectedTipId) setSelectedTipId(parsed.selectedTipId);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "ws_stress_session",
        JSON.stringify({ selectedLevel, selectedTipId })
      );
    } catch {
      // ignore
    }
  }, [selectedLevel, selectedTipId]);

  const handleBackToBrainHealth = () => {
    logActivity({
      activityType: "navigation",
      description: "Navigated from Stress Management back to Brain Health",
      metadata: {
        from: "/tools/stress-management",
        to: "/student/dashboard/brain-health",
      },
    });
    navigate("/student/dashboard/brain-health");
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level.value);
    logActivity({
      activityType: "wellness_activity",
      description: `Selected stress level: ${level.label}`,
      metadata: {
        action: "select_stress_level",
        level: level.label,
        value: level.value,
      },
    });
  };

  const handleStartTip = (tip) => {
    setSelectedTipId(tip.id);
    // Prepare session timer whenever user changes tip
    setTotalSeconds(tip.durationSeconds);
    setRemainingSeconds(tip.durationSeconds);
    setSessionStatus("idle");
    logActivity({
      activityType: "wellness_activity",
      description: `Started stress tip: ${tip.title}`,
      metadata: {
        action: "start_stress_tip",
        tipId: tip.id,
        title: tip.title,
      },
    });
    toast.success(`Great choice: "${tip.title}" – take a short pause to follow it now.`);
  };

  const selectedLevelObj = STRESS_LEVELS.find((l) => l.value === selectedLevel);
  const selectedTip = QUICK_TIPS.find((t) => t.id === selectedTipId);

  // Session timer
  useEffect(() => {
    if (sessionStatus !== "running" || !totalSeconds) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const stressLabel = selectedLevelObj?.label || "Unknown";
          const xpEarned = selectedLevelObj
            ? selectedLevelObj.value * Math.max(1, Math.round(totalSeconds / 120))
            : Math.max(1, Math.round(totalSeconds / 180));

          setSessionStatus("completed");

          logActivity({
            activityType: "wellness_activity",
            description: "Completed stress management micro-session",
            metadata: {
              action: "complete_stress_session",
              stressLevel: stressLabel,
              tipId: selectedTip?.id,
              tipTitle: selectedTip?.title,
              durationSeconds: totalSeconds,
              xpEarned,
            },
          });

          toast.success(`Nice work. Session complete! You earned ${xpEarned} XP (internally).`);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus, totalSeconds]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSessionStartPause = () => {
    if (!selectedTip) {
      toast.error("Choose a calming tool first.");
      return;
    }
    if (!totalSeconds) {
      setTotalSeconds(selectedTip.durationSeconds);
      setRemainingSeconds(selectedTip.durationSeconds);
    }
    if (sessionStatus === "running") {
      setSessionStatus("paused");
      logActivity({
        activityType: "wellness_activity",
        description: "Paused stress management session",
        metadata: {
          action: "pause_stress_session",
          remainingSeconds,
          tipId: selectedTip.id,
        },
      });
    } else {
      setSessionStatus("running");
      logActivity({
        activityType: "wellness_activity",
        description: "Started/Resumed stress management session",
        metadata: {
          action: "start_resume_stress_session",
          totalSeconds: totalSeconds || selectedTip.durationSeconds,
          tipId: selectedTip.id,
        },
      });
    }
  };

  const handleSessionReset = () => {
    if (selectedTip) {
      setTotalSeconds(selectedTip.durationSeconds);
      setRemainingSeconds(selectedTip.durationSeconds);
    } else {
      setTotalSeconds(0);
      setRemainingSeconds(0);
    }
    setSessionStatus("idle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.03, x: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBackToBrainHealth}
            className="inline-flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-md border border-gray-200 hover:shadow-lg hover:bg-gray-50 text-sm font-semibold text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Brain Health</span>
          </motion.button>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>Quick tools to calm your mind</span>
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Stress Management Hub
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Notice your stress level, pick a quick tool, and give your brain a short reset. Even
            2–3 minutes can help.
          </p>
        </motion.div>

        {/* Stress level selector */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              How stressed do you feel right now?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STRESS_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.value;
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleSelectLevel(level)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${
                    isSelected
                      ? `bg-gradient-to-r ${level.color} text-white border-white shadow-lg`
                      : "bg-white/90 border-gray-200 hover:border-indigo-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{level.emoji}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {level.label}
                    </span>
                  </div>
                  <span className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                    Tap to mark your current stress level
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Quick tools */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Choose a quick calming tool
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUICK_TIPS.map((tip) => {
              const isActive = selectedTipId === tip.id;
              return (
                <button
                  key={tip.id}
                  type="button"
                  onClick={() => handleStartTip(tip)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                    isActive
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : "border-gray-200 bg-white/90 hover:border-indigo-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                        {tip.icon}
                      </div>
                      <span className="text-sm sm:text-base font-semibold text-gray-900">
                        {tip.title}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-semibold">
                      {tip.durationLabel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{tip.description}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Session controller & summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">
                  Small steps matter. Even a few focused minutes help your brain reset.
                </p>
                <p className="text-xs sm:text-sm text-white/80">
                  Use these tools whenever you feel overwhelmed, before exams, or after a long day.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-end text-xs sm:text-sm">
              <p className="font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Session timer:{" "}
                <span className="font-mono">
                  {totalSeconds ? formatTime(remainingSeconds || totalSeconds) : "00:00"}
                </span>
              </p>
              {selectedLevelObj && (
                <p className="mt-1">
                  Current stress: {selectedLevelObj.emoji} {selectedLevelObj.label}
                </p>
              )}
              {selectedTip && (
                <p className="mt-1 text-white/80">
                  Tip in focus: <span className="font-semibold">{selectedTip.title}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/20">
            <p className="text-[10px] sm:text-xs text-white/80 max-w-md">
              This tool supports wellbeing but is not a medical or emergency service. If your stress
              feels unmanageable or you have thoughts of self‑harm, please reach out to a trusted
              adult, counselor, or local helpline immediately.
            </p>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSessionStartPause}
                className="px-4 py-2 rounded-2xl bg-white text-xs sm:text-sm font-semibold text-indigo-600 shadow-md hover:shadow-lg"
              >
                {sessionStatus === "running" ? "Pause Session" : "Start Session"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSessionReset}
                className="px-3 py-2 rounded-2xl bg-white/10 border border-white/40 text-xs sm:text-sm font-semibold text-white hover:bg-white/15"
              >
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}



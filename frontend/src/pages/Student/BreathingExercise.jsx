import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Heart, 
    Play, 
    Pause, 
    RotateCcw, 
    Sparkles, 
    Star, 
    Award,
    Clock,
    CheckCircle,
    ArrowLeft,
    Zap,
    Target
} from "lucide-react";
import { logActivity } from "../../services/activityService";
import { toast } from "react-toastify";

const breathingPhases = [
    { 
        label: "Inhale", 
        duration: 4000,
        instruction: "Breathe in slowly and deeply",
        color: "from-blue-400 to-cyan-400",
        bgColor: "from-blue-50 to-cyan-50",
        emoji: "🌊"
    },
    { 
        label: "Hold", 
        duration: 3000,
        instruction: "Hold your breath gently",
        color: "from-purple-400 to-violet-400",
        bgColor: "from-purple-50 to-violet-50",
        emoji: "⭐"
    },
    { 
        label: "Exhale", 
        duration: 4000,
        instruction: "Release slowly and completely",
        color: "from-emerald-400 to-green-400",
        bgColor: "from-emerald-50 to-green-50",
        emoji: "🍃"
    },
];

export default function BreathingExercise() {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [cycleCount, setCycleCount] = useState(1);
    const [running, setRunning] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [showCompletionMessage, setShowCompletionMessage] = useState(false);
    
    // Log page view when component mounts
    useEffect(() => {
        logActivity({
            activityType: "page_view",
            description: "Viewed breathing exercise page"
        });
    }, []);

    useEffect(() => {
        if (!running) return;

        const { duration } = breathingPhases[phaseIndex];
        const timer = setTimeout(() => {
            setPhaseIndex((prev) => {
                const nextIndex = (prev + 1) % breathingPhases.length;
                if (nextIndex === 0) {
                    const newCycleCount = cycleCount + 1;
                    setCycleCount(newCycleCount);
                    
                    // Log completion of a breathing cycle
                    logActivity({
                        activityType: "wellness_activity",
                        description: "Completed breathing cycle",
                        metadata: {
                            action: "complete_breathing_cycle",
                            cycleNumber: newCycleCount - 1, // Log the cycle that was just completed
                            totalCycles: newCycleCount,
                            timeSpent: totalTime,
                            xpEarned: 8 // XP earned per cycle
                        }
                    });
                }
                return nextIndex;
            });
        }, duration);

        return () => clearTimeout(timer);
    }, [phaseIndex, running, cycleCount, totalTime]);

    // Timer for total session time
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setTotalTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    // Show completion message after certain cycles
    useEffect(() => {
        if (cycleCount >= 5 && !showCompletionMessage) {
            setShowCompletionMessage(true);
            
            // Log achievement when user completes 5 cycles
            logActivity({
                activityType: "wellness_activity",
                description: "Completed 5 breathing cycles",
                metadata: {
                    action: "complete_breathing_milestone",
                    cyclesCompleted: cycleCount,
                    timeSpent: totalTime,
                    xpEarned: cycleCount * 8
                }
            });
            
            toast.success("🎉 Achievement unlocked: 5 breathing cycles completed!");
        }
    }, [cycleCount, showCompletionMessage, totalTime]);

    const currentPhase = breathingPhases[phaseIndex];

    const handleStart = () => {
        setRunning(true);
        
        // Log start of breathing exercise
        logActivity({
            activityType: "wellness_activity",
            description: "Started breathing exercise",
            metadata: {
                action: "start_breathing_exercise",
                currentCycleCount: cycleCount,
                currentPhase: breathingPhases[phaseIndex].label
            }
        });
    };

    const handlePause = () => {
        setRunning(false);
        
        // Log pause of breathing exercise
        logActivity({
            activityType: "wellness_activity",
            description: "Paused breathing exercise",
            metadata: {
                action: "pause_breathing_exercise",
                cyclesCompleted: cycleCount,
                timeSpent: totalTime,
                currentPhase: breathingPhases[phaseIndex].label
            }
        });
    };

    const handleReset = () => {
        // Log reset of breathing exercise with previous stats
        logActivity({
            activityType: "wellness_activity",
            description: "Reset breathing exercise",
            metadata: {
                action: "reset_breathing_exercise",
                previousCyclesCompleted: cycleCount,
                previousTimeSpent: totalTime,
                xpEarned: cycleCount * 8
            }
        });
        
        setRunning(false);
        setPhaseIndex(0);
        setCycleCount(1);
        setTotalTime(0);
        setShowCompletionMessage(false);
        
        toast.info("Breathing exercise reset");
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl animate-pulse delay-2000" />

                {/* Floating elements */}
                <motion.div
                    className="absolute top-1/4 left-1/3 w-6 h-6 bg-yellow-400 rounded-full opacity-60"
                    animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute top-2/3 right-1/4 w-4 h-4 bg-pink-400 rotate-45 opacity-50"
                    animate={{
                        y: [0, -15, 0],
                        rotate: [45, 225, 45],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        className="relative inline-block"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-3 flex items-center gap-3 justify-center">
                            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                                Mindful Breathing
                            </span>
                            <span className="text-4xl animate-pulse">🧘‍♀️</span>
                        </h1>
                        <div className="absolute -top-2 -right-2 text-blue-400 animate-bounce">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 text-cyan-400 animate-bounce delay-300">
                            <Star className="w-5 h-5" />
                        </div>
                    </motion.div>
                    <motion.p
                        className="text-gray-600 text-lg sm:text-xl font-medium tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Find your calm, one breath at a time ✨
                    </motion.p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 mb-8 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-bold text-blue-700">Cycles</span>
                            </div>
                            <div className="text-3xl font-black text-blue-600">{cycleCount}</div>
                            <div className="text-xs text-blue-500 font-medium">completed</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-purple-500" />
                                <span className="text-sm font-bold text-purple-700">Time</span>
                            </div>
                            <div className="text-3xl font-black text-purple-600">{formatTime(totalTime)}</div>
                            <div className="text-xs text-purple-500 font-medium">minutes</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-bold text-green-700">XP Earned</span>
                            </div>
                            <div className="text-3xl font-black text-green-600">{cycleCount * 8}</div>
                            <div className="text-xs text-green-500 font-medium">points</div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Breathing Circle */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative w-80 h-80 mb-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${phaseIndex}-${running}`}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ 
                                    scale: running ? [0.6, 1, 0.6] : 0.8,
                                    opacity: 1,
                                    rotate: running ? [0, 360] : 0,
                                }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{ 
                                    duration: running ? currentPhase.duration / 1000 : 0.5,
                                    ease: "easeInOut",
                                    rotate: {
                                        duration: running ? currentPhase.duration / 1000 : 0,
                                        ease: "linear"
                                    }
                                }}
                                className={`w-full h-full rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${currentPhase.color}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                
                                <div className="text-center z-10">
                                    <div className="text-6xl mb-2">{currentPhase.emoji}</div>
                                    <div className="text-2xl font-bold text-white mb-1">{currentPhase.label}</div>
                                    <div className="text-sm text-white/90 font-medium px-4">
                                        {currentPhase.instruction}
                                    </div>
                                </div>

                                {/* Animated ripple effect */}
                                {running && (
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-white/50"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: currentPhase.duration / 1000,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Phase indicator */}
                    <div className="flex gap-2 mb-6">
                        {breathingPhases.map((phase, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === phaseIndex 
                                        ? `bg-gradient-to-r ${phase.color} shadow-lg` 
                                        : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-4 mb-8">
                        {!running ? (
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg hover:shadow-2xl transition-all"
                            >
                                <Play className="w-6 h-6" />
                                Start Breathing
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={handlePause}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg hover:shadow-2xl transition-all"
                            >
                                <Pause className="w-6 h-6" />
                                Pause
                            </motion.button>
                        )}
                        
                        <motion.button
                            onClick={handleReset}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-4 rounded-2xl shadow-xl font-semibold text-lg hover:shadow-2xl transition-all"
                        >
                            <RotateCcw className="w-6 h-6" />
                            Reset
                        </motion.button>
                    </div>
                </div>

                {/* Completion Message */}
                <AnimatePresence>
                    {showCompletionMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.8 }}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-3xl shadow-2xl text-center mb-8"
                        >
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <Award className="w-8 h-8" />
                                <h3 className="text-2xl font-bold">Great Job!</h3>
                                <Award className="w-8 h-8" />
                            </div>
                            <p className="text-green-100 mb-4">
                                You've completed {cycleCount} breathing cycles. Your mindfulness practice is paying off!
                            </p>
                            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                                <Zap className="w-5 h-5" />
                                <span>+{cycleCount * 8} XP Earned</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 mb-8"
                >
                    <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Benefits of Breathing Exercises
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <Heart className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Reduces Stress</h4>
                                <p className="text-gray-600 text-sm">Calms your nervous system and reduces cortisol levels</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Improves Focus</h4>
                                <p className="text-gray-600 text-sm">Enhances concentration and mental clarity</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Better Sleep</h4>
                                <p className="text-gray-600 text-sm">Promotes relaxation and improves sleep quality</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                <Target className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Emotional Balance</h4>
                                <p className="text-gray-600 text-sm">Helps regulate emotions and mood</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Back Button */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            // Log navigation back to dashboard
                            logActivity({
                                activityType: "navigation",
                                description: "Navigated from breathing exercise to previous page",
                                metadata: {
                                    action: "exit_breathing_exercise",
                                    from: "breathing_exercise",
                                    cyclesCompleted: cycleCount,
                                    timeSpent: totalTime,
                                    xpEarned: cycleCount * 8
                                }
                            });
                            window.history.back();
                        }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-2xl shadow-lg font-semibold hover:shadow-xl transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
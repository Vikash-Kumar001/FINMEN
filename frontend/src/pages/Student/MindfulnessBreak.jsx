import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Play,
    Pause,
    RotateCcw,
    Volume2,
    VolumeX,
    Sparkles,
    Heart,
    Cloud,
    Sun,
    Moon
} from "lucide-react";
import { toast } from "react-hot-toast";
import { logActivity } from "../../services/activityService";

export default function MindfulnessBreak() {
    const navigate = useNavigate();
    const [activeExercise, setActiveExercise] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [breathCount, setBreathCount] = useState(0);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale

    const exercises = [
        {
            id: 'box-breathing',
            name: 'Box Breathing',
            description: 'Breathe in for 4, hold for 4, breathe out for 4, hold for 4',
            icon: '📦',
            color: 'from-blue-400 to-cyan-500',
            duration: 16, // seconds per cycle
            phases: [
                { name: 'Breathe In', duration: 4, instruction: 'Inhale deeply through your nose' },
                { name: 'Hold', duration: 4, instruction: 'Hold your breath' },
                { name: 'Breathe Out', duration: 4, instruction: 'Exhale slowly through your mouth' },
                { name: 'Hold', duration: 4, instruction: 'Hold your breath' }
            ]
        },
        {
            id: 'calm-breathing',
            name: 'Calm Breathing',
            description: 'Simple 4-7-8 breathing technique for relaxation',
            icon: '🌊',
            color: 'from-purple-400 to-pink-500',
            duration: 19,
            phases: [
                { name: 'Breathe In', duration: 4, instruction: 'Breathe in through your nose' },
                { name: 'Hold', duration: 7, instruction: 'Hold gently' },
                { name: 'Breathe Out', duration: 8, instruction: 'Exhale completely' }
            ]
        },
        {
            id: 'energy-boost',
            name: 'Energy Boost',
            description: 'Quick energizing breathing to refresh your mind',
            icon: '⚡',
            color: 'from-yellow-400 to-orange-500',
            duration: 12,
            phases: [
                { name: 'Quick In', duration: 2, instruction: 'Quick breath in' },
                { name: 'Hold', duration: 4, instruction: 'Hold the energy' },
                { name: 'Slow Out', duration: 6, instruction: 'Release slowly' }
            ]
        },
        {
            id: 'meditation',
            name: 'Guided Meditation',
            description: '5-minute peaceful meditation session',
            icon: '🧘',
            color: 'from-green-400 to-emerald-500',
            duration: 300,
            phases: [
                { name: 'Relax', duration: 300, instruction: 'Close your eyes and find your center' }
            ]
        }
    ];

    const quickTips = [
        { tip: 'Find a quiet space', icon: '🤫', color: 'from-blue-400 to-cyan-400' },
        { tip: 'Sit comfortably', icon: '💺', color: 'from-purple-400 to-pink-400' },
        { tip: 'Close your eyes', icon: '👁️', color: 'from-green-400 to-emerald-400' },
        { tip: 'Focus on breath', icon: '🌬️', color: 'from-orange-400 to-red-400' }
    ];

    useEffect(() => {
        logActivity({
            activityType: "page_view",
            description: "Viewed Mindfulness Break page",
            metadata: {
                page: "/student/mindfull-break",
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
    }, []);

    useEffect(() => {
        if (!isPlaying || !activeExercise) return;

        const interval = setInterval(() => {
            setTimerSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, activeExercise]);

    const startExercise = (exercise) => {
        setActiveExercise(exercise);
        setIsPlaying(true);
        setBreathCount(0);
        setTimerSeconds(0);
        
        toast.success(`Starting ${exercise.name}`, {
            icon: exercise.icon,
            duration: 2000
        });

        logActivity({
            activityType: "feature_used",
            description: `Started mindfulness exercise: ${exercise.name}`,
            metadata: {
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                timestamp: new Date().toISOString()
            },
            pageUrl: window.location.pathname
        });
    };

    const stopExercise = () => {
        setIsPlaying(false);
        setActiveExercise(null);
        setBreathCount(0);
        setTimerSeconds(0);
        toast.success('Great job! You completed a mindfulness session! 🌟');
    };

    const getCurrentPhase = () => {
        if (!activeExercise) return null;
        
        const cycleTime = timerSeconds % activeExercise.duration;
        let elapsed = 0;
        
        for (const phase of activeExercise.phases) {
            if (cycleTime < elapsed + phase.duration) {
                return { ...phase, progress: ((cycleTime - elapsed) / phase.duration) * 100 };
            }
            elapsed += phase.duration;
        }
        
        return activeExercise.phases[0];
    };

    const currentPhase = getCurrentPhase();
    const completedCycles = Math.floor(timerSeconds / activeExercise?.duration || 1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
            {/* Animated Zen Background */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Floating particles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-300 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 0.6, 0],
                            scale: [0, 1.5, 0]
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                    />
                ))}

                {/* Gentle waves */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-200/30 to-transparent"
                    animate={{
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <motion.button
                        onClick={() => navigate('/student/dashboard')}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className="mb-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-800">Back to Dashboard</span>
                    </motion.button>

                    <div className="text-center">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="text-8xl mb-4"
                        >
                            🧘
                        </motion.div>
                        <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Mindfulness Break
                        </h1>
                        <p className="text-xl text-gray-600 font-medium">
                            Take a moment to breathe and relax 🌸
                        </p>
                    </div>
                </motion.div>

                {/* Exercise Selection or Active Session */}
                <AnimatePresence mode="wait">
                    {!activeExercise ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Quick Tips */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {quickTips.map((tip, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`bg-gradient-to-br ${tip.color} rounded-2xl p-4 text-white text-center shadow-lg`}
                                    >
                                        <div className="text-4xl mb-2">{tip.icon}</div>
                                        <div className="text-sm font-bold">{tip.tip}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Exercise Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {exercises.map((exercise, index) => (
                                    <motion.div
                                        key={exercise.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.15, type: "spring" }}
                                        whileHover={{ scale: 1.05, y: -10 }}
                                        onClick={() => startExercise(exercise)}
                                        className="cursor-pointer group"
                                    >
                                        <div className={`relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-3xl`}>
                                            {/* Gradient Header */}
                                            <div className={`bg-gradient-to-r ${exercise.color} p-8 relative overflow-hidden`}>
                                                <motion.div
                                                    className="absolute inset-0 bg-white/20"
                                                    animate={{
                                                        backgroundPosition: ['0% 0%', '100% 100%']
                                                    }}
                                                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                                                />
                                                <div className="relative text-center">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="text-7xl mb-3"
                                                    >
                                                        {exercise.icon}
                                                    </motion.div>
                                                    <h3 className="text-2xl font-black text-white drop-shadow-lg">
                                                        {exercise.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <p className="text-gray-700 mb-4 leading-relaxed">
                                                    {exercise.description}
                                                </p>
                                                
                                                <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <span>⏱️</span>
                                                        <span className="font-semibold">
                                                            {exercise.id === 'meditation' ? '5 min' : `${exercise.duration}s per cycle`}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span>🎯</span>
                                                        <span className="font-semibold">{exercise.phases.length} phases</span>
                                                    </div>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`w-full bg-gradient-to-r ${exercise.color} text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2`}
                                                >
                                                    <Play className="w-5 h-5" />
                                                    Begin Exercise
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        /* Active Exercise Session */
                        <motion.div
                            key="exercise"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="max-w-3xl mx-auto"
                        >
                            {/* Controls Bar */}
                            <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                </button>

                                <div className="text-center">
                                    <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-gray-600 font-semibold">
                                        {completedCycles} cycles completed
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                        className="p-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-full shadow-lg"
                                    >
                                        {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={stopExercise}
                                        className="p-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-full shadow-lg"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Breathing Circle */}
                            <div className={`relative bg-gradient-to-br ${activeExercise.color}/10 rounded-3xl p-12 shadow-2xl mb-6`}>
                                <div className="flex flex-col items-center justify-center">
                                    {/* Animated Circle */}
                                    <div className="relative w-80 h-80 mb-8">
                                        {/* Outer rings */}
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`absolute inset-0 rounded-full border-4 ${
                                                    i === 0 ? 'border-purple-300/30' :
                                                    i === 1 ? 'border-pink-300/20' :
                                                    'border-blue-300/10'
                                                }`}
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [0.5, 0.2, 0.5]
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    delay: i * 0.5
                                                }}
                                            />
                                        ))}

                                        {/* Main Breathing Circle */}
                                        <motion.div
                                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${activeExercise.color} shadow-2xl flex items-center justify-center`}
                                            animate={isPlaying ? {
                                                scale: currentPhase?.name.includes('In') ? [0.7, 1] :
                                                       currentPhase?.name.includes('Out') ? [1, 0.7] :
                                                       [0.85, 0.85],
                                            } : { scale: 0.85 }}
                                            transition={{
                                                duration: currentPhase?.duration || 4,
                                                ease: "easeInOut",
                                                repeat: isPlaying ? Infinity : 0
                                            }}
                                        >
                                            <div className="text-center text-white">
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-6xl mb-4"
                                                >
                                                    {activeExercise.icon}
                                                </motion.div>
                                                <div className="text-3xl font-black drop-shadow-lg">
                                                    {currentPhase?.name || 'Ready'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Instruction Text */}
                                    <motion.div
                                        key={currentPhase?.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center"
                                    >
                                        <p className="text-2xl font-bold text-gray-800 mb-2">
                                            {currentPhase?.instruction || 'Get ready...'}
                                        </p>
                                        <p className="text-gray-600">
                                            Follow the circle's rhythm
                                        </p>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Session Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                                    <div className="text-4xl mb-2">🌬️</div>
                                    <div className="text-2xl font-black text-purple-600">{completedCycles}</div>
                                    <div className="text-xs text-gray-600 font-semibold">Breaths</div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                                    <div className="text-4xl mb-2">⏱️</div>
                                    <div className="text-2xl font-black text-pink-600">{Math.floor(timerSeconds / 60)}m</div>
                                    <div className="text-xs text-gray-600 font-semibold">Time</div>
                                </div>
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
                                    <div className="text-4xl mb-2">💖</div>
                                    <div className="text-2xl font-black text-red-500">Calm</div>
                                    <div className="text-xs text-gray-600 font-semibold">Feeling</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Benefits Section - Only show when not in session */}
                {!activeExercise && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
                    >
                        <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Benefits of Mindfulness 🌟
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Reduce Stress', icon: '😌', desc: 'Feel more calm and relaxed', color: 'from-blue-400 to-cyan-400' },
                                { title: 'Better Focus', icon: '🎯', desc: 'Improve concentration', color: 'from-purple-400 to-pink-400' },
                                { title: 'Sleep Better', icon: '😴', desc: 'Fall asleep easier', color: 'from-indigo-400 to-purple-400' },
                                { title: 'Boost Mood', icon: '😊', desc: 'Feel happier overall', color: 'from-green-400 to-emerald-400' },
                                { title: 'Energy Up', icon: '⚡', desc: 'Feel more energized', color: 'from-yellow-400 to-orange-400' },
                                { title: 'Think Clear', icon: '💭', desc: 'Make better decisions', color: 'from-pink-400 to-rose-400' }
                            ].map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className={`bg-gradient-to-br ${benefit.color} rounded-2xl p-6 text-white shadow-lg text-center`}
                                >
                                    <div className="text-5xl mb-3">{benefit.icon}</div>
                                    <h3 className="font-black text-lg mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-white/90">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Motivational Footer */}
                {!activeExercise && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-10 text-center"
                    >
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg">
                            <Sparkles className="w-6 h-6" />
                            <span>Just a few minutes can make a big difference! 🌈</span>
                            <Heart className="w-6 h-6" />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}


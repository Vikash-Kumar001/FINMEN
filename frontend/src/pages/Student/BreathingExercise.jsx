import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const breathingPhases = [
    { label: "Inhale", duration: 4000 },
    { label: "Hold", duration: 3000 },
    { label: "Exhale", duration: 4000 },
];

export default function BreathingExercise() {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [cycleCount, setCycleCount] = useState(1);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (!running) return;

        const { duration } = breathingPhases[phaseIndex];
        const timer = setTimeout(() => {
            setPhaseIndex((prev) => (prev + 1) % breathingPhases.length);
            if (phaseIndex === breathingPhases.length - 1) {
                setCycleCount((prev) => prev + 1);
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [phaseIndex, running]);

    const currentPhase = breathingPhases[phaseIndex];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">🧘 Breathing Exercise</h2>
            <p className="text-gray-500 mb-6">Relax, follow the animation, and breathe with the rhythm.</p>

            <div className="relative w-60 h-60 flex items-center justify-center">
                <AnimatePresence>
                    <motion.div
                        key={phaseIndex}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: currentPhase.duration / 1000 }}
                        className={`w-full h-full rounded-full shadow-lg flex items-center justify-center ${currentPhase.label === "Inhale"
                                ? "bg-blue-300"
                                : currentPhase.label === "Hold"
                                    ? "bg-purple-300"
                                    : "bg-green-300"
                            }`}
                    >
                        <span className="text-2xl text-white font-semibold">{currentPhase.label}</span>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 text-sm text-gray-600">Cycle: {cycleCount}</div>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => setRunning(true)}
                    disabled={running}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Start
                </button>
                <button
                    onClick={() => {
                        setRunning(false);
                        setPhaseIndex(0);
                        setCycleCount(1);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

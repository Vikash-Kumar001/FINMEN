import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CrisisSimulation = () => {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    {
      id: 1,
      task: "Review notes.",
      emoji: "📝",
      priorities: [
        { id: 1, text: "High priority", studyScore: 20 },
        { id: 2, text: "Low", studyScore: 5 }
      ]
    },
    {
      id: 2,
      task: "Practice problems.",
      emoji: "🧮",
      priorities: [
        { id: 1, text: "High", studyScore: 25 },
        { id: 2, text: "Low", studyScore: 10 }
      ]
    },
    {
      id: 3,
      task: "Sleep early.",
      emoji: "🛏️",
      priorities: [
        { id: 1, text: "High", sleep: 8 },
        { id: 2, text: "Low", sleep: 4 }
      ]
    },
    {
      id: 4,
      task: "Eat healthy.",
      emoji: "🍎",
      priorities: [
        { id: 1, text: "High", studyScore: 10 },
        { id: 2, text: "Low", studyScore: 0 }
      ]
    },
    {
      id: 5,
      task: "Relax break.",
      emoji: "😌",
      priorities: [
        { id: 1, text: "High", studyScore: 15 },
        { id: 2, text: "Low", studyScore: 5 }
      ]
    }
  ];

  const handlePrioritySelect = (priorityId) => {
    setSelectedPriority(priorityId);
  };

  const handleConfirm = () => {
    if (!selectedPriority) return;

    const task = tasks[currentTask];
    const priority = task.priorities.find(p => p.id === selectedPriority);
    
    // Simulate scoring
    const newResponses = [...responses, priority];
    
    setResponses(newResponses);
    
    showCorrectAnswerFeedback(1, false);
    
    setSelectedPriority(null);
    
    if (currentTask < tasks.length - 1) {
      setTimeout(() => {
        setCurrentTask(prev => prev + 1);
      }, 1500);
    } else {
      const study = responses.reduce((sum, r) => sum + (r.studyScore || 0), 0);
      const sleep = responses.reduce((sum, r) => sum + (r.sleep || 0), 0);
      if (study >= 70 && sleep >= 6) {
        setCoins(5);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const study = responses.reduce((sum, r) => sum + (r.studyScore || 0), 0);
  const sleep = responses.reduce((sum, r) => sum + (r.sleep || 0), 0);

  return (
    <GameShell
      title="Crisis Simulation"
      subtitle={`Task ${currentTask + 1} of ${tasks.length}`}
      onNext={handleNext}
      nextEnabled={showResult && study >= 70 && sleep >= 6}
      showGameOver={showResult && study >= 70 && sleep >= 6}
      score={coins}
      gameId="life-194"
      gameType="life"
      totalLevels={10}
      currentLevel={4}
      showConfetti={showResult && study >= 70 && sleep >= 6}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{tasks[currentTask].emoji}</div>
              
              <p className="text-white text-xl mb-6">Task: {tasks[currentTask].task}</p>
              
              <p className="text-white/90 mb-4 text-center">Prioritize:</p>
              
              <div className="space-y-3 mb-6">
                {tasks[currentTask].priorities.map(priority => (
                  <button
                    key={priority.id}
                    onClick={() => handlePrioritySelect(priority.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedPriority === priority.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{priority.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedPriority}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedPriority
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Prioritize
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Simulation Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Study Score: {study}, Sleep: {sleep} hrs
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {study >= 70 && sleep >= 6 ? "Earned 5 Coins!" : "Balance better."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Group variant: teams present plans.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CrisisSimulation;
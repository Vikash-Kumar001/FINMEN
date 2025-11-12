import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const VolunteerSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentTask, setCurrentTask] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const tasks = [
    {
      id: 1,
      task: "Setup venue.",
      emoji: "🪑",
      volunteers: [
        { id: 1, text: "Assign to strong helpers", smooth: true },
        { id: 2, text: "Random assign", smooth: false },
        { id: 3, text: "Match skills", smooth: true },
        { id: 4, text: "No assignment", smooth: false }
      ]
    },
    {
      id: 2,
      task: "Promote event.",
      emoji: "📢",
      volunteers: [
        { id: 1, text: "Creative team", smooth: true },
        { id: 2, text: "Anyone", smooth: false },
        { id: 3, text: "Social media experts", smooth: true },
        { id: 4, text: "Skip promotion", smooth: false }
      ]
    },
    {
      id: 3,
      task: "Handle registration.",
      emoji: "📝",
      volunteers: [
        { id: 1, text: "Organized people", smooth: true },
        { id: 2, text: "Novices", smooth: false },
        { id: 3, text: "Train volunteers", smooth: true },
        { id: 4, text: "No registration", smooth: false }
      ]
    },
    {
      id: 3,
      task: "Manage food.",
      emoji: "🍲",
      volunteers: [
        { id: 1, text: "Experienced cooks", smooth: true },
        { id: 2, text: "Random", smooth: false },
        { id: 3, text: "Hygiene trained", smooth: true },
        { id: 4, text: "No food", smooth: false }
      ]
    },
    {
      id: 5,
      task: "Cleanup.",
      emoji: "🧹",
      volunteers: [
        { id: 1, text: "Efficient team", smooth: true },
        { id: 2, text: "Leave mess", smooth: false },
        { id: 3, text: "Rotate duty", smooth: true },
        { id: 4, text: "One person", smooth: false }
      ]
    }
  ];

  const handleVolunteerSelect = (volunteerId) => {
    setSelectedVolunteer(volunteerId);
  };

  const handleConfirm = () => {
    if (!selectedVolunteer) return;

    const task = tasks[currentTask];
    const volunteer = task.volunteers.find(v => v.id === selectedVolunteer);
    
    const isSmooth = volunteer.smooth;
    
    const newResponses = [...responses, {
      taskId: task.id,
      volunteerId: selectedVolunteer,
      isSmooth,
      volunteer: volunteer.text
    }];
    
    setResponses(newResponses);
    
    if (isSmooth) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedVolunteer(null);
    
    if (currentTask < tasks.length - 1) {
      setTimeout(() => {
        setCurrentTask(prev => prev + 1);
      }, 1500);
    } else {
      const smoothCount = newResponses.filter(r => r.isSmooth).length;
      if (smoothCount >= 4) {
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

  const smoothCount = responses.filter(r => r.isSmooth).length;

  return (
    <GameShell
      title="Volunteer Simulation"
      subtitle={`Task ${currentTask + 1} of ${tasks.length}`}
      onNext={handleNext}
      nextEnabled={showResult && smoothCount >= 4}
      showGameOver={showResult && smoothCount >= 4}
      score={coins}
      gameId="civic-183"
      gameType="civic"
      totalLevels={10}
      currentLevel={3}
      showConfetti={showResult && smoothCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{tasks[currentTask].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Task: {tasks[currentTask].task}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Assign volunteer:</p>
              
              <div className="space-y-3 mb-6">
                {tasks[currentTask].volunteers.map(volunteer => (
                  <button
                    key={volunteer.id}
                    onClick={() => handleVolunteerSelect(volunteer.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedVolunteer === volunteer.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{volunteer.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedVolunteer}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedVolunteer
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Assign
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {smoothCount >= 4 ? "🎉 Event Manager!" : "💪 More Smooth!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Smooth operations: {smoothCount} out of {tasks.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {smoothCount >= 4 ? "Earned 5 Coins!" : "Need 4+ smooth."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use for organizing real events.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default VolunteerSimulation;
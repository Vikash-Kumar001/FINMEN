import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenRoutineSimulation = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(0);
  const [routineChoices, setRoutineChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const days = [
    { id: 1, name: "Monday", icon: "📅" },
    { id: 2, name: "Tuesday", icon: "📆" },
    { id: 3, name: "Wednesday", icon: "🗓️" },
    { id: 4, name: "Thursday", icon: "📅" },
    { id: 5, name: "Friday", icon: "📆" }
  ];

  const routineOptions = [
    {
      id: "balanced",
      text: "Shower + Exercise + Study",
      emoji: "🏃",
      description: "Complete routine with hygiene, physical activity, and learning",
      isHealthy: true
    },
    {
      id: "partial",
      text: "Shower + Study only",
      emoji: "📚",
      description: "Good hygiene and studying, but missing physical activity",
      isHealthy: false
    },
    {
      id: "minimal",
      text: "Quick shower only",
      emoji: "🧼",
      description: "Basic hygiene but missing exercise and focused study time",
      isHealthy: false
    }
  ];

  const handleRoutineChoice = (routineId) => {
    const selectedRoutine = routineOptions.find(routine => routine.id === routineId);
    const isHealthy = selectedRoutine.isHealthy;

    setRoutineChoices({ ...routineChoices, [currentDay]: routineId });
    setLastChoice(selectedRoutine);

    if (isHealthy) {
      showCorrectAnswerFeedback(1, true);
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);

      if (currentDay < days.length - 1) {
        setCurrentDay(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const getCurrentDay = () => days[currentDay];
  const healthyDays = Object.values(routineChoices).filter(routineId =>
    routineOptions.find(routine => routine.id === routineId)?.isHealthy
  ).length;

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-healthy-teen");
  };

  return (
    <GameShell
      title="Simulation: Teen Routine (Teen)"
      subtitle={`Day ${currentDay + 1} of ${days.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={healthyDays * 5}
      gameId="health-male-teen-28"
      gameType="health-male"
      totalLevels={100}
      currentLevel={28}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Level 28/100</span>
            <span className="text-yellow-400 font-bold">Coins: {healthyDays * 5}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{getCurrentDay().icon}</div>
            <h3 className="text-white text-2xl font-bold mb-2">
              {getCurrentDay().name} Morning Routine
            </h3>
            <p className="text-white/80">
              You're building healthy habits as a teen. Choose your daily routine wisely!
            </p>
          </div>

          {showFeedback && lastChoice && (
            <div className={`text-center mb-6 p-4 rounded-xl ${
              lastChoice.isHealthy
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <div className="text-2xl mb-2">
                {lastChoice.isHealthy ? '✅' : '❌'}
              </div>
              <p className={`font-bold ${
                lastChoice.isHealthy ? 'text-green-400' : 'text-red-400'
              }`}>
                {lastChoice.isHealthy ? 'Great Choice!' : 'Not the Best Option'}
              </p>
              <p className="text-white/90 text-sm mt-1">
                {lastChoice.description}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {routineOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleRoutineChoice(option.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {Object.keys(routineChoices).length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-bold mb-3">Your Weekly Routine:</h4>
              <div className="grid grid-cols-1 gap-2">
                {days.map(day => {
                  const routineId = routineChoices[day.id - 1];
                  const routine = routineId ? routineOptions.find(r => r.id === routineId) : null;

                  return (
                    <div key={day.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{day.icon}</span>
                        <span className="text-white font-medium">{day.name}:</span>
                      </div>
                      {routine ? (
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{routine.emoji}</span>
                          <span className="text-white/90">{routine.text}</span>
                        </div>
                      ) : (
                        <span className="text-white/50">Not planned</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default TeenRoutineSimulation;

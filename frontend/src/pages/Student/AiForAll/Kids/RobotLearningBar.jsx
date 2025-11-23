import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotLearningBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Tasks for progression game
  const tasks = [
    { id: 1, description: "Robot correctly identifies a cat", correct: true },
    { id: 2, description: "Robot correctly identifies a dog", correct: true },
    { id: 3, description: "Robot correctly identifies a bird", correct: true },
    { id: 4, description: "Robot guesses incorrectly", correct: false },
    { id: 5, description: "Robot skips a training step", correct: false }
  ];

  const currentTaskData = tasks[currentTask];
  const knowledgeBar = Math.min(Math.round((score / tasks.length) * 100), 100);

  const handleChoice = (choice) => {
    const isCorrect = choice === currentTaskData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 5); // +5 reward per correct
      showCorrectAnswerFeedback(5, false);
    }

    if (currentTask < tasks.length - 1) {
      setTimeout(() => setCurrentTask(prev => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentTask(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-mistake-quiz"); // Update to your next game path
  };

  const accuracy = Math.round((score / tasks.length) * 100);

  return (
    <GameShell
      title="Robot Learning Bar"
      score={coins}
      subtitle={`Training Task ${currentTask + 1} of ${tasks.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-68"
      gameType="ai"
      totalLevels={100}
      currentLevel={68}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Train the AI Robot!
            </h3>

            {/* Knowledge Bar */}
            <div className="bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-xl p-6 mb-6">
              <div className="text-white font-bold text-center mb-2">Knowledge Bar</div>
              <div className="w-full bg-white/20 rounded-full h-6">
                <div
                  className="bg-green-500 h-6 rounded-full transition-all"
                  style={{ width: `${knowledgeBar}%` }}
                ></div>
              </div>
              <p className="text-white/90 text-center mt-2">{knowledgeBar}% Learned</p>
            </div>

            {/* Task Description */}
            <div className="bg-white/10 rounded-lg p-6 mb-6 text-center text-white font-semibold text-lg">
              {currentTaskData.description}
            </div>

            {/* Choice Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
              >
                ✅ Correct
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
              >
                ❌ Wrong
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Robot Learned Well!" : "💪 Keep Training!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You completed {score} out of {tasks.length} tasks correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Each correct answer fills the Knowledge Bar, visualizing the robot's growth.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotLearningBar;

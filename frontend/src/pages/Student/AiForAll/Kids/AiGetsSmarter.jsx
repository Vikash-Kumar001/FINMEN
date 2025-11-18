import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AiGetsSmarter = () => {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const tasks = [
    { id: 1, task: "Train AI with clear images", correct: true },
    { id: 2, task: "Train AI with blurred images", correct: true },
    { id: 3, task: "Train AI with mixed quality images", correct: true },
    { id: 4, task: "Skip training session", correct: false },
    { id: 5, task: "Train AI with wrong labels", correct: false }
  ];

  const currentTaskData = tasks[currentTask];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentTaskData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 5);
      showCorrectAnswerFeedback(5, false);
    }

    if (currentTask < tasks.length - 1) {
      setTimeout(() => {
        setCurrentTask(prev => prev + 1);
      }, 300);
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
    navigate("/student/ai-for-all/kids/wrong-prediction-quiz");
  };

  const accuracy = Math.round((score / tasks.length) * 100);

  // Progress bar percentage
  const brainBar = Math.min(Math.round((score / tasks.length) * 100), 100);

  return (
    <GameShell
      title="AI Gets Smarter"
      subtitle={`Training Task ${currentTask + 1} of ${tasks.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={coins}
      gameId="ai-kids-57"
      gameType="ai"
      totalLevels={100}
      currentLevel={57}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Train the AI Robot
            </h3>

            <div className="bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-xl p-6 mb-6">
              <div className="text-white font-bold text-center mb-2">Robot Brain Progress</div>
              <div className="w-full bg-white/20 rounded-full h-6">
                <div
                  className="bg-green-500 h-6 rounded-full transition-all"
                  style={{ width: `${brainBar}%` }}
                ></div>
              </div>
              <p className="text-white/90 text-center mt-2">{brainBar}% Smarter</p>
            </div>

            <div className="bg-white/10 rounded-lg p-6 mb-6 text-center text-white font-semibold text-lg">
              {currentTaskData.task}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/30 hover:bg-green-500/50 border-3 border-green-400 rounded-xl p-6 transition-all transform hover:scale-105"
              >
                ✅ Correct Training
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-3 border-red-400 rounded-xl p-6 transition-all transform hover:scale-105"
              >
                ❌ Wrong Training
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 AI Training Complete!" : "💪 Keep Training!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You completed {score} out of {tasks.length} training tasks correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Each correct training improved the AI robot's brain. This shows how repeated training improves model performance!
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

export default AiGetsSmarter;

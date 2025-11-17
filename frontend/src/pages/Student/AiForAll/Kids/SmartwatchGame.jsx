import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartwatchGame = () => {
  const navigate = useNavigate();
  const [currentAlert, setCurrentAlert] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const alerts = [
    {
      id: 1,
      message: "Your heart rate is high after running. What should you do?",
      options: ["Slow down and rest 😌", "Keep running faster 🏃‍♂️", "Ignore it 🙈", "Eat sweets 🍬"],
      correct: "Slow down and rest 😌",
    },
    {
      id: 2,
      message: "The watch says 'You’ve been sitting too long.' What’s the best action?",
      options: ["Get up and stretch 🙆‍♀️", "Keep sitting 🪑", "Take a nap 😴", "Turn off the alert 🔕"],
      correct: "Get up and stretch 🙆‍♀️",
    },
    {
      id: 3,
      message: "It says ‘Low battery!’. What should you do?",
      options: ["Charge it 🔋", "Ignore it 🚫", "Shake it 🤨", "Restart phone 📱"],
      correct: "Charge it 🔋",
    },
    {
      id: 4,
      message: "You got a sleep alert: ‘You slept only 4 hours.’ What’s the right response?",
      options: ["Sleep earlier tonight 🌙", "Drink coffee ☕", "Stay awake all night 😵", "Skip breakfast 🍞"],
      correct: "Sleep earlier tonight 🌙",
    },
    {
      id: 5,
      message: "Your smartwatch says ‘Take deep breaths to relax.’ What should you do?",
      options: ["Take deep breaths 🌬️", "Ignore and scroll phone 📱", "Run quickly 🏃", "Complain to AI 🤖"],
      correct: "Take deep breaths 🌬️",
    },
  ];

  const currentAlertData = alerts[currentAlert];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentAlertData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    if (currentAlert < alerts.length - 1) {
      setTimeout(() => {
        setCurrentAlert((prev) => prev + 1);
      }, 500);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      if (finalScore >= 4) {
        setCoins(5);
      }
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentAlert(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/online-shopping-ai");
  };

  return (
    <GameShell
      title="Smartwatch Game"
      subtitle={`Alert ${currentAlert + 1} of ${alerts.length}`}
      onNext={handleNext}
      nextEnabled={showResult && score >= 4}
      showGameOver={showResult && score >= 4}
      score={coins}
      gameId="ai-kids-39"
      gameType="ai"
      totalLevels={100}
      currentLevel={39}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">⌚</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              Help your AI Smartwatch make the right decisions!
            </h3>

            <div className="bg-gray-800/50 rounded-xl p-8 mb-6">
              <p className="text-2xl text-white text-center">
                {currentAlertData.message}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAlertData.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(opt)}
                  className="bg-white/20 hover:bg-green-500/40 border border-white/40 rounded-xl p-4 text-white font-semibold text-lg transition-all hover:scale-105"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {score >= 4 ? "🎉 Healthy Response!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {alerts.length} correctly!
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm text-center">
                💡 Smartwatches with AI help track health, suggest rest, and keep you active and balanced!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              {score >= 4 ? "You earned 5 Coins! 🪙" : "Get 4 or more correct to earn coins!"}
            </p>
            {score < 4 && (
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

export default SmartwatchGame;

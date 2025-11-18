import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CorrectRobotReflex = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // ⚡ 5 Reflex Questions
  const reflexSteps = [
    {
      id: 1,
      emoji: "🍎",
      message: "🤖 Robot says: ‘This is a banana!’ (But it’s an apple)",
      correctAction: "Correct the robot",
      wrongAction: "Ignore the mistake",
    },
    {
      id: 2,
      emoji: "🐱",
      message: "🤖 Robot says: ‘This is a dog!’ (But it’s a cat)",
      correctAction: "Correct the robot",
      wrongAction: "Let it stay wrong",
    },
    {
      id: 3,
      emoji: "🔵",
      message: "🤖 Robot says: ‘This is a triangle!’ (But it’s a circle)",
      correctAction: "Fix the robot’s answer",
      wrongAction: "Do nothing",
    },
    {
      id: 4,
      emoji: "😊",
      message: "🤖 Robot says: ‘This person is sad!’ (But they’re smiling)",
      correctAction: "Help robot learn emotions",
      wrongAction: "Ignore emotions",
    },
    {
      id: 5,
      emoji: "☀️",
      message: "🤖 Robot says: ‘It’s nighttime!’ (But the sun is shining)",
      correctAction: "Teach the robot the truth",
      wrongAction: "Agree with the robot",
    },
  ];

  const currentStep = reflexSteps[step];

  const handleChoice = (correct) => {
    if (correct) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (step < reflexSteps.length - 1) {
      setStep(step + 1);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/bias-in-data-story"); // ✅ next game path
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Correct the Robot Reflex"
      subtitle="Fix the Robot’s Mistakes!"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && step === reflexSteps.length - 1}
      score={coins}
      gameId="ai-kids-66"
      gameType="ai"
      totalLevels={100}
      currentLevel={66}
      showConfetti={showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4 animate-pulse">{currentStep.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentStep.message}
            </h2>
            <p className="text-white/90 mb-6">
              Choose the best action to help the robot learn.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="bg-green-500/40 hover:bg-green-500/60 border-2 border-green-400 rounded-xl p-6 text-white font-bold text-lg transition-all transform hover:scale-105"
              >
                {currentStep.correctAction}
              </button>

              <button
                onClick={() => handleChoice(false)}
                className="bg-red-500/30 hover:bg-red-500/50 border-2 border-red-400 rounded-xl p-6 text-white font-bold text-lg transition-all transform hover:scale-105"
              >
                {currentStep.wrongAction}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{currentStep.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              ✅ Robot Retrained!
            </h2>
            <p className="text-white/90 mb-4">
              Great reflex! AI learns fast when you correct its mistakes.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              +5 Coins 🪙
            </p>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:opacity-90 transition"
            >
              {step === reflexSteps.length - 1 ? "Finish Game" : "Next Reflex →"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CorrectRobotReflex;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotMistakeStory = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const storySteps = [
    {
      id: 1,
      message: "🤖 Robot says: 'This is an apple!' (But it shows a banana)",
      emoji: "🍌",
      options: [
        { text: "Correct the robot", value: "correct" },
        { text: "Ignore the mistake", value: "ignore" },
      ],
      correct: "correct",
    },
    {
      id: 2,
      message: "🤖 Robot says: 'Dog says meow!'",
      emoji: "🐶",
      options: [
        { text: "Teach it correctly", value: "correct" },
        { text: "Say nothing", value: "ignore" },
      ],
      correct: "correct",
    },
    {
      id: 3,
      message: "🤖 Robot says: '2 + 2 = 5'",
      emoji: "🔢",
      options: [
        { text: "Correct it to 4", value: "correct" },
        { text: "Let it be wrong", value: "ignore" },
      ],
      correct: "correct",
    },
    {
      id: 4,
      message: "🤖 Robot calls the Sun 'the Moon'.",
      emoji: "🌞",
      options: [
        { text: "Fix the label", value: "correct" },
        { text: "Leave it", value: "ignore" },
      ],
      correct: "correct",
    },
    {
      id: 5,
      message: "🤖 Robot says: 'All cats are the same color!'",
      emoji: "🐱",
      options: [
        { text: "Explain that cats have many colors", value: "correct" },
        { text: "Agree blindly", value: "ignore" },
      ],
      correct: "correct",
    },
  ];

  const currentStepData = storySteps[step];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentStepData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 10);
      showCorrectAnswerFeedback(10, true);
    }

    if (step < storySteps.length - 1) {
      setTimeout(() => {
        setStep((prev) => prev + 1);
        resetFeedback();
      }, 600);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setStep(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/data-cleaning-puzzle"); // next game path
  };

  return (
    <GameShell
      title="Robot Mistake Story"
      subtitle="Can you help the robot learn correctly?"
      onNext={handleNext}
      nextEnabled={showResult && score === storySteps.length}
      showGameOver={showResult && score === storySteps.length}
      score={coins}
      gameId="ai-kids-52"
      gameType="ai"
      totalLevels={100}
      currentLevel={52}
      showConfetti={showResult && score === storySteps.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">{currentStepData.emoji}</div>
            <h3 className="text-white text-xl font-bold mb-6">
              {currentStepData.message}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {currentStepData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(option.value)}
                  className="bg-blue-500/30 hover:bg-blue-500/50 border-3 border-blue-400 rounded-xl p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-white font-bold text-xl">
                    {option.text}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-white/70 mt-6">
              Step {step + 1} of {storySteps.length}
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {score === storySteps.length
                ? "✅ You fixed all the robot’s mistakes!"
                : "⚠️ Try again to teach the robot better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              AI learns from humans — thanks for teaching truth and accuracy.
            </p>
            {score === storySteps.length ? (
              <p className="text-yellow-400 text-2xl font-bold">
                You earned {coins} Coins! 🪙
              </p>
            ) : (
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

export default RobotMistakeStory;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OverfittingStory = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const storySteps = [
    {
      title: "Red vs Green Apple 🍎🍏",
      emoji: "🤖",
      situation: "The robot was trained only on red apples. Now it sees a green apple and says 'Not an apple'. What should you do?",
      choices: [
        { id: 1, text: "Explain the robot its mistake", emoji: "🧠", isCorrect: true },
        { id: 2, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Tell the robot it's right", emoji: "👍", isCorrect: false },
      ],
    },
    {
      title: "Dog vs Cat Confusion 🐶🐱",
      emoji: "🤖",
      situation: "The AI saw only pictures of dogs and now thinks every animal is a dog. What should you do?",
      choices: [
        { id: 1, text: "Show it pictures of cats too", emoji: "📸", isCorrect: true },
        { id: 2, text: "Say 'good job' to AI", emoji: "👏", isCorrect: false },
        { id: 3, text: "Ignore the error", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      title: "School Data Problem 🏫",
      emoji: "🤖",
      situation: "AI only trained on one school's students. It struggles to predict grades for another school. What do you do?",
      choices: [
        { id: 1, text: "Add data from more schools", emoji: "📚", isCorrect: true },
        { id: 2, text: "Keep using the same data", emoji: "🔁", isCorrect: false },
        { id: 3, text: "Stop training AI", emoji: "✋", isCorrect: false },
      ],
    },
    {
      title: "Weather Prediction 🌦️",
      emoji: "🤖",
      situation: "AI was trained only in sunny weather, so it fails when it rains. What’s the fix?",
      choices: [
        { id: 1, text: "Add rainy and cloudy weather data", emoji: "🌧️", isCorrect: true },
        { id: 2, text: "Delete sunny data", emoji: "☀️", isCorrect: false },
        { id: 3, text: "Do nothing", emoji: "🙅‍♂️", isCorrect: false },
      ],
    },
    {
      title: "Voice Recognition 🎤",
      emoji: "🤖",
      situation: "AI only learned adult voices. It fails to recognize children. What should you do?",
      choices: [
        { id: 1, text: "Train it with diverse voices", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Ignore the issue", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Turn off voice input", emoji: "🔇", isCorrect: false },
      ],
    },
  ];

  const currentStep = storySteps[step];
  const selectedChoiceData = currentStep.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    const choice = currentStep.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setScore((prev) => prev + 1);
      setCoins((prev) => prev + 10);
    }

    setShowFeedback(true);
  };

  const handleNextStep = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    if (step < storySteps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      // Game complete
      setStep(storySteps.length);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/data-labeling-game");
  };

  const isGameComplete = step === storySteps.length - 1 && showFeedback;

  return (
    <GameShell
      title="Overfitting Story"
      subtitle="Understanding AI Mistakes"
      onNext={handleNext}
      nextEnabled={isGameComplete && score === storySteps.length}
      showGameOver={isGameComplete && score === storySteps.length}
      score={coins}
      gameId="ai-kids-55"
      gameType="ai"
      totalLevels={100}
      currentLevel={55}
      showConfetti={isGameComplete && score === storySteps.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStep.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStep.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentStep.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStep.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">
                      {choice.text}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <p className="text-white/70 mb-3">
                Step {step + 1} of {storySteps.length}
              </p>
              <button
                onClick={handleConfirm}
                disabled={!selectedChoice}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedChoice
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Confirm Choice
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect
                ? "🌟 Great Job!"
                : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {selectedChoiceData.isCorrect
                ? "You corrected the AI and helped it learn from new data."
                : "Overfitting happens when AI sees too little variety in training."}
            </p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold mb-6">
                +10 Coins 🪙
              </p>
            ) : null}

            <div className="flex justify-center">
              {selectedChoiceData.isCorrect || step === storySteps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {step === storySteps.length - 1 ? "See Results" : "Next"}
                </button>
              ) : (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OverfittingStory;

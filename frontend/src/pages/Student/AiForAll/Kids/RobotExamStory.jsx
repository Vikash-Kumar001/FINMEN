import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotExamStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🧩 All 5 story steps
  const storySteps = [
    {
      id: 1,
      title: "Robot Takes an Exam",
      emoji: "🤖",
      situation: "The robot studied only 2 questions and failed the test. What should it learn?",
      choices: [
        { id: 1, text: "Study more questions and gather enough data", emoji: "📚", isCorrect: true },
        { id: 2, text: "Keep studying just 2 questions", emoji: "📝", isCorrect: false },
        { id: 3, text: "Ignore studying and guess answers", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Robot Learns Animals",
      emoji: "🐶",
      situation: "The robot saw only 2 cats and thought every animal is a cat. What should it do?",
      choices: [
        { id: 1, text: "See pictures of many animals before deciding", emoji: "🦁", isCorrect: true },
        { id: 2, text: "Assume all are cats", emoji: "🐱", isCorrect: false },
        { id: 3, text: "Close its eyes and guess", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Robot Learns Sounds",
      emoji: "🎧",
      situation: "The robot hears a cat but says it's a dog. What should it do?",
      choices: [
        { id: 1, text: "Listen to more examples of animal sounds", emoji: "🐾", isCorrect: true },
        { id: 2, text: "Ignore the mistake", emoji: "🙉", isCorrect: false },
        { id: 3, text: "Keep saying wrong names", emoji: "😅", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Robot Learns Shapes",
      emoji: "🔺",
      situation: "The robot mixes up circles and triangles. How can it improve?",
      choices: [
        { id: 1, text: "Practice with many examples of shapes", emoji: "⚪", isCorrect: true },
        { id: 2, text: "Guess randomly", emoji: "🎲", isCorrect: false },
        { id: 3, text: "Avoid learning shapes", emoji: "🚫", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Robot Learns Emotions",
      emoji: "😊",
      situation: "The robot calls a smiling face 'sad'. What should it learn?",
      choices: [
        { id: 1, text: "Study more faces to learn expressions", emoji: "😀", isCorrect: true },
        { id: 2, text: "Keep saying opposite emotions", emoji: "😢", isCorrect: false },
        { id: 3, text: "Stop learning emotions", emoji: "😐", isCorrect: false }
      ]
    }
  ];

  const currentStep = storySteps[step];
  const selectedChoiceData = currentStep.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStep.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, true);
      setCoins(prev => prev + 10);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (step < storySteps.length - 1) {
      setStep(step + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/kids/correct-the-robot-reflex"); // ✅ Next Game
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Robot Exam Story"
      subtitle="Learn How AI Improves with Data"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && step === storySteps.length - 1}
      score={coins}
      gameId="ai-kids-65"
      gameType="ai"
      totalLevels={100}
      currentLevel={65}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{currentStep.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStep.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{currentStep.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should the robot do?</h3>

            <div className="space-y-3 mb-6">
              {currentStep.choices.map(choice => (
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
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✅ Smart Move!" : "⚠️ Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Great! The robot learns better with more examples and data. You're teaching it the right way!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-4">
                  +10 Coins 🪙
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {step === storySteps.length - 1 ? "Finish Game" : "Next Question →"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    The robot must learn from enough examples before making decisions. Let’s try again!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotExamStory;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StudyAppStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedbackScreen, setShowFeedbackScreen] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Math Time 📘",
      situation: "You open your tablet for study time. You see the Math App and a Random Ads Game.",
      choices: [
        { id: 1, text: "Open Math App", emoji: "🧮", isCorrect: true },
        { id: 2, text: "Play Random Ads Game", emoji: "🎮", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Homework Helper ✏️",
      situation: "Your teacher gave math homework. You can use the Math App or watch game videos.",
      choices: [
        { id: 1, text: "Use Math App to solve questions", emoji: "📲", isCorrect: true },
        { id: 2, text: "Watch game ads instead", emoji: "📺", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Quiz Time 🧠",
      situation: "Dad asks you to practice math before dinner. You can open Math App or play games.",
      choices: [
        { id: 1, text: "Practice on Math App", emoji: "📘", isCorrect: true },
        { id: 2, text: "Play Random Ads Game", emoji: "🎰", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "School Project 📚",
      situation: "You need to make a chart with numbers. The Math App can help calculate fast!",
      choices: [
        { id: 1, text: "Use Math App to calculate", emoji: "🧮", isCorrect: true },
        { id: 2, text: "Skip work and play games", emoji: "🕹️", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Evening Routine 🌙",
      situation: "Before bedtime, you decide what to open one last time.",
      choices: [
        { id: 1, text: "Do 1 quiz on Math App", emoji: "📲", isCorrect: true },
        { id: 2, text: "Play Random Ads Game again", emoji: "🎮", isCorrect: false },
      ],
    },
  ];

  const currentStory = stories[currentQuestion];
  const selectedChoiceData = selectedChoice
    ? currentStory.choices.find((c) => c.id === selectedChoice)
    : null;

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }
    setShowFeedbackScreen(true); // Move to feedback screen
  };

  const handleNextQuestion = () => {
    if (currentQuestion < stories.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedbackScreen(false);
      resetFeedback();
    } else {
      // All done
      setShowFeedbackScreen(true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/reflex-learning-tools");
  };

  const allDone = currentQuestion === stories.length - 1 && showFeedbackScreen;

  return (
    <GameShell
      title="Study App Story"
      subtitle="Choosing Smart Learning Apps"
      onNext={handleNext}
      nextEnabled={allDone}
      showGameOver={allDone}
      score={coins}
      gameId="dcos-kids-91"
      gameType="story-choice"
      totalLevels={100}
      currentLevel={91}
      showConfetti={allDone}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* 🧩 Question Screen */}
        {!showFeedbackScreen && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">
              {currentStory.choices[0].emoji}
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {currentStory.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">
              What will you choose?
            </h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">
                      {choice.text}
                    </div>
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
        )}

        {/* 🧠 Feedback Screen (Separate) */}
        {showFeedbackScreen && !allDone && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-green-400 mb-4">
                  Great Job!
                </h2>
                <p className="text-white mb-6">
                  ✅ Using the Math App helps you learn and grow.
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="text-3xl font-bold text-red-400 mb-4">Oops!</h2>
                <p className="text-white mb-6">
                  ❌ The Random Ads Game distracts you from learning. Try again!
                </p>
              </>
            )}

            <button
              onClick={handleNextQuestion}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Question
            </button>
          </div>
        )}

        {/* 🎯 Final Screen */}
        {allDone && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Amazing Job! 🎉</h2>
            <p className="text-white text-lg mb-6">
              You chose the right app to study smartly and earn rewards!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              You earned {coins} Coins! 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StudyAppStory;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const MoneyFoundStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Money on the Road",
      emoji: "💵",
      situation: "You find some money on the school road. What do you do?",
      choices: [
        { id: 1, text: "Pick it and keep it secretly", emoji: "😏", isCorrect: false },
        { id: 2, text: "Give it to your teacher", emoji: "👩‍🏫", isCorrect: true },
        { id: 3, text: "Ignore it and walk away", emoji: "🚶", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Wallet in Playground",
      emoji: "👛",
      situation: "You see a wallet in the playground after everyone leaves.",
      choices: [
        { id: 1, text: "Take the money and throw wallet", emoji: "💰", isCorrect: false },
        { id: 2, text: "Give wallet to your class teacher", emoji: "🙋‍♀️", isCorrect: true },
        { id: 3, text: "Hide it under a bench", emoji: "🪑", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Friend Drops a Coin",
      emoji: "🪙",
      situation: "Your friend drops a coin while playing and doesn’t notice.",
      choices: [
        { id: 1, text: "Pick and return it immediately", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Keep it for yourself", emoji: "😈", isCorrect: false },
        { id: 3, text: "Ignore it", emoji: "😶", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Cash Left on Desk",
      emoji: "📚",
      situation: "You find cash on a classroom desk after school.",
      choices: [
        { id: 1, text: "Give it to the principal’s office", emoji: "🏫", isCorrect: true },
        { id: 2, text: "Keep it to buy snacks", emoji: "🍫", isCorrect: false },
        { id: 3, text: "Ask your friends who lost it", emoji: "🗣️", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Money in Canteen",
      emoji: "🍱",
      situation: "You find ₹100 near the canteen queue. No one is around.",
      choices: [
        { id: 1, text: "Hand it to the canteen manager", emoji: "👨‍🍳", isCorrect: true },
        { id: 2, text: "Use it to buy your lunch", emoji: "🍔", isCorrect: false },
        { id: 3, text: "Ask your friends to split it", emoji: "🤷‍♀️", isCorrect: false },
      ],
    },
  ];

  const currentStory = stories[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setShowFeedback(true);

    // Automatically move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < stories.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedChoice(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        const accuracy = ((score + (choice.isCorrect ? 1 : 0)) / stories.length) * 100;
        if (accuracy >= 70) {
          setCoins(5);
          showCorrectAnswerFeedback(5, true);
        }
        setShowFeedback(true);
      }
    }, 1200); // 1.2 seconds delay for transition
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/ethical-quiz");
  };

  const accuracy = Math.round((score / stories.length) * 100);

  return (
    <GameShell
      title="Money Found Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${stories.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && coins > 0}
      
      gameId="moral-teen-91"
      gameType="moral"
      totalLevels={100}
      currentLevel={91}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback || currentQuestion < stories.length - 1 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentStory.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map((choice) => (
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
            {coins > 0 ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">💰 Honest Hero!</h2>
                <p className="text-white/90 text-lg mb-4">
                  You made the right decisions in {score} out of {stories.length} stories!
                </p>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">Keep Trying 💪</h2>
                <p className="text-white/80 mb-4">
                  You scored {score}/{stories.length}. Aim for 70% or higher to earn coins!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default MoneyFoundStory;

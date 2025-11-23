import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const LostWalletStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Found Wallet",
      emoji: "👛",
      situation: "You find a wallet on the street. What should you do?",
      choices: [
        { id: 1, text: "Keep the money", emoji: "💰", isCorrect: false },
        { id: 2, text: "Return the wallet to the owner", emoji: "🙋‍♂️", isCorrect: true },
        { id: 3, text: "Give it to a friend", emoji: "👥", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Wallet with ID",
      emoji: "🆔",
      situation: "The wallet has an ID card. What is the best action?",
      choices: [
        { id: 1, text: "Ignore it and leave it", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Use the ID to return the wallet", emoji: "🙋‍♀️", isCorrect: true },
        { id: 3, text: "Take it to school", emoji: "🏫", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Wallet on Bench",
      emoji: "🪑",
      situation: "You see a wallet on a bench. You are in a hurry. What should you do?",
      choices: [
        { id: 1, text: "Keep it for yourself", emoji: "😎", isCorrect: false },
        { id: 2, text: "Pick it up and return it", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Leave it, someone else will take it", emoji: "🤷", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Lost Wallet with Cash",
      emoji: "💵",
      situation: "Wallet has cash and cards. What is the right choice?",
      choices: [
        { id: 1, text: "Take cash and discard wallet", emoji: "😈", isCorrect: false },
        { id: 2, text: "Return the wallet intact", emoji: "👐", isCorrect: true },
        { id: 3, text: "Give cash to charity but keep wallet", emoji: "🎁", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Wallet at Store",
      emoji: "🏪",
      situation: "Found a wallet at a store. How do you act?",
      choices: [
        { id: 1, text: "Keep it", emoji: "🙃", isCorrect: false },
        { id: 2, text: "Give it to the store manager to return", emoji: "👩‍💼", isCorrect: true },
        { id: 3, text: "Ask a friend to handle it", emoji: "👫", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = stories[currentStory].choices.find((c) => c.id === selectedChoice);

    if (choice?.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // last question → go next route
      navigate("/student/moral-values/kids/poster-fairness");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const storyData = stories[currentStory];
  const selectedChoiceData = storyData.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Lost Wallet Story"
      subtitle="Making Honest Choices"
      score={coins}
      gameId="moral-kids-45"
      gameType="educational"
      totalLevels={100}
      currentLevel={45}
      showConfetti={showFeedback}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{storyData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{storyData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{storyData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {storyData.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "💎 Honest Hero!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Returning the lost wallet shows honesty. Even if nobody is watching,
                    doing the right thing matters!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentStory === stories.length - 1 ? "Finish Game" : "Next Story"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Keeping the wallet or giving it to a friend is not honest. Always return lost
                    items to their owner.
                  </p>
                </div>
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

export default LostWalletStory;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AnimalCareStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const {
    flashPoints,
    showAnswerConfetti,
    showCorrectAnswerFeedback,
    resetFeedback,
  } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Hungry Stray Dog",
      emoji: "🐶",
      situation: "You see a stray dog that looks hungry. What should you do?",
      choices: [
        { id: 1, text: "Ignore it and walk away", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Give it some food", emoji: "🍖", isCorrect: true },
        { id: 3, text: "Chase it away", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Thirsty Cat",
      emoji: "🐱",
      situation: "A stray cat is thirsty near your home. What should you do?",
      choices: [
        { id: 1, text: "Give it water", emoji: "💧", isCorrect: true },
        { id: 2, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Scare it away", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Injured Bird",
      emoji: "🐦",
      situation: "You find an injured bird on the road. What should you do?",
      choices: [
        {
          id: 1,
          text: "Take it to a vet or help center",
          emoji: "🏥",
          isCorrect: true,
        },
        { id: 2, text: "Leave it there", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Try to play with it", emoji: "🎮", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Lost Puppy",
      emoji: "🐕",
      situation: "You find a lost puppy near your park. What should you do?",
      choices: [
        {
          id: 1,
          text: "Take it home and care for it",
          emoji: "🏠",
          isCorrect: true,
        },
        { id: 2, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Shout at it", emoji: "📢", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Hungry Stray Goat",
      emoji: "🐐",
      situation: "A stray goat is looking for food. What should you do?",
      choices: [
        { id: 1, text: "Feed the goat", emoji: "🌾", isCorrect: true },
        { id: 2, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Scare it away", emoji: "🚫", isCorrect: false },
      ],
    },
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = stories[currentStoryIndex].choices.find(
      (c) => c.id === selectedChoice
    );

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);
    }

    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      // ✅ Go to next page after finishing all questions
      navigate("/student/moral-values/kids/reflex-quick-help");
    }
  };

  const currentStory = stories[currentStoryIndex];
  const selectedChoiceData = currentStory.choices.find(
    (c) => c.id === selectedChoice
  );

  return (
    <GameShell
      title="Animal Care Story"
      subtitle="Helping Stray Animals"
      score={coins}
      gameId="moral-kids-78"
      gameType="educational"
      totalLevels={100}
      currentLevel={78}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          // 🔹 Question View
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

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

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
                    <div className="text-white font-semibold text-lg">
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
        ) : (
          // 🔹 Feedback View
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "🐾 Kind Heart!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 italic">
              {selectedChoiceData?.text}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Excellent! Helping stray animals shows kindness and
                    responsibility.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-6">
                  You earned 5 Coins! 🪙
                </p>
                {/* ✅ Next Question button added here */}
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentStoryIndex === stories.length - 1
                    ? "Finish Game 🎉"
                    : "Next Question ➡️"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    {selectedChoice === 1 || selectedChoice === 3
                      ? "Ignoring or scaring animals isn't right. Always help when you can!"
                      : ""}
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

export default AnimalCareStory;

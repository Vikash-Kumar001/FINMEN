import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BraveryStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "Wrongly Accused",
      emoji: "⚖️",
      situation: "Your class blames one student for breaking a window, but you saw it wasn’t them. What do you do?",
      choices: [
        { id: 1, text: "Stay quiet to avoid trouble", emoji: "😶", isCorrect: false },
        { id: 2, text: "Defend the innocent student", emoji: "🗣️", isCorrect: true },
        { id: 3, text: "Blame someone else", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      title: "Lost Wallet",
      emoji: "👛",
      situation: "You find your teacher’s wallet on the playground with money inside. What should you do?",
      choices: [
        { id: 1, text: "Return it immediately", emoji: "🙋", isCorrect: true },
        { id: 2, text: "Take the money and leave the wallet", emoji: "💸", isCorrect: false },
        { id: 3, text: "Ignore it and walk away", emoji: "🚶", isCorrect: false }
      ]
    },
    {
      title: "Bullied Student",
      emoji: "🧒",
      situation: "You see a classmate being bullied by older students. What will you do?",
      choices: [
        { id: 1, text: "Tell a teacher or intervene safely", emoji: "🧑‍🏫", isCorrect: true },
        { id: 2, text: "Laugh with others to fit in", emoji: "😅", isCorrect: false },
        { id: 3, text: "Walk away and pretend not to see", emoji: "🚶‍♀️", isCorrect: false }
      ]
    },
    {
      title: "Cheating Friend",
      emoji: "📚",
      situation: "Your friend asks you to help them cheat on a test. What do you do?",
      choices: [
        { id: 1, text: "Say no and explain it’s wrong", emoji: "🙅", isCorrect: true },
        { id: 2, text: "Help them because they’re your friend", emoji: "🤝", isCorrect: false },
        { id: 3, text: "Ignore the message and hope they stop", emoji: "📱", isCorrect: false }
      ]
    },
    {
      title: "Standing Alone",
      emoji: "🦁",
      situation: "Everyone laughs at a new student’s accent. You feel it’s wrong. What do you do?",
      choices: [
        { id: 1, text: "Tell everyone to stop and be kind", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Stay silent to avoid being teased", emoji: "😶", isCorrect: false },
        { id: 3, text: "Join in to fit with the group", emoji: "🙊", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentStoryIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins(coins + 5);
    }

    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      handleNext(); // move to next game after last story
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/roleplay-courageous-leader");
  };

  const selectedChoiceData = currentStory.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Bravery Story"
      subtitle="Standing Up for What’s Right"
      onNext={handleNext}
      nextEnabled={showFeedback && currentStoryIndex === stories.length - 1 && selectedChoiceData?.isCorrect}
      showGameOver={showFeedback && currentStoryIndex === stories.length - 1 && selectedChoiceData?.isCorrect}
      score={coins}
      gameId="moral-teen-58"
      gameType="moral"
      totalLevels={100}
      currentLevel={58}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentStory.title} ({currentStoryIndex + 1}/5)
            </h2>
            <div className="bg-orange-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentStory.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What would you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-orange-500/50 border-orange-300 ring-2 ring-white"
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
                  ? "bg-gradient-to-r from-green-500 to-yellow-500 hover:opacity-90"
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
              {selectedChoiceData.isCorrect ? "💪 Brave Choice!" : "😕 Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Standing up for what’s right, even when it’s difficult, is a mark of real courage. 
                    Keep being brave — your honesty and kindness can inspire others!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextStory}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90"
                >
                  {currentStoryIndex < stories.length - 1 ? "Next Story ➜" : "Finish Game"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Bravery means doing what’s right even if others don’t. Try again — your courage matters!
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

export default BraveryStory;

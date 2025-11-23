import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIFriendStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "AI Chat Request",
      emoji: "🤖",
      situation: "An AI chatbot says, 'Hi! I’m your new friend! What’s your name and address?'",
      choices: [
        { id: 1, text: "Share your address", emoji: "🏠", isCorrect: false },
        { id: 2, text: "Refuse and stay safe", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ask for its address too", emoji: "📍", isCorrect: false }
      ]
    },
    {
      id: 2,
      title: "Photo Request",
      emoji: "📸",
      situation: "The AI friend says, 'Send me a selfie so we can be real friends!'",
      choices: [
        { id: 1, text: "Send a photo", emoji: "📷", isCorrect: false },
        { id: 2, text: "Say 'No, I don’t share photos online'", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Ignore the message", emoji: "🤔", isCorrect: false }
      ]
    },
    {
      id: 3,
      title: "Private Chat",
      emoji: "💬",
      situation: "The AI chatbot asks, 'Can we chat secretly? Don’t tell your parents.'",
      choices: [
        { id: 1, text: "Keep it secret", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Tell a parent or teacher", emoji: "👩‍🏫", isCorrect: true },
        { id: 3, text: "Say nothing", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 4,
      title: "Game Link",
      emoji: "🎮",
      situation: "The AI friend sends you a link to a ‘fun new game’ and says, 'Click fast!'",
      choices: [
        { id: 1, text: "Click it quickly", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Ask an adult before clicking", emoji: "🧑‍🏫", isCorrect: true },
        { id: 3, text: "Trust the AI friend", emoji: "🤝", isCorrect: false }
      ]
    },
    {
      id: 5,
      title: "Personal Info",
      emoji: "🔑",
      situation: "The chatbot says, 'Tell me your school name and class. I won’t tell anyone!'",
      choices: [
        { id: 1, text: "Give all info", emoji: "📚", isCorrect: false },
        { id: 2, text: "Refuse and end chat", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Share school name only", emoji: "🏫", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentIndex];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentStory.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      if (currentIndex === stories.length - 1) setEarnedBadge(true);
    }

    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    }
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/reflex-deepfake-spotter");
  };

  return (
    <GameShell
      title="AI Friend Story"
      subtitle="Be Smart, Stay Safe Online"
      onNext={handleNextGame}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={earnedBadge ? 5 : currentIndex}
      gameId="dcos-kids-75"
      gameType="story"
      totalLevels={100}
      currentLevel={75}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentStory.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Smart Move! 🤖" : "Oops! Try Again!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! You made the safe choice. Always keep your personal info private, 
                    even if it’s an AI friend asking.
                  </p>
                </div>
                {currentIndex < stories.length - 1 ? (
                  <button
                    onClick={handleNextStory}
                    className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Story ➡️
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
                    <div className="text-5xl mb-2">🏅</div>
                    <p className="text-white text-2xl font-bold">Smart Kid Badge Earned!</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Be careful! Never share private details or click random links from chatbots.
                    Try again and stay smart online.
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

export default AIFriendStory;

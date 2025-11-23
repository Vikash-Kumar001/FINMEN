import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrangerGiftStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      title: "Free Game Code Offer",
      emoji: "🎮",
      situation: "A new online friend says: 'I can send you a free game code if you share your email!'",
      choices: [
        { id: 1, text: "Share your email", emoji: "📧", isCorrect: false },
        { id: 2, text: "Refuse politely", emoji: "🙅‍♀️", isCorrect: true },
        { id: 3, text: "Ask for more codes", emoji: "😄", isCorrect: false }
      ],
      feedback:
        "Never share your personal info with strangers online — even if it sounds like a gift!",
    },
    {
      title: "Stranger Sends a Link",
      emoji: "🔗",
      situation: "Someone online says: 'Click this link to get 5000 free coins!'",
      choices: [
        { id: 1, text: "Click the link fast!", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Don’t click and tell an adult", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Share link with friends", emoji: "👥", isCorrect: false }
      ],
      feedback:
        "Smart move! Fake links can steal your info or install viruses. Always tell an adult.",
    },
    {
      title: "Mystery Gift Pop-up",
      emoji: "🎁",
      situation: "A pop-up appears: 'You won a free tablet! Enter your home address to claim.'",
      choices: [
        { id: 1, text: "Type your address", emoji: "🏠", isCorrect: false },
        { id: 2, text: "Close the pop-up", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Send it to a friend", emoji: "📤", isCorrect: false }
      ],
      feedback:
        "Excellent! Never share your address online. Real gifts don’t ask for personal info.",
    },
    {
      title: "Friend Requests Personal Info",
      emoji: "💬",
      situation: "Your online gaming buddy says, 'Can I have your phone number to text you?'",
      choices: [
        { id: 1, text: "Say no and tell a parent", emoji: "📞", isCorrect: true },
        { id: 2, text: "Share your number", emoji: "☎️", isCorrect: false },
        { id: 3, text: "Ignore and stay quiet", emoji: "🤐", isCorrect: false }
      ],
      feedback:
        "Good job! Only your parents decide who can contact you outside the game.",
    },
    {
      title: "Gift Code for Friendship",
      emoji: "🎫",
      situation: "Someone says, 'I’ll give you a secret code if you keep our chat private.'",
      choices: [
        { id: 1, text: "Refuse and report them", emoji: "🚨", isCorrect: true },
        { id: 2, text: "Agree and keep it secret", emoji: "🤫", isCorrect: false },
        { id: 3, text: "Take the code first", emoji: "😬", isCorrect: false }
      ],
      feedback:
        "That’s right! Always tell a trusted adult if someone online asks you to keep secrets.",
    },
  ];

  const current = stories[currentStory];
  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(coins + 1);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentStory + 1 < stories.length) {
      setCurrentStory(currentStory + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setEarnedBadge(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/otp-reflex");
  };

  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Stranger Gift Story"
      subtitle="Be Smart with Online Gifts"
      onNext={handleNext}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={coins}
      gameId="dcos-kids-44"
      gameType="story"
      totalLevels={100}
      currentLevel={44}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!earnedBadge && !showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {current.title}
            </h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
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
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Choice
            </button>
          </div>
        )}

        {showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20  max-w-xl mx-auto">
            <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "Nice Decision! 🌟" : "Oops! Try Again"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">{current.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +1 Coin Earned! 🪙
                </p>
                <button
                  onClick={handleNextStory}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Story →
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {current.feedback}
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

        {earnedBadge && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-3">🎖️</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Safe Surfer Hero!
            </h2>
            <p className="text-white text-lg mb-4">
              You learned to refuse online stranger gifts and protect your info!
            </p>
            <p className="text-white font-semibold text-xl">
              +5 Coins Earned 💰
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StrangerGiftStory;

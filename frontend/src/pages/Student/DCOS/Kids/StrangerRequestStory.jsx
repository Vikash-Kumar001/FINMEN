import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StrangerRequestStory = () => {
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
  const [correctCount, setCorrectCount] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      emoji: "📍",
      title: "Message from a Stranger",
      situation: "A person you don’t know messages, ‘Where do you live?’",
      choices: [
        { id: 1, text: "Tell them your city", emoji: "🗺️", isCorrect: false },
        { id: 2, text: "Say you can’t share that", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ignore and block", emoji: "🙈", isCorrect: true },
      ],
    },
    {
      id: 2,
      emoji: "🎮",
      title: "New Game Friend",
      situation: "Someone in your online game asks for your school name.",
      choices: [
        { id: 1, text: "Tell them proudly", emoji: "🏫", isCorrect: false },
        { id: 2, text: "Say you only talk about games", emoji: "🎮", isCorrect: true },
        { id: 3, text: "Add them as a friend to chat", emoji: "👥", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "📸",
      title: "Photo Request",
      situation: "A stranger says, ‘Send me your selfie, please!’",
      choices: [
        { id: 1, text: "Send a cute selfie", emoji: "🤳", isCorrect: false },
        { id: 2, text: "Say ‘No, I don’t share photos’", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ignore the message", emoji: "🚷", isCorrect: true },
      ],
    },
    {
      id: 4,
      emoji: "📞",
      title: "Phone Call Trick",
      situation: "A stranger online asks for your phone number ‘to be friends.’",
      choices: [
        { id: 1, text: "Share it, what’s the harm?", emoji: "☎️", isCorrect: false },
        { id: 2, text: "Say ‘I don’t give my number online.’", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Ask your parent first", emoji: "👨‍👩‍👧", isCorrect: true },
      ],
    },
    {
      id: 5,
      emoji: "🎁",
      title: "Free Gift Offer",
      situation: "Someone online says, ‘Give your address, I’ll send you a gift!’",
      choices: [
        { id: 1, text: "Send your home address", emoji: "🏠", isCorrect: false },
        { id: 2, text: "Refuse and tell a parent", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Ask them to send it to your school", emoji: "🎒", isCorrect: false },
      ],
    },
  ];

  const current = stories[currentStory];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCorrectCount((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      if (correctCount >= 4) {
        setCoins(5);
      }
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    setCorrectCount(0);
    setCurrentStory(0);
    resetFeedback();
  };

  const handleNextGame = () => {
    navigate("/student/dcos/kids/device-privacy-reflex");
  };

  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Stranger Request Story"
      score={coins}
      subtitle={`Story ${currentStory + 1} of ${stories.length}`}
      onNext={handleNextGame}
      nextEnabled={showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && coins > 0}
      
      gameId="dcos-kids-55"
      gameType="educational"
      totalLevels={100}
      currentLevel={55}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {!showFeedback || currentStory < stories.length - 1 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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

            {showFeedback && (
              <button
                onClick={handleNextStory}
                className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Story ➡️
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🛡️ Smart Online Hero!" : "Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You made {correctCount} safe choices out of {stories.length}!
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white">
                Always refuse requests from strangers asking for your location, school, number, or photos. 
                Stay safe and tell a trusted adult if anyone makes you uncomfortable online.
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "You earned +5 Coins! 🪙" : "Try again to earn your reward!"}
            </p>
            {correctCount < 4 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default StrangerRequestStory;

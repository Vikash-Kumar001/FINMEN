import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FamilyTalkStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const stories = [
    {
      id: 1,
      title: "Forwarded Message 🚨",
      emoji: "📱",
      situation:
        "Grandpa sends a WhatsApp message saying: ‘This new medicine cures all diseases!’",
      choices: [
        { id: 1, text: "Believe it and share to everyone", emoji: "📤", isCorrect: false },
        { id: 2, text: "Tell Grandpa kindly that it's fake news", emoji: "💬", isCorrect: true },
        { id: 3, text: "Laugh and ignore it", emoji: "😅", isCorrect: false }
      ],
    },
    {
      id: 2,
      title: "Scary Headline 😱",
      emoji: "📰",
      situation:
        "Grandpa says: ‘The city will be locked down tomorrow! It’s all over WhatsApp!’",
      choices: [
        { id: 1, text: "Tell Grandpa to verify from news channels", emoji: "🧐", isCorrect: true },
        { id: 2, text: "Forward it to friends immediately", emoji: "📲", isCorrect: false },
        { id: 3, text: "Stay silent and confused", emoji: "😕", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Fake Prize Message 🎁",
      emoji: "🎯",
      situation:
        "Grandpa gets a message saying: ‘You won ₹1,00,000! Click the link to claim.’",
      choices: [
        { id: 1, text: "Click the link fast", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Warn Grandpa not to click suspicious links", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Ignore but say nothing", emoji: "🤐", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Funny Meme 🧓😂",
      emoji: "🤣",
      situation:
        "Grandpa shares a funny meme that makes fun of someone’s religion.",
      choices: [
        { id: 1, text: "Laugh and forward it too", emoji: "😆", isCorrect: false },
        { id: 2, text: "Tell Grandpa kindly that jokes shouldn’t hurt feelings", emoji: "💖", isCorrect: true },
        { id: 3, text: "Ignore the message", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Health Tips 👴🍵",
      emoji: "🫖",
      situation:
        "Grandpa forwards: ‘Drink only turmeric water daily, no need for doctors!’",
      choices: [
        { id: 1, text: "Tell Grandpa to check with real doctors", emoji: "👩‍⚕️", isCorrect: true },
        { id: 2, text: "Follow it blindly", emoji: "😇", isCorrect: false },
        { id: 3, text: "Make fun of the message", emoji: "😜", isCorrect: false },
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
      showCorrectAnswerFeedback(5, true);
    }
    setShowFeedback(true);
  };

  const handleNextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
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

  const handleFinish = () => {
    navigate("/student/dcos/kids/fact-check-poster-task");
  };

  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Family Talk Story"
      subtitle="Be a Kind Corrector 💬"
      onNext={handleFinish}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={earnedBadge ? "🏅" : ""}
      gameId="dcos-kids-36"
      gameType="story"
      totalLevels={100}
      currentLevel={36}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!earnedBadge ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">{current.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
              <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
                <p className="text-white text-lg leading-relaxed">{current.situation}</p>
              </div>

              <h3 className="text-white font-bold mb-4">What should you do?</h3>

              <div className="space-y-3 mb-6">
                {current.choices.map((choice) => (
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
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-6xl mb-4 text-center">{selectedChoiceData.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {selectedChoiceData.isCorrect ? "Great Job! 🌟" : "Try Again!"}
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

              {selectedChoiceData.isCorrect ? (
                <>
                  <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white">
                      Perfect! You corrected Grandpa with kindness and truth. 
                      Teaching family members how to spot fake news makes you a real Kind Corrector!
                    </p>
                  </div>
                  <button
                    onClick={handleNextStory}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Story ➡️
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                    <p className="text-white">
                      Not quite right! The kind thing is to gently correct Grandpa 
                      instead of ignoring or sharing the message.
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
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-6xl mb-4">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-4">You earned the Badge!</h2>
            <p className="text-yellow-400 text-2xl font-semibold mb-4">“Kind Corrector” 🪄</p>
            <p className="text-white/80 mb-6">
              You helped Grandpa learn about fake news with kindness and truth. 
              Always fact-check and spread positivity online!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FamilyTalkStory;

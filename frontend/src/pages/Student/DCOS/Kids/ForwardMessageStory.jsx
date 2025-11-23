import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ForwardMessageStory = () => {
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
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 🧠 Story-based questions (5 total)
  const stories = [
    {
      id: 1,
      emoji: "💊",
      title: "Magic Medicine Message",
      situation:
        "Your friend forwards a message that says, ‘Magic medicine cures all diseases instantly!’",
      choices: [
        { id: 1, text: "Believe and share it with others", emoji: "📤", isCorrect: false },
        { id: 2, text: "Don’t believe it, and verify before sharing", emoji: "🕵️‍♀️", isCorrect: true },
        { id: 3, text: "Buy it immediately", emoji: "💸", isCorrect: false },
      ],
    },
    {
      id: 2,
      emoji: "🎁",
      title: "Free Gift Link",
      situation:
        "A message says ‘Click this link to get free smartphones!’ and your classmates are sharing it.",
      choices: [
        { id: 1, text: "Click the link quickly", emoji: "⚡", isCorrect: false },
        { id: 2, text: "Ignore and tell others it’s fake", emoji: "🚫", isCorrect: true },
        { id: 3, text: "Forward to friends", emoji: "📲", isCorrect: false },
      ],
    },
    {
      id: 3,
      emoji: "😱",
      title: "Scary Virus Alert",
      situation:
        "You get a forward: ‘Don’t go outside tonight, a new virus spreads in air!’",
      choices: [
        { id: 1, text: "Panic and share it with everyone", emoji: "😨", isCorrect: false },
        { id: 2, text: "Check reliable news or official sites first", emoji: "📰", isCorrect: true },
        { id: 3, text: "Believe your friend’s message blindly", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 4,
      emoji: "🌙",
      title: "Wish Chain Message",
      situation:
        "You get a message saying ‘Forward this to 10 people or you’ll have bad luck!’",
      choices: [
        { id: 1, text: "Forward to everyone quickly", emoji: "😬", isCorrect: false },
        { id: 2, text: "Ignore and don’t spread superstition", emoji: "😌", isCorrect: true },
        { id: 3, text: "Post it on your story", emoji: "📸", isCorrect: false },
      ],
    },
    {
      id: 5,
      emoji: "💬",
      title: "Breaking Celebrity News",
      situation:
        "You see a viral message: ‘Famous actor quitting movies forever!’",
      choices: [
        { id: 1, text: "Search online to confirm", emoji: "🔍", isCorrect: true },
        { id: 2, text: "Forward before it’s old news", emoji: "⏩", isCorrect: false },
        { id: 3, text: "Make a meme about it", emoji: "😂", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const story = stories[currentStory];
    const choice = story.choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, false);
      setScore((prev) => prev + 1);
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
      const accuracy = (score / stories.length) * 100;
      if (accuracy >= 70) setCoins(5);
      setShowFeedback(true);
      setSelectedChoice(null);
    }
  };

  const handleTryAgain = () => {
    setCurrentStory(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/dcos/kids/picture-puzzle");
  };

  const currentData = stories[currentStory];
  const selectedChoiceData = currentData.choices.find((c) => c.id === selectedChoice);
  const accuracy = Math.round((score / stories.length) * 100);

  return (
    <GameShell
      title="Forward Message Story"
      score={coins}
      subtitle={`Scenario ${currentStory + 1} of ${stories.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && currentStory === stories.length - 1 && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showFeedback && currentStory === stories.length - 1 && accuracy >= 70}
      
      gameId="dcos-kids-33"
      gameType="story-choice"
      totalLevels={100}
      currentLevel={33}
      showConfetti={showFeedback && currentStory === stories.length - 1 && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/kids"
    >
      <div className="space-y-8">
        {/* ✅ Normal Question View */}
        {!showFeedback && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentData.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentData.choices.map((choice) => (
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

        {/* ✅ Feedback After Each Question */}
        {showFeedback && currentStory < stories.length && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "✅ Correct!" : "❌ Oops!"}
            </h2>
            <p className="text-white text-lg mb-6">{selectedChoiceData?.text}</p>
            <button
              onClick={handleNextStory}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentStory < stories.length - 1 ? "Next Story ➡️" : "See Results 🏁"}
            </button>
          </div>
        )}

        {/* ✅ Final Results Screen */}
        {showFeedback && currentStory === stories.length - 1 && !selectedChoice && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 70 ? "🧠 Smart Forward Thinker!" : "📱 Be More Careful!"}
            </h2>
            <p className="text-white/90 text-lg mb-4">
              You made {score} smart choices out of {stories.length} ({accuracy}%)
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 Always double-check forwarded messages. Don’t believe everything online!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 70 ? "You earned 5 Coins! 🪙" : "Score 70% or higher to earn coins!"}
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
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

export default ForwardMessageStory;

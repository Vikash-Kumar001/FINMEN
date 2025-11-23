import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotConfusionStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // ✅ 5 AI confusion stories
  const stories = [
    {
      id: 1,
      emoji: "🤖",
      title: "Robot Confusion Story 1",
      situation: 'Robot points to a 🐯 and says "Look, a lion!" What should you do?',
      choices: [
        { id: 1, text: "Correct and teach it is a tiger", emoji: "✅", isCorrect: true },
        { id: 2, text: "Stay silent and ignore", emoji: "🤐", isCorrect: false },
        { id: 3, text: "Say both are the same", emoji: "🤷‍♂️", isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "🍎",
      title: "Robot Confusion Story 2",
      situation: 'Robot sees a red apple and says "That’s a tomato!" What should you do?',
      choices: [
        { id: 1, text: "Explain it’s an apple, not a tomato", emoji: "✅", isCorrect: true },
        { id: 2, text: "Agree with the robot", emoji: "👍", isCorrect: false },
        { id: 3, text: "Laugh and walk away", emoji: "😂", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "🐶",
      title: "Robot Confusion Story 3",
      situation: 'Robot calls a cat 🐱 a dog 🐶. What should you do?',
      choices: [
        { id: 1, text: "Correct it kindly and say it’s a cat", emoji: "✅", isCorrect: true },
        { id: 2, text: "Tell it’s close enough", emoji: "😅", isCorrect: false },
        { id: 3, text: "Ignore and move on", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 4,
      emoji: "🚗",
      title: "Robot Confusion Story 4",
      situation: 'Robot sees a bus 🚌 and says "That’s a car!" What should you do?',
      choices: [
        { id: 1, text: "Tell it’s actually a bus", emoji: "✅", isCorrect: true },
        { id: 2, text: "Say yes to avoid confusion", emoji: "🙈", isCorrect: false },
        { id: 3, text: "Say both are same vehicles", emoji: "🚘", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "☀️",
      title: "Robot Confusion Story 5",
      situation: 'Robot sees the moon 🌙 and says "The sun is shining!" What should you do?',
      choices: [
        { id: 1, text: "Teach it that it’s the moon, not the sun", emoji: "✅", isCorrect: true },
        { id: 2, text: "Say maybe it’s the same", emoji: "🤔", isCorrect: false },
        { id: 3, text: "Do nothing", emoji: "😐", isCorrect: false }
      ]
    }
  ];

  const currentStory = stories[currentIndex];
  const selectedChoiceData = currentStory.choices.find(c => c.id === selectedChoice);

  const handleChoice = (id) => {
    setSelectedChoice(id);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;

    const choice = currentStory.choices.find(c => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      setCorrectCount(prev => prev + 1);
      showCorrectAnswerFeedback(5, true);
      setCoins(prev => prev + 5);
    }
  };

  const handleNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      // ✅ All done — show popup
      setShowPopup(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/missing-data-puzzle");
  };

  return (
    <GameShell
      title="Robot Confusion Stories 🤖"
      subtitle="Help Robots Learn Correctly"
      onNext={handleNext}
      nextEnabled={showPopup}
      showGameOver={showPopup}
      score={coins}
      gameId="ai-kids-62"
      gameType="ai"
      totalLevels={100}
      currentLevel={62}
      showConfetti={showPopup}
      backPath="/games/ai-for-all/kids"
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-9xl mb-4 text-center">{currentStory.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentStory.title}</h2>
            <p className="text-white/80 text-center mb-2">
              Question {currentIndex + 1} of {stories.length}
            </p>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentStory.situation}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentStory.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✅ Great Correction!" : "❌ Not Quite!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData.text}
            </p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Correcting AI mistakes helps it learn better! Teaching makes robots smarter.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-6">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNextStory}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  {currentIndex < stories.length - 1 ? "Next Story ➡️" : "Finish 🏁"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    AI learns from humans. If we don’t correct mistakes, it stays confused!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔄
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ✅ Final Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 text-white rounded-2xl p-10 text-center shadow-2xl animate-bounce">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold mb-2">Amazing Job!</h3>
            <p className="text-lg mb-6">
              You corrected all <strong>5 robot mistakes</strong> and earned the <strong>AI Helper Badge!</strong> 🤖
            </p>
            <p className="text-yellow-300 text-xl font-bold mb-6">
              Total Coins: {coins} 🪙
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-white text-blue-600 font-bold px-6 py-2 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
};

export default RobotConfusionStory;

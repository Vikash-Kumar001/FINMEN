import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DarkRoomStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Dark Room Story",
      emoji: "🧸",
      situation: "You're afraid to go get your toy in a dark room. What should you do?",
      choices: [
        { id: 1, text: "Stay in fear", emoji: "😨", isCorrect: false },
        { id: 2, text: "Call someone", emoji: "📞", isCorrect: false },
        { id: 3, text: "Go bravely yourself", emoji: "💪", isCorrect: true },
        { id: 4, text: "Pretend toy doesn't exist", emoji: "🙈", isCorrect: false },
        { id: 5, text: "Leave the room", emoji: "🚪", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Dark Closet",
      emoji: "🕯️",
      situation: "You need to find your shoes in a dark closet. What should you do?",
      choices: [
        { id: 1, text: "Feel around slowly", emoji: "🤏", isCorrect: true },
        { id: 2, text: "Wait for light", emoji: "💡", isCorrect: false },
        { id: 3, text: "Kick everything", emoji: "👟", isCorrect: false },
        { id: 4, text: "Ask someone else", emoji: "🙋", isCorrect: false },
        { id: 5, text: "Ignore shoes", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Hallway Fear",
      emoji: "🏠",
      situation: "You see a dark hallway you must cross. How do you proceed?",
      choices: [
        { id: 1, text: "Run quickly", emoji: "🏃", isCorrect: false },
        { id: 2, text: "Use a flashlight", emoji: "🔦", isCorrect: true },
        { id: 3, text: "Stay put", emoji: "🛑", isCorrect: false },
        { id: 4, text: "Shout for help", emoji: "📣", isCorrect: false },
        { id: 5, text: "Turn back", emoji: "↩️", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Basement Challenge",
      emoji: "🏚️",
      situation: "Your toy fell into the basement. What should you do?",
      choices: [
        { id: 1, text: "Go in carefully", emoji: "🧍", isCorrect: true },
        { id: 2, text: "Leave it", emoji: "🚪", isCorrect: false },
        { id: 3, text: "Call parent", emoji: "📞", isCorrect: false },
        { id: 4, text: "Send a friend", emoji: "👦", isCorrect: false },
        { id: 5, text: "Use a stick", emoji: "🪵", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Final Toy Retrieval",
      emoji: "🎁",
      situation: "You're almost there. What’s the best approach to grab your toy safely?",
      choices: [
        { id: 1, text: "Rush in blindly", emoji: "🏃", isCorrect: false },
        { id: 2, text: "Move slowly and carefully", emoji: "🐢", isCorrect: true },
        { id: 3, text: "Ask for help", emoji: "🙋", isCorrect: false },
        { id: 4, text: "Use another object", emoji: "🪀", isCorrect: false },
        { id: 5, text: "Give up", emoji: "😞", isCorrect: false },
      ],
    },
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);

    // ✅ If correct: give score, show feedback, move to next
    if (choice.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setShowFeedback(true);

      // Move to next after short delay
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedChoice(null);
          setShowFeedback(false);
        } else {
          // ✅ Show final popup on last question
          setShowPopup(true);
        }
      }, 2000);
    } else {
      // If wrong: show feedback for retry
      setShowFeedback(true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/kids/courage-quiz");
  };

  return (
    <GameShell
      title="Dark Room Story"
      subtitle={`Courage Challenge (${currentQuestion + 1}/${questions.length})`}
      onNext={handleNextGame}
      nextEnabled={showPopup}
      showGameOver={showPopup}
      score={score * 5}
      gameId="moral-kids-51"
      gameType="educational"
      totalLevels={100}
      currentLevel={51}
      showConfetti={showPopup}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* Question Card */}
        {!showPopup && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4">{current.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <div className="space-y-3">
              {current.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleChoice(c)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
                    selectedChoice?.id === c.id
                      ? c.isCorrect
                        ? "bg-green-500/50 border-green-400"
                        : "bg-red-500/50 border-red-400"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-3xl">{c.emoji}</div>
                    <div className="text-white font-semibold text-lg">{c.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Final Badge Popup */}
        {showPopup && (
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl p-10 text-center shadow-2xl animate-pulse max-w-xl mx-auto">
            <div className="text-8xl mb-4">💪</div>
            <h2 className="text-4xl font-bold text-white mb-4">Courage Hero!</h2>
            <p className="text-white/90 text-lg mb-6">
              You faced all your fears bravely and completed the Dark Room Story!
            </p>
            <p className="text-yellow-300 font-bold text-xl mb-4">
              Total Coins Earned: {score * 5} 🪙
            </p>
            <button
              onClick={handleNextGame}
              className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-200"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DarkRoomStory;

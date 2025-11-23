import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SharingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Chocolate Sharing",
      emoji: "🍫",
      situation: "You have 2 chocolates, your friend has none. Do you share?",
      choices: [
        { id: 1, text: "Keep both for yourself", emoji: "🙅‍♀️", isCorrect: false },
        { id: 2, text: "Share one chocolate", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Hide them", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      title: "Toy Sharing",
      emoji: "🧸",
      situation: "You have a new toy, your friend has none. Do you let them play?",
      choices: [
        { id: 1, text: "No, keep it to yourself", emoji: "🙅‍♂️", isCorrect: false },
        { id: 2, text: "Yes, let them play too", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Break it so no one can play", emoji: "💥", isCorrect: false },
      ],
    },
    {
      title: "Stationery Sharing",
      emoji: "✏️",
      situation: "Your friend forgot their pencil. Do you lend one?",
      choices: [
        { id: 1, text: "No, they should buy one", emoji: "🚫", isCorrect: false },
        { id: 2, text: "Yes, lend your pencil", emoji: "✌️", isCorrect: true },
        { id: 3, text: "Hide your pencil", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      title: "Snack Sharing",
      emoji: "🍎",
      situation: "You have extra snack. Your friend is hungry. Do you share?",
      choices: [
        { id: 1, text: "Eat it all yourself", emoji: "😋", isCorrect: false },
        { id: 2, text: "Share with your friend", emoji: "🤲", isCorrect: true },
        { id: 3, text: "Throw it away", emoji: "🗑️", isCorrect: false },
      ],
    },
    {
      title: "Book Sharing",
      emoji: "📚",
      situation: "You have a fun book. Your friend has none. Do you lend it?",
      choices: [
        { id: 1, text: "No, keep it", emoji: "🙅‍♀️", isCorrect: false },
        { id: 2, text: "Yes, lend it for a while", emoji: "🤝", isCorrect: true },
        { id: 3, text: "Tear pages out", emoji: "😈", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = questions[currentQuestion].choices.find((c) => c.id === selectedChoice);
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
    setShowFeedback(false);
    setSelectedChoice(null);
    resetFeedback();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      navigate("/student/moral-values/kids/kind-or-rude-quiz");
    }
  };

  const selectedChoiceData = questions[currentQuestion].choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Sharing Story"
      subtitle="Learning to Be Kind and Generous"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-21"
      gameType="educational"
      totalLevels={100}
      currentLevel={21}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{questions[currentQuestion].title}</h2>
            <div className="bg-pink-500/20 border-2 border-pink-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{questions[currentQuestion].situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {questions[currentQuestion].choices.map((choice) => (
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
              {selectedChoiceData.isCorrect ? "🌟 Kind Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great job! Sharing shows kindness and care. When you share with others, it makes both of you happy!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {selectedChoice === 1
                      ? "Keeping everything for yourself isn’t kind. Sharing spreads happiness!"
                      : "Hiding what you have isn’t nice. The right thing is to share with your friend!"}
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

export default SharingStory;

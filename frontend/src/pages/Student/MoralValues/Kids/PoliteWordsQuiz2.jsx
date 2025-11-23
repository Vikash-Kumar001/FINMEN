import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PoliteWordsQuiz2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which word is polite?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Please", emoji: "✨", isCorrect: true },
        { id: 2, text: "Stupid", emoji: "😠", isCorrect: false },
        { id: 3, text: "Idiot", emoji: "👎", isCorrect: false }
      ]
    },
    {
      text: "Your friend gives you a gift. What should you say?",
      emoji: "🎁",
      choices: [
        { id: 1, text: "Thank you!", emoji: "😊", isCorrect: true },
        { id: 2, text: "Whatever", emoji: "😒", isCorrect: false },
        { id: 3, text: "Finally!", emoji: "🙄", isCorrect: false }
      ]
    },
    {
      text: "If you bump into someone accidentally, what should you say?",
      emoji: "🚶‍♀️💥🚶‍♂️",
      choices: [
        { id: 1, text: "Move!", emoji: "😠", isCorrect: false },
        { id: 2, text: "Sorry!", emoji: "🙏", isCorrect: true },
        { id: 3, text: "Watch it!", emoji: "😤", isCorrect: false }
      ]
    },
    {
      text: "Before asking for help, what should you say?",
      emoji: "🧒🙋‍♀️",
      choices: [
        { id: 1, text: "Do this!", emoji: "😡", isCorrect: false },
        { id: 2, text: "Please help me", emoji: "💖", isCorrect: true },
        { id: 3, text: "Hurry up!", emoji: "😤", isCorrect: false }
      ]
    },
    {
      text: "If someone helps you, what polite word should you say?",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Thanks!", emoji: "🌸", isCorrect: true },
        { id: 2, text: "So what?", emoji: "😐", isCorrect: false },
        { id: 3, text: "That’s it?", emoji: "🙄", isCorrect: false }
      ]
    }
  ];

  const current = questions[currentQuestion];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  const handleChoice = (id) => setSelectedChoice(id);

  const handleConfirm = () => {
    const choice = current.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setTotalCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    resetFeedback();
    setSelectedChoice(null);
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/moral-values/kids/reflex-respect");
  };

  const isLast = currentQuestion === questions.length - 1;

  return (
    <GameShell
      title="Polite Words Quiz"
      subtitle="Learning Respectful Language"
      onNext={handleFinish}
      nextEnabled={showFeedback && isLast}
      showGameOver={showFeedback && isLast}
      score={totalCoins}
      gameId="moral-kids-12"
      gameType="educational"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showFeedback && isLast}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-6 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl text-center font-semibold">{current.text}</p>
            </div>
            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
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
              Submit Answer
            </button>
          </div>
        ) : !isLast ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✨ Polite Kid!" : "Not Polite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-green-400 text-xl text-center mb-4">
                  Great job! Let's move to the next question.
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➜
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Try again and choose a more polite word!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-white bg-white/10 p-10 rounded-2xl border border-white/20">
            <h2 className="text-4xl font-bold mb-4">🎉 Amazing Job!</h2>
            <p className="text-xl mb-4">
              You completed all 5 polite word questions!
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              Total Coins Earned: {totalCoins} 🪙
            </p>
            <button
              onClick={handleFinish}
              className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Finish Game
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PoliteWordsQuiz2;

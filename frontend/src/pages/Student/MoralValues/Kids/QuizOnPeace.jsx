import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPeace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Which brings peace?",
      emoji: "☮️",
      choices: [
        { id: 1, text: "Sharing", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Fighting", emoji: "👊", isCorrect: false },
        { id: 3, text: "Shouting", emoji: "😡", isCorrect: false },
      ],
      feedback:
        "Correct! Sharing and caring create peace and happiness among friends.",
    },
    {
      id: 2,
      text: "When someone pushes you in line, what’s the peaceful action?",
      emoji: "🧘‍♀️",
      choices: [
        { id: 1, text: "Push them back", emoji: "🤜", isCorrect: false },
        { id: 2, text: "Stay calm and talk nicely", emoji: "🕊️", isCorrect: true },
        { id: 3, text: "Complain loudly", emoji: "📢", isCorrect: false },
      ],
      feedback:
        "Yes! Staying calm and speaking kindly helps keep peace instead of making things worse.",
    },
    {
      id: 3,
      text: "How can we make our classroom peaceful?",
      emoji: "🏫",
      choices: [
        { id: 1, text: "Help each other", emoji: "🤗", isCorrect: true },
        { id: 2, text: "Argue all day", emoji: "😤", isCorrect: false },
        { id: 3, text: "Talk behind friends", emoji: "🙊", isCorrect: false },
      ],
      feedback:
        "Exactly! Helping and supporting classmates makes the class peaceful and fun.",
    },
    {
      id: 4,
      text: "If two friends fight, what should you do?",
      emoji: "🕊️",
      choices: [
        { id: 1, text: "Help them calm down", emoji: "🤲", isCorrect: true },
        { id: 2, text: "Take sides", emoji: "🫵", isCorrect: false },
        { id: 3, text: "Ignore them", emoji: "🙈", isCorrect: false },
      ],
      feedback:
        "Perfect! Helping others calm down makes you a peacekeeper and good friend.",
    },
    {
      id: 5,
      text: "What is the best way to solve problems peacefully?",
      emoji: "🌸",
      choices: [
        { id: 1, text: "Talk and listen", emoji: "🗣️", isCorrect: true },
        { id: 2, text: "Yell until you win", emoji: "😠", isCorrect: false },
        { id: 3, text: "Walk away angry", emoji: "🚶‍♀️", isCorrect: false },
      ],
      feedback:
        "Yes! Talking and listening respectfully solves problems without fights.",
    },
  ];

  const current = questions[currentQ];
  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
  };

  const handleNextQ = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/reflex-peace-acts");
  };

  const allDone = currentQ === questions.length - 1 && showFeedback;

  return (
    <GameShell
      title="Quiz on Peace"
      subtitle="Learn How Peace Begins With You"
      onNext={handleNext}
      nextEnabled={allDone}
      showGameOver={allDone}
      score={totalCoins}
      gameId="moral-kids-82"
      gameType="educational"
      totalLevels={100}
      currentLevel={82}
      showConfetti={allDone}
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
            <div className="text-8xl mb-6 text-center">{current.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {current.text}
              </p>
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-6">
                  <p className="text-white text-center">{current.feedback}</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 3 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Try again! Peace means patience, kindness, and calm words. Choose again with love.
                  </p>
                </div>
                <button
                  onClick={handleNextQ}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Question ➜
                </button>
              </>
            )}

            {selectedChoiceData.isCorrect && currentQ < questions.length - 1 && (
              <button
                onClick={handleNextQ}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Next Question ➜
              </button>
            )}

            {allDone && (
              <p className="text-green-400 text-xl font-bold text-center mt-6">
                🎉 You completed the Peace Quiz! Total Coins: {totalCoins} 🪙
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnPeace;

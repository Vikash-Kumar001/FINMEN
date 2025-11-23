import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnConflict = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What is the best way to solve a conflict?",
      emoji: "🗣️",
      choices: [
        { id: 1, text: "Listen carefully to each other", emoji: "👂", isCorrect: true },
        { id: 2, text: "Shout louder to prove your point", emoji: "😡", isCorrect: false },
        { id: 3, text: "Ignore and walk away", emoji: "🚶", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "When your classmate disagrees, what should you do first?",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Interrupt them", emoji: "🗯️", isCorrect: false },
        { id: 2, text: "Listen to understand", emoji: "👂", isCorrect: true },
        { id: 3, text: "Complain to the teacher", emoji: "👩‍🏫", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "What helps prevent arguments from getting worse?",
      emoji: "🧘",
      choices: [
        { id: 1, text: "Staying calm and speaking politely", emoji: "🙂", isCorrect: true },
        { id: 2, text: "Raising your voice", emoji: "😤", isCorrect: false },
        { id: 3, text: "Ignoring the person", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "If two friends fight, what’s the best thing to do?",
      emoji: "👬",
      choices: [
        { id: 1, text: "Help them talk it out peacefully", emoji: "🕊️", isCorrect: true },
        { id: 2, text: "Take sides", emoji: "⚔️", isCorrect: false },
        { id: 3, text: "Spread gossip about it", emoji: "🗣️", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "Which of these builds peace after a conflict?",
      emoji: "🌈",
      choices: [
        { id: 1, text: "Saying sorry and forgiving", emoji: "💖", isCorrect: true },
        { id: 2, text: "Avoiding people forever", emoji: "🚷", isCorrect: false },
        { id: 3, text: "Ignoring feelings", emoji: "😶", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find((c) => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
      // ✅ Automatically move to next question after short delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedChoice(null);
          setShowFeedback(false);
          resetFeedback();
        } else {
          setQuizComplete(true);
        }
      }, 2000);
    } else {
      // ❌ If wrong, allow retry manually
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/reflex-peace-symbols");
  };

  const selectedChoiceData = currentQuestion.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Quiz on Conflict"
      subtitle="Peaceful Solutions"
      onNext={handleNext}
      nextEnabled={quizComplete}
      showGameOver={quizComplete}
      score={coins}
      gameId="moral-teen-82"
      gameType="moral"
      totalLevels={100}
      currentLevel={82}
      showConfetti={quizComplete}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!quizComplete ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">{currentQuestion.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>

            <p className="text-white text-lg font-semibold mb-6">
              {currentQuestion.text}
            </p>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={showFeedback}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4 justify-center">
                    <div className="text-3xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>

            {!showFeedback ? (
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
            ) : (
              <p className="text-lg mt-4 text-white/80">
                {selectedChoiceData?.isCorrect
                  ? "✅ Correct! Moving to next question..."
                  : "❌ Try again..."}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-8xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">Peace Maker!</h2>
            <p className="text-white/80 text-lg mb-6">
              You completed all 5 conflict questions! You understand how to build peace and solve disagreements calmly.
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              Total Coins Earned: {coins} 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnConflict;

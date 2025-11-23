import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOfFeelings = () => {
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "A classmate cries after losing a game. What do you do?",
      emoji: "😢",
      choices: [
        { id: 1, text: "Tease them", emoji: "😈", isCorrect: false },
        { id: 2, text: "Comfort them", emoji: "🤗", isCorrect: true },
        { id: 3, text: "Ignore them", emoji: "😐", isCorrect: false },
      ],
    },
    {
      text: "You see a friend looking sad during lunch. How do you respond?",
      emoji: "🥺",
      choices: [
        { id: 1, text: "Sit and comfort them", emoji: "💛", isCorrect: true },
        { id: 2, text: "Make fun quietly", emoji: "😏", isCorrect: false },
        { id: 3, text: "Walk away", emoji: "🚶", isCorrect: false },
      ],
    },
    {
      text: "A classmate failed a test and is upset. Your reaction?",
      emoji: "📉",
      choices: [
        { id: 1, text: "Cheer them up and offer help", emoji: "📚", isCorrect: true },
        { id: 2, text: "Laugh at their failure", emoji: "😂", isCorrect: false },
        { id: 3, text: "Ignore their feelings", emoji: "😐", isCorrect: false },
      ],
    },
    {
      text: "Someone trips and falls in the playground. What do you do?",
      emoji: "🤕",
      choices: [
        { id: 1, text: "Help them up", emoji: "🤝", isCorrect: true },
        { id: 2, text: "Point and laugh", emoji: "😈", isCorrect: false },
        { id: 3, text: "Walk past", emoji: "🚶", isCorrect: false },
      ],
    },
    {
      text: "A classmate is nervous before a presentation. How do you act?",
      emoji: "😬",
      choices: [
        { id: 1, text: "Encourage and support them", emoji: "🌟", isCorrect: true },
        { id: 2, text: "Tease them about mistakes", emoji: "😏", isCorrect: false },
        { id: 3, text: "Ignore them", emoji: "😐", isCorrect: false },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = currentQuestion?.choices.find((c) => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoiceData) return;
    if (selectedChoiceData.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins((prev) => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/teen/reflex-empathy");
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Quiz of Feelings"
      subtitle="Empathy & Compassion"
      score={coins}
      gameId="moral-teen-22"
      gameType="moral"
      totalLevels={100}
      currentLevel={22}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* QUESTION VIEW */}
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-purple-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map((choice) => (
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
          /* FEEDBACK VIEW */
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "🌟 Empathy Champion!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold mb-6">You earned 3 Coins! 🪙</p>
                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  {currentQuestionIndex < questions.length - 1
                    ? "Next Question ➡️"
                    : "Finish Quiz 🎉"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Teasing or ignoring someone who is upset shows a lack of empathy. Comfort and
                    support your classmates to build strong relationships.
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOfFeelings;

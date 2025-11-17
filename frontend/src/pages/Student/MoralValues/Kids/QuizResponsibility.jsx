import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizResponsibility = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Who is more responsible?",
      emoji: "🧸",
      choices: [
        { id: 1, text: "Child who throws toys everywhere", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Child who cleans up toys", emoji: "🧹", isCorrect: true }
      ]
    },
    {
      text: "Who is more responsible after eating snacks?",
      emoji: "🍎",
      choices: [
        { id: 1, text: "Leaves wrappers on the table", emoji: "🗑️", isCorrect: false },
        { id: 2, text: "Throws wrappers in the bin", emoji: "♻️", isCorrect: true }
      ]
    },
    {
      text: "Who is responsible with school materials?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Loses books and pencils", emoji: "😵", isCorrect: false },
        { id: 2, text: "Keeps books and pencils organized", emoji: "📖", isCorrect: true }
      ]
    },
    {
      text: "Who is responsible when it comes to pets?",
      emoji: "🐶",
      choices: [
        { id: 1, text: "Ignores feeding the pet", emoji: "🙅‍♂️", isCorrect: false },
        { id: 2, text: "Feeds and cares for the pet daily", emoji: "❤️", isCorrect: true }
      ]
    },
    {
      text: "Who shows responsibility during group activities?",
      emoji: "👫",
      choices: [
        { id: 1, text: "Does not help and distracts others", emoji: "😜", isCorrect: false },
        { id: 2, text: "Completes their tasks and helps others", emoji: "💪", isCorrect: true }
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const selectedChoiceData = selectedChoice
    ? currentQuestion.choices.find(c => c.id === selectedChoice)
    : null;

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestion.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(prev => prev + 3);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/moral-values/kids/reflex-discipline"); // next game route
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Responsibility Quiz"
      subtitle={`Learn Responsibility (${currentQuestionIndex + 1}/5)`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={currentQuestionIndex === questions.length - 1 && showFeedback}
      score={coins}
      gameId="moral-kids-32"
      gameType="educational"
      totalLevels={100}
      currentLevel={32}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-6 text-center">{currentQuestion.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestion.choices.map(choice => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 3 Coins! 🪙
              </p>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Responsibility means taking care of tasks and helping others. The right choice helps everyone!
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

            <button
              onClick={handleNext}
              className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoiceData?.isCorrect
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
              disabled={!selectedChoiceData?.isCorrect}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizResponsibility;

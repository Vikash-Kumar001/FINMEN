import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnInclusion = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const question = {
    text: "What does inclusion mean?",
    emoji: "🤝",
    options: [
      { id: 1, text: "Leaving out people who are different", isCorrect: false },
      { id: 2, text: "Including all people fairly regardless of differences", isCorrect: true },
      { id: 3, text: "Only including people who are like us", isCorrect: false }
    ]
  };

  const handleAnswer = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleConfirm = () => {
    const option = question.options.find(o => o.id === selectedAnswer);
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(3, true);
      setCoins(3);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/teen/reflex-teen-respect");
  };

  const selectedOption = question.options.find(o => o.id === selectedAnswer);

  return (
    <GameShell
      title="Quiz on Inclusion"
      subtitle="Understanding Inclusion"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-12"
      gameType="crgc"
      totalLevels={20}
      currentLevel={12}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inclusion Quiz</h2>
            <p className="text-lg text-gray-700">{question.text}</p>
          </div>
        </div>

        {!showFeedback && (
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedAnswer === option.id
                    ? 'border-teal-500 bg-teal-100 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-teal-500">
                    {String.fromCharCode(65 + option.id - 1)}
                  </span>
                  <span className="text-lg font-medium text-gray-800 flex-1 text-left">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}

            <button
              onClick={handleConfirm}
              disabled={!selectedAnswer}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        )}

        {showFeedback && (
          <div className={`p-8 rounded-2xl ${selectedOption?.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">
                {selectedOption?.isCorrect ? '✅' : '❌'}
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                selectedOption?.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {selectedOption?.isCorrect ? 'Correct!' : 'Not Quite'}
              </h3>
              <p className="text-lg text-gray-700">
                {selectedOption?.isCorrect 
                  ? 'Exactly! Inclusion means welcoming and valuing all people, regardless of their differences!'
                  : 'Inclusion is about embracing diversity and ensuring everyone feels welcomed and valued, not excluding those who are different from us.'}
              </p>
              {!selectedOption?.isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 px-8 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-all transform hover:scale-105"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnInclusion;


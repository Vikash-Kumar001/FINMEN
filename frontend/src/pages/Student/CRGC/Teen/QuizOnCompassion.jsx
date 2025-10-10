import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCompassion = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const question = {
    text: "Which of the following is an act of compassion?",
    emoji: "💖",
    options: [
      { id: 1, text: "Caring for someone who is sick", isCorrect: true },
      { id: 2, text: "Teasing someone who is sad", isCorrect: false },
      { id: 3, text: "Ignoring people in need", isCorrect: false }
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
    navigate("/student/civic-responsibility/teen/reflex-teen-compassion");
  };

  const selectedOption = question.options.find(o => o.id === selectedAnswer);

  return (
    <GameShell
      title="Quiz on Compassion"
      subtitle="Understanding Compassion"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-2"
      gameType="crgc"
      totalLevels={20}
      currentLevel={2}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        {/* Question Display */}
        <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Compassion Quiz</h2>
            <p className="text-lg text-gray-700">{question.text}</p>
          </div>
        </div>

        {/* Options */}
        {!showFeedback && (
          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedAnswer === option.id
                    ? 'border-pink-500 bg-pink-100 shadow-lg'
                    : 'border-gray-300 bg-white hover:border-pink-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-pink-500">
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
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Feedback */}
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
                  ? 'Yes! Compassion means caring for others, especially when they are sick or in need.'
                  : 'Compassion is about caring for others with kindness and understanding. Teasing or ignoring people in need is not compassionate.'}
              </p>
              {!selectedOption?.isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 px-8 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all transform hover:scale-105"
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

export default QuizOnCompassion;


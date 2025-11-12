import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSaving = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Who is the best saver?",
      options: [
        { id: "a", text: "Someone who spends all their money", correct: false },
        { id: "b", text: "Someone who saves part of their money", correct: true },
        { id: "c", text: "Someone who wastes money", correct: false }
      ]
    }
  ];

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option.id);
    const correct = option.correct;
    setIsCorrect(correct);
    
    if (correct) {
      setCoins(3);
      showCorrectAnswerFeedback(3, true);
    }
    
    // Show result immediately for incorrect, delay for correct to show animation
    setTimeout(() => {
      setShowResult(true);
    }, correct ? 1000 : 0);
  };

  const handleNext = () => {
    navigate("/student/finance/kids/reflex-savings");
  };

  return (
    <GameShell
      title="Quiz on Saving"
      subtitle="Let's test your knowledge about saving money!"
      coins={coins}
      currentLevel={2}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={showResult && isCorrect}
      showGameOver={showResult && isCorrect}
      score={coins}
      gameId="finance-kids-2"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">
                {questions[0].text}
              </h3>
              
              <div className="space-y-4">
                {questions[0].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedAnswer === option.id
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center mr-4">
                        {option.id.toUpperCase()}
                      </div>
                      <span className="text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {isCorrect ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Correct!</h3>
                <p className="text-white/90 text-lg mb-4">
                  Well done! The best saver is someone who saves part of their money.
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2">
                  <span>+3 Coins</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Not Quite!</h3>
                <p className="text-white/90 text-lg mb-4">
                  The best saver is someone who saves part of their money. That way, 
                  they have money for both now and later!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setSelectedAnswer(null);
                    setIsCorrect(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnSaving;
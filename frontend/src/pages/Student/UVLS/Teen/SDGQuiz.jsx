import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SDGQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      project: "Clean water drive.",
      options: [
        { id: 1, text: "Clean Water and Sanitation", correct: true },
        { id: 2, text: "Zero Hunger", correct: false }
      ]
    },
    {
      id: 2,
      project: "Tree planting.",
      options: [
        { id: 1, text: "Climate Action", correct: true },
        { id: 2, text: "Quality Education", correct: false }
      ]
    },
    {
      id: 3,
      project: "Food bank.",
      options: [
        { id: 1, text: "Zero Hunger", correct: true },
        { id: 2, text: "Good Health", correct: false }
      ]
    },
    {
      id: 4,
      project: "Tutoring program.",
      options: [
        { id: 1, text: "Quality Education", correct: true },
        { id: 2, text: "Gender Equality", correct: false }
      ]
    },
    {
      id: 5,
      project: "Women's workshop.",
      options: [
        { id: 1, text: "Gender Equality", correct: true },
        { id: 2, text: "Clean Energy", correct: false }
      ]
    }
  ];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleConfirm = () => {
    if (!selectedAnswer) return;

    const question = questions[currentQuestion];
    const answer = question.options.find(a => a.id === selectedAnswer);
    
    if (answer.correct) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 1500);
    } else {
      const percentage = (score / questions.length) * 100;
      if (percentage >= 70) {
        setCoins(3);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="SDG Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / questions.length * 100 >= 70)}
      showGameOver={showResult && (score / questions.length * 100 >= 70)}
      score={coins}
      gameId="civic-182"
      gameType="civic"
      totalLevels={10}
      currentLevel={2}
      showConfetti={showResult && (score / questions.length * 100 >= 70)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">Project: {questions[currentQuestion].project}</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedAnswer === option.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedAnswer}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedAnswer
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Quiz Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Score: {score} / {questions.length} ({(score / questions.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / questions.length * 100 >= 70) ? "Earned 3 Coins!" : "Try again for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Localize SDG examples.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SDGQuiz;
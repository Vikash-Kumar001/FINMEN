import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CopingStrategyPuzzle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleConfirm();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      problem: "Exam anxiety.",
      emoji: "📝",
      strategies: [
        { id: 1, text: "Breathing exercises", correct: true },
        { id: 2, text: "Procrastinate", correct: false },
        { id: 3, text: "Study more", correct: true },
        { id: 4, text: "Ignore", correct: false }
      ]
    },
    {
      id: 2,
      problem: "Friend conflict.",
      emoji: "👥",
      strategies: [
        { id: 1, text: "Talk openly", correct: true },
        { id: 2, text: "Avoid friend", correct: false },
        { id: 3, text: "Seek advice", correct: true },
        { id: 4, text: "Yell", correct: false }
      ]
    },
    {
      id: 3,
      problem: "Overwhelmed schedule.",
      emoji: "📅",
      strategies: [
        { id: 1, text: "Prioritize tasks", correct: true },
        { id: 2, text: "Do all at once", correct: false },
        { id: 3, text: "Time management", correct: true },
        { id: 4, text: "Give up", correct: false }
      ]
    },
    {
      id: 4,
      problem: "Low self-esteem.",
      emoji: "😔",
      strategies: [
        { id: 1, text: "Positive affirmations", correct: true },
        { id: 2, text: "Compare to others", correct: false },
        { id: 3, text: "Seek support", correct: true },
        { id: 4, text: "Isolate", correct: false }
      ]
    },
    {
      id: 5,
      problem: "Anger outburst.",
      emoji: "😠",
      strategies: [
        { id: 1, text: "Count to 10", correct: true },
        { id: 2, text: "Hit something", correct: false },
        { id: 3, text: "Deep breaths", correct: true },
        { id: 4, text: "Suppress", correct: false }
      ]
    }
  ];

  const handleStrategySelect = (strategyId) => {
    setSelectedStrategy(strategyId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const strategy = question.strategies.find(s => s.id === selectedStrategy) || { correct: false };
    
    const isCorrect = strategy.correct;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isCorrect
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedStrategy(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const correctCount = newResponses.filter(r => r.isCorrect).length;
      if (correctCount >= 4) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const correctCount = responses.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Coping Strategy Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      gameId="emotion-144"
      gameType="emotion"
      totalLevels={10}
      currentLevel={4}
      showConfetti={showResult && correctCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Problem: {questions[currentQuestion].problem}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Match strategy:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].strategies.map(strategy => (
                  <button
                    key={strategy.id}
                    onClick={() => handleStrategySelect(strategy.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedStrategy === strategy.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{strategy.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedStrategy && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedStrategy || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Match
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🎉 Strategy Matcher!" : "💪 More Correct!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct matches: {correctCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Include evidence-based strategies.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CopingStrategyPuzzle;
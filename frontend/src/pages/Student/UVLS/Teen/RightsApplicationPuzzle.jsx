import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RightsApplicationPuzzle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
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
      right: "Equal education.",
      emoji: "🏫",
      actions: [
        { id: 1, text: "Report denial to authorities", correct: true },
        { id: 2, text: "Accept inequality", correct: false },
        { id: 3, text: "Advocate for access", correct: true },
        { id: 4, text: "Do nothing", correct: false }
      ]
    },
    {
      id: 2,
      right: "No violence.",
      emoji: "🚫",
      actions: [
        { id: 1, text: "Seek protection order", correct: true },
        { id: 2, text: "Endure abuse", correct: false },
        { id: 3, text: "Report to police", correct: true },
        { id: 4, text: "Ignore", correct: false }
      ]
    },
    {
      id: 3,
      right: "Equal pay.",
      emoji: "💰",
      actions: [
        { id: 1, text: "File complaint", correct: true },
        { id: 2, text: "Accept less pay", correct: false },
        { id: 3, text: "Audit request", correct: true },
        { id: 4, text: "Quit job", correct: false }
      ]
    },
    {
      id: 4,
      right: "No discrimination.",
      emoji: "⚖️",
      actions: [
        { id: 1, text: "Legal action", correct: true },
        { id: 2, text: "Tolerate", correct: false },
        { id: 3, text: "Report to HR", correct: true },
        { id: 4, text: "Do nothing", correct: false }
      ]
    },
    {
      id: 5,
      right: "Health rights.",
      emoji: "🏥",
      actions: [
        { id: 1, text: "Access care", correct: true },
        { id: 2, text: "Deny self", correct: false },
        { id: 3, text: "Advocate services", correct: true },
        { id: 4, text: "Ignore health", correct: false }
      ]
    }
  ];

  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const action = question.actions.find(a => a.id === selectedAction) || { correct: false };
    
    const isCorrect = action.correct;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isCorrect
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedAction(null);
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
      title="Rights Application Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      gameId="gender-129"
      gameType="gender"
      totalLevels={10}
      currentLevel={9}
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
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Right: {questions[currentQuestion].right}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Match action:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedAction === action.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{action.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedAction && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedAction || timeLeft === 0
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
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
              {correctCount >= 4 ? "🎉 Rights Mapper!" : "💪 More Correct!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct mappings: {correctCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Provide reporting contact info.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RightsApplicationPuzzle;
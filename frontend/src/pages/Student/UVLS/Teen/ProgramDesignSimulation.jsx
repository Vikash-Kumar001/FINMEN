import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ProgramDesignSimulation = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedParam, setSelectedParam] = useState(null);
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
      param: "Set goals.",
      options: [
        { id: 1, text: "Increase participation by 20%", measurable: true },
        { id: 2, text: "Make it fun", measurable: false },
        { id: 3, text: "Track attendance", measurable: true },
        { id: 4, text: "No goals", measurable: false }
      ]
    },
    {
      id: 2,
      param: "Budget allocation.",
      options: [
        { id: 1, text: "Balanced budget", measurable: true },
        { id: 2, text: "Overspend", measurable: false },
        { id: 3, text: "Cost effective activities", measurable: true },
        { id: 4, text: "No budget", measurable: false }
      ]
    },
    {
      id: 3,
      param: "Activities.",
      options: [
        { id: 1, text: "Workshops and mentoring", measurable: true },
        { id: 2, text: "Random events", measurable: false },
        { id: 3, text: "Measured outcomes", measurable: true },
        { id: 4, text: "No activities", measurable: false }
      ]
    },
    {
      id: 4,
      param: "Simulation outcome.",
      options: [
        { id: 1, text: "Positive growth", measurable: true },
        { id: 2, text: "No change", measurable: false },
        { id: 3, text: "Iterate on data", measurable: true },
        { id: 4, text: "Failure", measurable: false }
      ]
    },
    {
      id: 5,
      param: "Iteration.",
      options: [
        { id: 1, text: "Adjust based on feedback", measurable: true },
        { id: 2, text: "Keep same", measurable: false },
        { id: 3, text: "Improve metrics", measurable: true },
        { id: 4, text: "Cancel", measurable: false }
      ]
    }
  ];

  const handleParamSelect = (paramId) => {
    setSelectedParam(paramId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const param = question.options.find(p => p.id === selectedParam) || { measurable: false };
    
    const isMeasurable = param.measurable;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isMeasurable
    }];
    
    setResponses(newResponses);
    
    if (isMeasurable) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedParam(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const measurableCount = newResponses.filter(r => r.isMeasurable).length;
      if (measurableCount >= 4) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const measurableCount = responses.filter(r => r.isMeasurable).length;

  return (
    <GameShell
      title="Program Design Simulation"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && measurableCount >= 4}
      showGameOver={showResult && measurableCount >= 4}
      score={coins}
      gameId="gender-125"
      gameType="gender"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && measurableCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <p className="text-white text-xl mb-6">{questions[currentQuestion].param}</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleParamSelect(option.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedParam === option.id
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
                disabled={!selectedParam && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedParam || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Set
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Simulation Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Measurable outcomes: {measurableCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {measurableCount >= 4 ? "Earned 5 Coins!" : "Need 4+ measurable."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use as mini capstone.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ProgramDesignSimulation;
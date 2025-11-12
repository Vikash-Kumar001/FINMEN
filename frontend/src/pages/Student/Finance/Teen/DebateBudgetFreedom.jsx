import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateBudgetFreedom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const debateTopics = [
    {
      id: 1,
      scenario: "Does budgeting give you control or stress?",
      positions: [
        { id: "control", text: "Budgeting gives control", points: ["Plan spending", "Avoid debt", "Achieve goals"], isCorrect: true },
        { id: "stress", text: "Budgeting causes stress", points: ["Feels restrictive", "Requires tracking", "Less fun"], isCorrect: false }
      ],
      reflection: "Budgeting gives control by helping you plan and avoid financial trouble."
    },
    {
      id: 2,
      scenario: "Is saving better than spending freely?",
      positions: [
        { id: "save", text: "Saving is better", points: ["Builds security", "Prepares for future", "Reduces worry"], isCorrect: true },
        { id: "spend", text: "Spending freely is better", points: ["More fun now", "Live in the moment", "No planning"], isCorrect: false }
      ],
      reflection: "Saving builds a secure future while spending freely may lead to financial stress."
    },
    {
      id: 3,
      scenario: "Should you track every expense?",
      positions: [
        { id: "track", text: "Track expenses", points: ["Know your spending", "Stay in budget", "Make smart choices"], isCorrect: true },
        { id: "ignore", text: "Don’t track", points: ["Less effort", "Feels free", "No hassle"], isCorrect: false }
      ],
      reflection: "Tracking expenses helps you stay aware and make informed financial decisions."
    },
    {
      id: 4,
      scenario: "Is a budget needed for small incomes?",
      positions: [
        { id: "budget", text: "Budget is needed", points: ["Maximize money", "Prioritize needs", "Avoid waste"], isCorrect: true },
        { id: "nobudget", text: "No budget needed", points: ["Too little to plan", "Spend as it comes", "No stress"], isCorrect: false }
      ],
      reflection: "Even small incomes benefit from budgeting to prioritize and avoid overspending."
    },
    {
      id: 5,
      scenario: "Does budgeting limit fun or enable it?",
      positions: [
        { id: "enable", text: "Budgeting enables fun", points: ["Plan for fun", "Avoid overspending", "Guilt-free spending"], isCorrect: true },
        { id: "limit", text: "Budgeting limits fun", points: ["Feels restrictive", "Less spontaneous", "More work"], isCorrect: false }
      ],
      reflection: "Budgeting allows guilt-free fun by planning spending within limits."
    }
  ];

  const handlePositionSelect = (positionId) => {
    resetFeedback();
    const topic = debateTopics[currentRound];
    const isCorrect = topic.positions.find(pos => pos.id === positionId)?.isCorrect;

    setSelectedPosition(positionId);
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    if (currentRound < debateTopics.length - 1) {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setSelectedPosition(null);
        resetFeedback();
      }, 1500);
    } else {
      setTimeout(() => setShowResult(true), 1500);
    }
  };

  const handleFinish = () => navigate("/student/finance");

  return (
    <GameShell
      title="Budget Freedom Debate"
      subtitle={`Round ${currentRound + 1} of ${debateTopics.length}`}
      coins={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-56"
      gameType="debate"
    >
      <div className="text-white space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">Round {currentRound + 1}</h3>
            <p className="text-lg mb-6">{debateTopics[currentRound].scenario}</p>
            <h4 className="text-lg font-semibold mb-4">Take a Position:</h4>
            <div className="space-y-4">
              {debateTopics[currentRound].positions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => handlePositionSelect(position.id)}
                  disabled={selectedPosition !== null}
                  className={`w-full text-left p-6 rounded-2xl transition-transform hover:scale-105 border ${
                    selectedPosition === position.id
                      ? "bg-indigo-100 border-indigo-300"
                      : "bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300"
                  } ${selectedPosition !== null ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <div className="font-bold text-xl mb-2">{position.text}</div>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {position.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            {selectedPosition && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-6">
                <h4 className="font-semibold text-yellow-800 mb-2">Reflection:</h4>
                <p className="text-yellow-700">{debateTopics[currentRound].reflection}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h3 className="text-3xl font-bold mb-4">Debate Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} out of 5!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Budgeting empowers smart financial choices!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateBudgetFreedom;
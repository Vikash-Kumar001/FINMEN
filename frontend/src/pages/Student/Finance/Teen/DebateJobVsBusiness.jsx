import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateJobVsBusiness = () => {
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
      scenario: "Is it better to do a job or start a business?",
      positions: [
        { id: "business", text: "Start a business", points: ["Builds independence", "Higher potential", "Creative control"], isCorrect: true },
        { id: "job", text: "Do a job", points: ["Stable income", "Less risk", "Fixed hours"], isCorrect: false }
      ],
      reflection: "Starting a business builds independence but involves risks."
    },
    {
      id: 2,
      scenario: "Should teens aim for jobs or startups?",
      positions: [
        { id: "business", text: "Startups", points: ["Learn early", "Innovate", "Build skills"], isCorrect: true },
        { id: "job", text: "Jobs", points: ["Safe income", "Experience", "Less stress"], isCorrect: false }
      ],
      reflection: "Startups help teens learn entrepreneurship early."
    },
    {
      id: 3,
      scenario: "Is a job better for financial security?",
      positions: [
        { id: "job", text: "Yes, jobs are safer", points: ["Stable salary", "Benefits", "Predictable"], isCorrect: true },
        { id: "business", text: "No, business is better", points: ["High returns", "Growth", "Risky"], isCorrect: false }
      ],
      reflection: "Jobs provide more immediate financial security."
    },
    {
      id: 4,
      scenario: "Does a business offer more freedom than a job?",
      positions: [
        { id: "business", text: "Yes, business offers freedom", points: ["Flexible hours", "Own boss", "Creative"], isCorrect: true },
        { id: "job", text: "No, jobs are freer", points: ["Fixed schedule", "Less responsibility", "Stable"], isCorrect: false }
      ],
      reflection: "Businesses offer more freedom but require responsibility."
    },
    {
      id: 5,
      scenario: "Is a job or business better for growth?",
      positions: [
        { id: "business", text: "Business for growth", points: ["Unlimited potential", "Skill-building", "Innovation"], isCorrect: true },
        { id: "job", text: "Job for growth", points: ["Career ladder", "Training", "Limited"], isCorrect: false }
      ],
      reflection: "Businesses offer greater growth potential."
    }
  ];

  const handlePositionSelect = (positionId) => {
    resetFeedback();
    const topic = debateTopics[currentRound];
    const isCorrect = topic.positions.find(pos => pos.id === positionId)?.isCorrect;

    setSelectedPosition(positionId);
    if (isCorrect) {
      setScore(prev => prev + 2);
      showCorrectAnswerFeedback(2, true);
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

  const handleFinish = () => navigate("/student/finance/teen");

  return (
    <GameShell
      title="Debate: Job vs Business"
      subtitle={`Round ${currentRound + 1} of ${debateTopics.length}`}
      coins={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      showConfetti={showResult && score >= 6}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-156"
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
            <h3 className="text-3xl font-bold mb-4">Job vs Business Debate Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Businesses build independence!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateJobVsBusiness;
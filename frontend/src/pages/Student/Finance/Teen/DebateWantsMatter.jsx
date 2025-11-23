import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateWantsMatter = () => {
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
      scenario: "Should you ignore wants completely?",
      positions: [
        { id: "balance", text: "Balance needs and wants", points: ["Enjoy life", "Meet needs", "Plan spending"], isCorrect: true },
        { id: "ignore", text: "Ignore wants", points: ["Focus on needs", "Save all money", "Avoid fun"], isCorrect: false }
      ],
      reflection: "Balancing needs and wants allows enjoyment without financial stress."
    },
    {
      id: 2,
      scenario: "Are wants worth budgeting for?",
      positions: [
        { id: "budget", text: "Budget for wants", points: ["Plan fun", "Avoid overspending", "Stay happy"], isCorrect: true },
        { id: "nobudget", text: "Don’t budget wants", points: ["Spend freely", "Risk debt", "No plan"], isCorrect: false }
      ],
      reflection: "Budgeting for wants ensures guilt-free enjoyment."
    },
    {
      id: 3,
      scenario: "Should wants come before savings?",
      positions: [
        { id: "savings", text: "Savings first", points: ["Secure future", "Avoid debt", "Build wealth"], isCorrect: true },
        { id: "wants", text: "Wants first", points: ["Instant fun", "Risk overspending", "No savings"], isCorrect: false }
      ],
      reflection: "Prioritizing savings ensures long-term financial stability."
    },
    {
      id: 4,
      scenario: "Can wants improve your life?",
      positions: [
        { id: "planned", text: "Planned wants help", points: ["Boost mood", "Fit budget", "Controlled spending"], isCorrect: true },
        { id: "unplanned", text: "Unplanned wants hurt", points: ["Cause debt", "Disrupt budget", "Stressful"], isCorrect: false }
      ],
      reflection: "Planned wants can enhance life without harming finances."
    },
    {
      id: 5,
      scenario: "Should wants be part of a budget?",
      positions: [
        { id: "include", text: "Include wants", points: ["Balanced life", "Motivate saving", "Planned fun"], isCorrect: true },
        { id: "exclude", text: "Exclude wants", points: ["Only needs", "No enjoyment", "Strict life"], isCorrect: false }
      ],
      reflection: "Including wants in a budget promotes a balanced lifestyle."
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

  const handleFinish = () => navigate("/student/finance");

  return (
    <GameShell
      title="Debate: Wants Matter Too?"
      subtitle={`Round ${currentRound + 1} of ${debateTopics.length}`}
      coins={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      maxScore={debateTopics.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score>= 6}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-76"
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
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Balance needs and wants wisely!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateWantsMatter;
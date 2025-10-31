import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateCashVsDigital = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const debateTopics = [
    {
      id: 1,
      scenario: "Which is better for the future — cash or digital money?",
      positions: [
        { id: "digital", text: "Digital with safety", points: ["Convenient", "Trackable", "Secure with care"], isCorrect: true },
        { id: "cash", text: "Cash", points: ["No tech needed", "Widely accepted", "Hard to track"], isCorrect: false }
      ],
      reflection: "Digital payments are the future with proper security measures."
    },
    {
      id: 2,
      scenario: "What’s safer for daily use?",
      positions: [
        { id: "digital", text: "Digital with OTP", points: ["Fast", "Secure", "Trackable"], isCorrect: true },
        { id: "cash", text: "Cash", points: ["No PIN needed", "Risk of theft", "No records"], isCorrect: false }
      ],
      reflection: "Digital payments with OTPs ensure safety and convenience."
    },
    {
      id: 3,
      scenario: "What’s better for budgeting?",
      positions: [
        { id: "digital", text: "Digital tracking", points: ["Apps track spending", "Easy records", "Secure"], isCorrect: true },
        { id: "cash", text: "Cash only", points: ["Tangible", "Hard to track", "Risk of loss"], isCorrect: false }
      ],
      reflection: "Digital tools help track and manage budgets effectively."
    },
    {
      id: 4,
      scenario: "Which is better for online shopping?",
      positions: [
        { id: "digital", text: "Digital payments", points: ["Fast", "Secure with HTTPS", "Convenient"], isCorrect: true },
        { id: "cash", text: "Cash on delivery", points: ["No card needed", "Risky", "Delayed"], isCorrect: false }
      ],
      reflection: "Digital payments are ideal for online shopping with safety."
    },
    {
      id: 5,
      scenario: "What’s the future of payments?",
      positions: [
        { id: "digital", text: "Digital with security", points: ["Global", "Fast", "Safe with care"], isCorrect: true },
        { id: "cash", text: "Cash forever", points: ["Simple", "No tech", "Limited use"], isCorrect: false }
      ],
      reflection: "Digital payments are the future with strong security practices."
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
      title="Debate: Cash vs Digital"
      subtitle={`Round ${currentRound + 1} of ${debateTopics.length}`}
      coins={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      onNext={showResult ? handleFinish : null}
      nextEnabled={showResult}
      showGameOver={showResult}
      showConfetti={showResult && score >= 6}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId="finance-teens-96"
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
            <h3 className="text-3xl font-bold mb-4">Cash vs Digital Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Digital payments are the future with safety!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateCashVsDigital;
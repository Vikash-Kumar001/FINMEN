import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateCashVsOnlineSafety = () => {
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
      scenario: "Is online money more risky than cash?",
      positions: [
        { id: "both", text: "Both need safety", points: ["Cash can be stolen", "Online needs security", "Equal caution"], isCorrect: true },
        { id: "online", text: "Online is riskier", points: ["Hacking risks", "Scams online", "No control"], isCorrect: false }
      ],
      reflection: "Both cash and online payments require careful handling."
    },
    {
      id: 2,
      scenario: "Is cash safer than online payments?",
      positions: [
        { id: "both", text: "Both need caution", points: ["Cash can be lost", "Online needs passwords", "Stay vigilant"], isCorrect: true },
        { id: "cash", text: "Cash is safer", points: ["No hacking", "Physical control", "No scams"], isCorrect: false }
      ],
      reflection: "Cash and online both have risks to manage."
    },
    {
      id: 3,
      scenario: "Are online transactions easier to secure?",
      positions: [
        { id: "both", text: "Both can be secure", points: ["Cash needs safe storage", "Online uses encryption", "Equal effort"], isCorrect: true },
        { id: "online", text: "Online is easier", points: ["Digital security", "Trackable", "No theft"], isCorrect: false }
      ],
      reflection: "Both methods need proper security measures."
    },
    {
      id: 4,
      scenario: "Does cash avoid scams better than online?",
      positions: [
        { id: "both", text: "Both face scams", points: ["Cash has fraud", "Online has phishing", "Stay alert"], isCorrect: true },
        { id: "cash", text: "Cash avoids scams", points: ["No digital fraud", "Direct payment", "Safe"], isCorrect: false }
      ],
      reflection: "Scams exist in both cash and online payments."
    },
    {
      id: 5,
      scenario: "Is online payment safer with strong passwords?",
      positions: [
        { id: "both", text: "Both need safety", points: ["Cash needs care", "Online needs passwords", "Equal vigilance"], isCorrect: true },
        { id: "online", text: "Online is safer", points: ["Strong passwords", "Encryption", "Trackable"], isCorrect: false }
      ],
      reflection: "Strong safety practices are key for both."
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
      title="Debate: Cash vs Online Safety"
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
      gameId="finance-teens-176"
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
            <h3 className="text-3xl font-bold mb-4">Payment Safety Debate Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Both cash and online need safety!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateCashVsOnlineSafety;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateSaveVsInvest = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const debateTopics = [
    {
      id: 1,
      scenario: "Is saving enough or should we invest too?",
      positions: [
        { id: "invest", text: "Invest wisely", points: ["Higher returns", "Beats inflation", "Grows wealth"], isCorrect: true },
        { id: "save", text: "Saving is enough", points: ["Safe", "No risk", "Accessible"], isCorrect: false }
      ],
      reflection: "Investing wisely grows wealth faster than saving alone."
    },
    {
      id: 2,
      scenario: "Should teens focus only on saving?",
      positions: [
        { id: "invest", text: "No, learn investing", points: ["Builds wealth", "Learn early", "Diversify"], isCorrect: true },
        { id: "save", text: "Yes, only save", points: ["No loss", "Safe option", "Simple"], isCorrect: false }
      ],
      reflection: "Learning to invest early helps teens grow wealth."
    },
    {
      id: 3,
      scenario: "Is saving better than investing for emergencies?",
      positions: [
        { id: "save", text: "Yes, save for emergencies", points: ["Quick access", "No risk", "Reliable"], isCorrect: true },
        { id: "invest", text: "No, invest for emergencies", points: ["Higher returns", "Grows funds", "Risky"], isCorrect: false }
      ],
      reflection: "Savings are best for emergency funds due to accessibility."
    },
    {
      id: 4,
      scenario: "Can investing beat inflation?",
      positions: [
        { id: "invest", text: "Yes, investing helps", points: ["Outpaces inflation", "Grows wealth", "Long-term"], isCorrect: true },
        { id: "save", text: "No, saving is enough", points: ["Stable", "No risk", "Loses value"], isCorrect: false }
      ],
      reflection: "Investing can protect money from losing value to inflation."
    },
    {
      id: 5,
      scenario: "Is saving or investing better for goals?",
      positions: [
        { id: "invest", text: "Invest for big goals", points: ["Higher returns", "Long-term growth", "Strategic"], isCorrect: true },
        { id: "save", text: "Save for all goals", points: ["Safe", "Guaranteed", "Slower"], isCorrect: false }
      ],
      reflection: "Investing is better for long-term financial goals."
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
      title="Debate: Save vs Invest"
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
      gameId="finance-teens-136"
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
            <h3 className="text-3xl font-bold mb-4">Save vs Invest Debate Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Invest wisely to grow wealth!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateSaveVsInvest;
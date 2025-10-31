import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateMoneyAndMorals = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const debateTopics = [
    {
      id: 1,
      scenario: "Does money test character?",
      positions: [
        { id: "ethics", text: "Yes, ethics matter more", points: ["Honesty over gain", "Morals guide choices", "Integrity first"], isCorrect: true },
        { id: "money", text: "No, money is neutral", points: ["Money is just a tool", "No moral impact", "Depends on use"], isCorrect: false }
      ],
      reflection: "Money tests character; ethics should guide decisions."
    },
    {
      id: 2,
      scenario: "Does wealth affect moral choices?",
      positions: [
        { id: "ethics", text: "Yes, ethics are key", points: ["Wealth tempts", "Stay honest", "Values matter"], isCorrect: true },
        { id: "wealth", text: "No, wealth is fine", points: ["Money doesn’t change morals", "Choices are same", "Neutral"], isCorrect: false }
      ],
      reflection: "Wealth can challenge ethics, but morals should prevail."
    },
    {
      id: 3,
      scenario: "Can money buy integrity?",
      positions: [
        { id: "ethics", text: "No, ethics are priceless", points: ["Integrity can’t be bought", "Honesty is core", "Values first"], isCorrect: true },
        { id: "money", text: "Yes, money influences", points: ["Money sways choices", "Can buy loyalty", "Practical"], isCorrect: false }
      ],
      reflection: "Integrity cannot be purchased; ethics matter."
    },
    {
      id: 4,
      scenario: "Does financial gain justify unethical acts?",
      positions: [
        { id: "ethics", text: "No, ethics matter more", points: ["Honesty over profit", "Morals guide", "Long-term trust"], isCorrect: true },
        { id: "gain", text: "Yes, gain is key", points: ["Profit drives choices", "Ethics are flexible", "Money first"], isCorrect: false }
      ],
      reflection: "Ethics should always outweigh financial gain."
    },
    {
      id: 5,
      scenario: "Is money a test of moral strength?",
      positions: [
        { id: "ethics", text: "Yes, morals matter", points: ["Money tempts", "Ethics hold firm", "Character shines"], isCorrect: true },
        { id: "money", text: "No, money is neutral", points: ["Money doesn’t test", "Choices are same", "No impact"], isCorrect: false }
      ],
      reflection: "Money tests morals; stay true to ethics."
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
      title="Debate: Money & Morals"
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
      gameId="finance-teens-196"
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
            <h3 className="text-3xl font-bold mb-4">Money & Morals Debate Master!</h3>
            <p className="text-white/90 text-lg mb-6">You scored {score} coins!</p>
            <div className="bg-green-500 py-3 px-6 rounded-full inline-flex items-center gap-2">
              +{score} Coins
            </div>
            <p className="text-white/80 mt-4">Lesson: Ethics matter more than money!</p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateMoneyAndMorals;
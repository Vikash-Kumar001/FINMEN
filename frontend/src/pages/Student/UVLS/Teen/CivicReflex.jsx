import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CivicReflex = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const cards = [
    {
      id: 1,
      prompt: "Broken playground equipment.",
      urgent: true
    },
    {
      id: 2,
      prompt: "Litter in park.",
      urgent: false
    },
    {
      id: 3,
      prompt: "Unsafe crossing.",
      urgent: true
    },
    {
      id: 4,
      prompt: "Faded signs.",
      urgent: false
    },
    {
      id: 5,
      prompt: "Bullying incident.",
      urgent: true
    }
  ];

  const handleFlag = () => {
    const card = cards[currentCard];
    if (card.urgent) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setFlagged(true);
    proceedToNext();
  };

  const handleRoutine = () => {
    const card = cards[currentCard];
    if (!card.urgent) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    setFlagged(true);
    proceedToNext();
  };

  const proceedToNext = () => {
    setTimeout(() => {
      setFlagged(false);
      if (currentCard < cards.length - 1) {
        setCurrentCard(prev => prev + 1);
      } else {
        const percentage = (score / cards.length) * 100;
        if (percentage >= 75) {
          setCoins(3);
        }
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Civic Reflex"
      subtitle={`Card ${currentCard + 1} of ${cards.length}`}
      onNext={handleNext}
      nextEnabled={showResult && (score / cards.length * 100 >= 75)}
      showGameOver={showResult && (score / cards.length * 100 >= 75)}
      score={coins}
      gameId="civic-189"
      gameType="civic"
      totalLevels={10}
      currentLevel={9}
      showConfetti={showResult && (score / cards.length * 100 >= 75)}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6 text-center">"{cards[currentCard].prompt}"</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleFlag}
                  className="py-3 rounded-xl font-bold text-white bg-red-500 hover:opacity-90"
                >
                  Urgent!
                </button>
                <button
                  onClick={handleRoutine}
                  className="py-3 rounded-xl font-bold text-white bg-green-500 hover:opacity-90"
                >
                  Routine
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Reflex Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Score: {score} / {cards.length} ({(score / cards.length * 100).toFixed(0)}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(score / cards.length * 100 >= 75) ? "Earned 3 Coins!" : "Aim for 75%."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Train observation skills.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CivicReflex;
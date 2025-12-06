import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const HygieneMatch = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-4";

  const [coins, setCoins] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  // Hardcoded board layout (pseudo-shuffled)
  // 5 pairs: 
  // 1. Toothbrush (A) - Teeth (B)
  // 2. Soap (C) - Bath (D)
  // 3. Comb (E) - Hair (F)
  // 4. Towel (G) - Dry (H)
  // 5. Nailcutter (I) - Nails (J)

  const gridItems = [
    { id: 'soap', emoji: '🧼', matchId: 'bath', name: 'Soap' },
    { id: 'comb', emoji: '💇‍♀️', matchId: 'hair', name: 'Comb' },
    { id: 'bath', emoji: '🚿', matchId: 'soap', name: 'Bath' },
    { id: 'toothbrush', emoji: '🪥', matchId: 'teeth', name: 'Toothbrush' },
    { id: 'nails', emoji: '💅', matchId: 'nailcutter', name: 'Nails' },
    { id: 'dry', emoji: '🧽', matchId: 'towel', name: 'Dry' },
    { id: 'hair', emoji: '💇', matchId: 'comb', name: 'Hair' },
    { id: 'nailcutter', emoji: '✂️', matchId: 'nails', name: 'Trimmer' },
    { id: 'towel', emoji: '🧺', matchId: 'dry', name: 'Towel' },
    { id: 'teeth', emoji: '🦷', matchId: 'toothbrush', name: 'Teeth' },
  ];

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      const firstItem = gridItems[firstIndex];
      const secondItem = gridItems[secondIndex];

      if (firstItem.matchId === secondItem.id) {
        // Match found
        setMatched(prev => [...prev, firstItem.id, secondItem.id]);
        setFlipped([]);
        setCoins(prev => prev + 1); // 1 coin per pair match
        showCorrectAnswerFeedback(1, true);

        // Check completion (5 pairs = 10 items)
        if (matched.length + 2 === gridItems.length) {
          setGameCompleted(true);
          setShowConfetti(true);
          // Removed incorrect call to showAnswerConfetti()
        }
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped, matched]);

  const handleCardClick = (index) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(gridItems[index].id) ||
      gameCompleted
    ) {
      return;
    }
    setFlipped(prev => [...prev, index]);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  return (
    <GameShell
      title="Hygiene Match"
      subtitle={`Pairs Matched: ${matched.length / 2} / 5`}
      onNext={handleNext}
      nextEnabled={gameCompleted}
      showGameOver={gameCompleted}
      score={coins}
      gameId={gameId}
      gameType="health-female"
      totalLevels={5}
      currentLevel={Math.min((matched.length / 2) + 1, 5)}
      showConfetti={showConfetti}
      showAnswerConfetti={showAnswerConfetti}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">Find matching pairs!</div>
            <div className="text-yellow-400 font-bold">Coins: {coins}/{totalCoins}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-full max-w-4xl mx-auto">
            {gridItems.map((item, index) => {
              const isFlipped = flipped.includes(index);
              const isMatched = matched.includes(item.id);

              let cardClass = "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"; // Default back
              if (isFlipped || isMatched) {
                cardClass = "bg-white text-gray-900 ring-4 ring-blue-400"; // Face up
                if (isMatched) cardClass = "bg-green-100 text-green-900 ring-4 ring-green-500";
              }

              return (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleCardClick(index)}
                  disabled={isFlipped || isMatched}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform ${isMatched ? '' : 'hover:scale-105 active:scale-95'} ${cardClass} shadow-xl`}
                >
                  {isFlipped || isMatched ? (
                    <>
                      <span className="text-4xl mb-2">{item.emoji}</span>
                      <span className="text-xs font-bold px-2 py-1 bg-black/5 rounded-full">{item.name}</span>
                    </>
                  ) : (
                    <span className="text-4xl opacity-50">?</span>
                  )}
                </button>
              );
            })}
          </div>

          {flipped.length === 2 && (
            <div className="mt-4 text-center h-6 text-white/80 font-medium">
              {gridItems[flipped[0]].matchId === gridItems[flipped[1]].id
                ? "Match Found! 🎉"
                : "Try Again..."}
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default HygieneMatch;

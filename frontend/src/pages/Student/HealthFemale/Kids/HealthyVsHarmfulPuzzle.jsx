import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const HealthyVsHarmfulPuzzle = () => {
  const navigate = useNavigate();
  const [pairs, setPairs] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { showAnswerConfetti } = useGameFeedback();

  const items = [
    { id: 'apple', emoji: '🍎', match: 'healthy', description: 'Apples are nutritious and healthy' },
    { id: 'healthy', emoji: '✅', match: 'apple', description: 'Apples are healthy choices' },
    { id: 'tobacco', emoji: '🚬', match: 'harmful', description: 'Tobacco is harmful to health' },
    { id: 'harmful', emoji: '❌', match: 'tobacco', description: 'Tobacco causes serious health problems' },
    { id: 'water', emoji: '💧', match: 'healthy', description: 'Water is essential for health' },
    { id: 'healthy2', emoji: '✅', match: 'water', description: 'Water is a healthy choice' },
    { id: 'alcohol', emoji: '🍺', match: 'harmful', description: 'Alcohol can be harmful' },
    { id: 'harmful2', emoji: '❌', match: 'alcohol', description: 'Alcohol can cause health problems' },
    { id: 'vegetables', emoji: '🥦', match: 'healthy', description: 'Vegetables are nutritious' },
    { id: 'healthy3', emoji: '✅', match: 'vegetables', description: 'Vegetables are healthy choices' }
  ];

  // Shuffle function
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game
  useEffect(() => {
    // Start the game automatically when component mounts
    const startGame = () => {
      const shuffledItems = shuffle([...items]);
      setPairs(shuffledItems);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameCompleted(false);
      setGameStarted(true);
    };
    
    startGame();
    
    // Cleanup function
    return () => {
      setGameStarted(false);
    };
  }, []);

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = flipped;
      const firstItem = pairs[firstIndex];
      const secondItem = pairs[secondIndex];

      if (firstItem.match === secondItem.id) {
        setMatched(prev => [...prev, firstItem.id, secondItem.id]);
        setFlipped([]);
        
        // Check if game is completed
        if (matched.length + 2 === items.length) {
          setTimeout(() => {
            setGameCompleted(true);
            showAnswerConfetti();
          }, 500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  }, [flipped, pairs, matched, items.length]);

  const handleCardClick = (index) => {
    // Don't allow clicking already matched or flipped cards
    if (
      flipped.length === 2 || 
      flipped.includes(index) || 
      matched.includes(pairs[index].id) ||
      gameCompleted
    ) {
      return;
    }

    // Flip the card
    setFlipped(prev => [...prev, index]);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  if (!gameStarted) {
    return (
      <GameShell
        title="Puzzle: Healthy vs Harmful"
        subtitle="Loading..."
        backPath="/games/health-female/kids"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="text-6xl mb-4">🧩</div>
            <p className="text-white">Preparing your game...</p>
          </div>
        </div>
      </GameShell>
    );
  }

  if (gameCompleted) {
    return (
      <GameShell
        title="Puzzle: Healthy vs Harmful"
        subtitle="Congratulations!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={Math.max(5 - Math.floor(moves / 2), 1)}
        gameId="health-female-kids-84"
        gameType="health-female"
        totalLevels={90}
        currentLevel={84}
        showConfetti={true}
        backPath="/games/health-female/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">You Did It!</h2>
          <p className="text-white/80 mb-6">
            You completed the game in {moves} moves!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-8">
            You earned {Math.max(5 - Math.floor(moves / 2), 1)} coins!
          </div>
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Puzzle: Healthy vs Harmful"
      subtitle={`Moves: ${moves} | Matches: ${matched.length / 2} of ${pairs.length / 2}`}
      backPath="/games/health-female/kids"
    >
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-4xl mx-auto p-4">
          {pairs.map((item, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(item.id);
            const isMatched = matched.includes(item.id);
            
            return (
              <div 
                key={`${item.id}-${index}`}
                onClick={() => handleCardClick(index)}
                className={`aspect-square flex items-center justify-center text-4xl cursor-pointer rounded-2xl transition-all duration-300 transform ${
                  isFlipped 
                    ? isMatched 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg scale-95' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-95' 
                    : 'bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 shadow-md hover:shadow-lg scale-100'
                } ${isFlipped ? '' : 'hover:scale-105'}`}
              >
                {isFlipped ? (
                  <div className="text-center p-2 text-white">
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                      {item.id === 'apple' ? 'Apple' : 
                       item.id === 'healthy' ? 'Healthy' :
                       item.id === 'tobacco' ? 'Tobacco' :
                       item.id === 'harmful' ? 'Harmful' :
                       item.id === 'water' ? 'Water' :
                       item.id === 'healthy2' ? 'Healthy' :
                       item.id === 'alcohol' ? 'Alcohol' :
                       item.id === 'harmful2' ? 'Harmful' :
                       item.id === 'vegetables' ? 'Vegetables' : 'Healthy'}
                    </div>
                  </div>
                ) : (
                  <div className="text-4xl bg-white/10 p-4 rounded-xl">
                    <span className="opacity-70">?</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {flipped.length === 2 && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg text-center max-w-md mx-auto">
            <p className="text-sm text-white/80">
              {pairs[flipped[0]].id === pairs[flipped[1]].match 
                ? 'Match found! ' + pairs[flipped[0]].description 
                : 'Not a match. Try again!'}
            </p>
          </div>
        )}
        
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={resetGame}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Restart Game
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default HealthyVsHarmfulPuzzle;
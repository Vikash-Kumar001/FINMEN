import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyMatchPuzzle = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedSafety, setSelectedSafety] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      safetyItem: "Seatbelt",
      emoji: "🦺",
      description: "What do you use a seatbelt for?",
      matches: [
        { id: "car", text: "Car rides", emoji: "🚗", isCorrect: true },
        { id: "bike", text: "Bike rides", emoji: "🚲", isCorrect: false },
        { id: "walk", text: "Walking", emoji: "🚶", isCorrect: false }
      ]
    },
    {
      id: 2,
      safetyItem: "Helmet",
      emoji: "⛑️",
      description: "When do you wear a helmet?",
      matches: [
        { id: "bike2", text: "Bike rides", emoji: "🚲", isCorrect: true },
        { id: "car2", text: "Car rides", emoji: "🚗", isCorrect: false },
        { id: "swim", text: "Swimming", emoji: "🏊", isCorrect: false }
      ]
    },
    {
      id: 3,
      safetyItem: "Soap",
      emoji: "🧼",
      description: "What do you use soap for?",
      matches: [
        { id: "hands", text: "Washing hands", emoji: "👐", isCorrect: true },
        { id: "dishes", text: "Washing dishes", emoji: "🍽️", isCorrect: false },
        { id: "carwash", text: "Washing car", emoji: "🚗", isCorrect: false }
      ]
    },
    {
      id: 4,
      safetyItem: "Bandage",
      emoji: "🩹",
      description: "When do you use a bandage?",
      matches: [
        { id: "cut", text: "Covering cuts", emoji: "🤕", isCorrect: true },
        { id: "burn", text: "Covering burns", emoji: "🔥", isCorrect: false },
        { id: "clean", text: "Cleaning", emoji: "🧽", isCorrect: false }
      ]
    },
    {
      id: 5,
      safetyItem: "Crosswalk",
      emoji: "🚶‍♂️",
      description: "Where do you use a crosswalk?",
      matches: [
        { id: "street", text: "Crossing street", emoji: "🛣️", isCorrect: true },
        { id: "park", text: "In the park", emoji: "🌳", isCorrect: false },
        { id: "home", text: "At home", emoji: "🏠", isCorrect: false }
      ]
    }
  ];

  const handleSafetySelect = (matchId) => {
    const currentP = puzzles[currentPuzzle];
    const selectedMatch = currentP.matches.find(m => m.id === matchId);
    const isCorrect = selectedMatch.isCorrect;

    if (isCorrect && !matchedPairs.includes(currentPuzzle)) {
      setCoins(prev => prev + 1);
      setMatchedPairs(prev => [...prev, currentPuzzle]);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedSafety(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/sickness-story");
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];

  return (
    <GameShell
      title="Safety Match Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-74"
      gameType="health-male"
      totalLevels={80}
      currentLevel={74}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().safetyItem}</h3>
            <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
            <p className="text-white text-lg">Match this safety item to the right activity!</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentPuzzle().matches.map(match => {
              const isCorrect = match.isCorrect;
              const isMatched = matchedPairs.includes(currentPuzzle);

              return (
                <button
                  key={match.id}
                  onClick={() => handleSafetySelect(match.id)}
                  disabled={isMatched}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isMatched
                      ? isCorrect
                        ? 'bg-green-100/20 border-green-500 text-white'
                        : 'bg-red-100/20 border-red-500 text-white'
                      : 'bg-blue-100/20 border-blue-500 text-white hover:bg-blue-200/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`text-3xl mr-4 ${isMatched && isCorrect ? 'opacity-100' : 'opacity-60'}`}>
                        {match.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isMatched && isCorrect ? 'text-green-300' : 'text-white'}`}>
                          {isMatched && isCorrect ? '✅ ' : isMatched && !isCorrect ? '❌ ' : '☐ '}{match.text}
                        </h3>
                      </div>
                    </div>
                    {isMatched && isCorrect && (
                      <div className="text-2xl">🎉</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-8xl mb-4">🧩</div>
                <h3 className="text-3xl font-bold text-white mb-2">Puzzle Master!</h3>
                <p className="text-white/90 mb-4 text-lg">
                  You matched all safety items perfectly! You understand how to stay safe in different situations!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">SAFETY PUZZLER</div>
                </div>
                <p className="text-white/80">
                  Great job connecting safety tools to their proper uses! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default SafetyMatchPuzzle;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DailyMatchPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const puzzles = [
    {
      id: 1,
      activity: "Sleep",
      emoji: "😴",
      description: "What does sleep give you?",
      benefits: [
        { id: "energy", text: "Energy", emoji: "⚡", isCorrect: true },
        { id: "strength", text: "Strength", emoji: "💪", isCorrect: false },
        { id: "growth", text: "Growth", emoji: "📏", isCorrect: false }
      ]
    },
    {
      id: 2,
      activity: "Food",
      emoji: "🍎",
      description: "What does eating healthy food give you?",
      benefits: [
        { id: "strength2", text: "Strength", emoji: "💪", isCorrect: true },
        { id: "energy2", text: "Energy", emoji: "⚡", isCorrect: false },
        { id: "knowledge", text: "Knowledge", emoji: "🧠", isCorrect: false }
      ]
    },
    {
      id: 3,
      activity: "Study",
      emoji: "📚",
      description: "What does studying help you with?",
      benefits: [
        { id: "growth3", text: "Growth", emoji: "📏", isCorrect: true },
        { id: "strength3", text: "Strength", emoji: "💪", isCorrect: false },
        { id: "energy3", text: "Energy", emoji: "⚡", isCorrect: false }
      ]
    },
    {
      id: 4,
      activity: "Exercise",
      emoji: "🏃",
      description: "What does exercise build?",
      benefits: [
        { id: "strength4", text: "Strength", emoji: "💪", isCorrect: true },
        { id: "knowledge4", text: "Knowledge", emoji: "🧠", isCorrect: false },
        { id: "energy4", text: "Energy", emoji: "⚡", isCorrect: false }
      ]
    },
    {
      id: 5,
      activity: "Reading",
      emoji: "📖",
      description: "What does reading improve?",
      benefits: [
        { id: "knowledge5", text: "Knowledge", emoji: "🧠", isCorrect: true },
        { id: "strength5", text: "Strength", emoji: "💪", isCorrect: false },
        { id: "growth5", text: "Growth", emoji: "📏", isCorrect: false }
      ]
    }
  ];

  const handleBenefitSelect = (benefitId) => {
    const currentP = puzzles[currentPuzzle];
    const selectedBen = currentP.benefits.find(b => b.id === benefitId);
    const isCorrect = selectedBen.isCorrect;

    if (isCorrect && !matchedPairs.includes(currentPuzzle)) {
      setCoins(prev => prev + 1);
      setMatchedPairs(prev => [...prev, currentPuzzle]);
      showCorrectAnswerFeedback(1, true);

      setTimeout(() => {
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setSelectedBenefit(null);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/sleep-story");
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];

  return (
    <GameShell
      title="Daily Match Puzzle"
      subtitle={`Puzzle ${currentPuzzle + 1} of ${puzzles.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-kids-94"
      gameType="health-male"
      totalLevels={100}
      currentLevel={94}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
    
      maxScore={100} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Puzzle {currentPuzzle + 1}/{puzzles.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{getCurrentPuzzle().emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{getCurrentPuzzle().activity}</h3>
            <p className="text-white/90 mb-6">{getCurrentPuzzle().description}</p>
            <p className="text-white text-lg">Match this activity to what it gives you!</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getCurrentPuzzle().benefits.map(benefit => {
              const isCorrect = benefit.isCorrect;
              const isMatched = matchedPairs.includes(currentPuzzle);

              return (
                <button
                  key={benefit.id}
                  onClick={() => handleBenefitSelect(benefit.id)}
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
                        {benefit.emoji}
                      </div>
                      <div className="text-left">
                        <h3 className={`font-bold text-lg ${isMatched && isCorrect ? 'text-green-300' : 'text-white'}`}>
                          {isMatched && isCorrect ? '✅ ' : isMatched && !isCorrect ? '❌ ' : '☐ '}{benefit.text}
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
                  You matched all daily activities to their benefits perfectly! You understand how habits help you grow!
                </p>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 inline-block mb-4">
                  <div className="text-white font-bold text-xl">HABIT PUZZLER</div>
                </div>
                <p className="text-white/80">
                  Great job understanding how daily habits build a healthy life! 🌟
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default DailyMatchPuzzle;

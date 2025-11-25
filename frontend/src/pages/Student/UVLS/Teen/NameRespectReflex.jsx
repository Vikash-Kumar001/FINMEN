import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NameRespectReflex = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-19";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [gameStarted, setGameStarted] = useState(false);
  const [currentName, setCurrentName] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const names = [
    {
      id: 1,
      name: "Nguyen",
      origin: "Vietnamese",
      pronunciations: [
        { id: 1, text: "WIN (rhymes with 'win')", isCorrect: true },
        { id: 2, text: "NOO-GEN", isCorrect: false },
        { id: 3, text: "NAY-GEN", isCorrect: false }
      ]
    },
    {
      id: 2,
      name: "Siobhan",
      origin: "Irish",
      pronunciations: [
        { id: 1, text: "SEE-OH-BHAN", isCorrect: false },
        { id: 2, text: "shi-VAWN", isCorrect: true },
        { id: 3, text: "SYE-OH-BAN", isCorrect: false }
      ]
    },
    {
      id: 3,
      name: "Xochitl",
      origin: "Nahuatl (Mexican)",
      pronunciations: [
        { id: 1, text: "ZOH-cheel", isCorrect: false },
        { id: 2, text: "EX-oh-chittle", isCorrect: false },
        { id: 3, text: "SO-cheel", isCorrect: true }
      ]
    },
    {
      id: 4,
      name: "Saoirse",
      origin: "Irish",
      pronunciations: [
        { id: 1, text: "SIR-sha", isCorrect: true },
        { id: 2, text: "SAY-ohr-say", isCorrect: false },
        { id: 3, text: "SOW-ear-see", isCorrect: false }
      ]
    },
    {
      id: 5,
      name: "Rajesh",
      origin: "Indian",
      pronunciations: [
        { id: 1, text: "RAJ-esh (with soft 'j')", isCorrect: true },
        { id: 2, text: "RA-jess", isCorrect: false },
        { id: 3, text: "RAGE-esh", isCorrect: false }
      ]
    }
  ];

  const currentNameData = names[currentName];

  const handlePronunciation = (pronunciationId) => {
    const pronunciation = currentNameData.pronunciations.find(p => p.id === pronunciationId);
    const isCorrect = pronunciation.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentName < names.length - 1) {
      setTimeout(() => {
        setCurrentName(prev => prev + 1);
      }, 500);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      setScore(finalScore);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setGameStarted(false);
    setCurrentName(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/policy-case-puzzle");
  };

  const accuracy = Math.round((score / names.length) * 100);

  return (
    <GameShell
      title="Name Respect Reflex"
      subtitle={gameStarted ? `Name ${currentName + 1} of ${names.length}` : "Pronunciation Game"}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 80}
      showGameOver={showResult && accuracy >= 80}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-19"
      gameType="uvls"
      totalLevels={20}
      currentLevel={18}
      showConfetti={showResult && accuracy >= 80}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!gameStarted ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Name Respect Challenge!</h2>
            <p className="text-white/80 mb-6">Learn to pronounce names correctly - it's a sign of respect! 🌍</p>
            <div className="bg-blue-500/20 rounded-lg p-3 mb-6">
              <p className="text-white/80 text-sm">
                💡 Names are part of our identity. Correct pronunciation shows we value each person.
              </p>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:opacity-90 transition transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        ) : !showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/80">Name {currentName + 1}/{names.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-6 mb-6">
                <p className="text-white/70 text-sm mb-2">Name from {currentNameData.origin}:</p>
                <p className="text-white text-4xl font-bold text-center">{currentNameData.name}</p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">How do you pronounce it?</p>
              
              <div className="space-y-3">
                {currentNameData.pronunciations.map(pronunciation => (
                  <button
                    key={pronunciation.id}
                    onClick={() => handlePronunciation(pronunciation.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102"
                  >
                    <div className="text-white font-medium text-center">{pronunciation.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {accuracy >= 80 ? "🎉 Name Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You got {score} out of {names.length} correct ({accuracy}%)
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {accuracy >= 80 ? "You earned 3 Coins! 🪙" : "Get 80% or higher to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use real student names if consented. Celebrate diverse names in class!
            </p>
            {accuracy < 80 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NameRespectReflex;


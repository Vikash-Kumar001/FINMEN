import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ChallengeStereotypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-29";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [challenges, setChallenges] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedStatements, setSelectedStatements] = useState([]); // State for tracking selected statements
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      statements: [
        { text: "Girls can't be strong.", challenges: true },
        { text: "Boys can be nurses.", challenges: true },
        { text: "Everyone can cook.", challenges: true },
        { text: "Pink is for girls.", challenges: false }
      ]
    },
    {
      id: 2,
      statements: [
        { text: "Boys don't play with dolls.", challenges: false },
        { text: "Girls can be leaders.", challenges: true },
        { text: "Anyone can cry.", challenges: true },
        { text: "Dads can stay home.", challenges: true }
      ]
    },
    {
      id: 3,
      statements: [
        { text: "Moms must cook.", challenges: false },
        { text: "Kids can choose toys freely.", challenges: true },
        { text: "Girls play sports too.", challenges: true },
        { text: "Boys like blue only.", challenges: false }
      ]
    },
    {
      id: 4,
      statements: [
        { text: "Engineers can be women.", challenges: true },
        { text: "Teachers can be men.", challenges: true },
        { text: "Stereotypes are wrong.", challenges: true },
        { text: "Girls are weak.", challenges: false }
      ]
    },
    {
      id: 5,
      statements: [
        { text: "Anyone can dance.", challenges: true },
        { text: "Boys can't sew.", challenges: false },
        { text: "Equality for all.", challenges: true },
        { text: "Girls don't like cars.", challenges: false }
      ]
    }
  ];

  // Function to toggle statement selection
  const toggleStatementSelection = (index) => {
    setSelectedStatements(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleChallenge = () => {
    const newChallenges = [...challenges, selectedStatements];
    setChallenges(newChallenges);

    const correctChallenges = questions[currentLevel].statements.filter(s => s.challenges).length;
    const isCorrect = selectedStatements.length === correctChallenges && selectedStatements.every(s => questions[currentLevel].statements[s].challenges);
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedStatements([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newChallenges.filter((sel, idx) => {
        const corr = questions[idx].statements.filter(s => s.challenges).length;
        return sel.length === corr && sel.every(s => questions[idx].statements[s].challenges);
      }).length;
      setFinalScore(correctLevels);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setChallenges([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedStatements([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Challenge Stereotypes"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-29"
      gameType="uvls"
      totalLevels={30}
      currentLevel={29}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap statements that challenge stereotypes!</p>
              <div className="space-y-3">
                {getCurrentLevel().statements.map((stmt, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleStatementSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedStatements.includes(idx)
                        ? "bg-green-500/30 border-2 border-green-400" // Visual feedback for selected challenging statements
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedStatements.includes(idx) ? "✅" : "🛡️"}
                    </div>
                    <div className="text-white font-medium text-left">{stmt.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleChallenge} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedStatements.length === 0} // Disable if no statements selected
              >
                Submit ({selectedStatements.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Challenger!" : "💪 Challenge More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You challenged correctly in {finalScore} levels!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 3 Coins! 🪙" : "Try again!"}
            </p>
            {finalScore < 3 && (
              <button onClick={handleTryAgain} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ChallengeStereotypes;
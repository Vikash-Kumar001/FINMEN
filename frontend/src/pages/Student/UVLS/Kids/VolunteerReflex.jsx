import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const VolunteerReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "uvls-kids-83";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      needs: [
        { text: "Old lady carry bag", isVolunteer: true },
        { text: "Bird flying", isVolunteer: false },
        { text: "Friend drop book", isVolunteer: true }
      ]
    },
    {
      id: 2,
      needs: [
        { text: "Clean park", isVolunteer: true },
        { text: "Cloud moving", isVolunteer: false },
        { text: "Help teacher", isVolunteer: true }
      ]
    },
    {
      id: 3,
      needs: [
        { text: "Plant tree", isVolunteer: true },
        { text: "Sun shining", isVolunteer: false },
        { text: "Share toy", isVolunteer: true }
      ]
    },
    {
      id: 4,
      needs: [
        { text: "Read to kid", isVolunteer: true },
        { text: "Wind blowing", isVolunteer: false },
        { text: "Pick litter", isVolunteer: true }
      ]
    },
    {
      id: 5,
      needs: [
        { text: "Help neighbor", isVolunteer: true },
        { text: "Rain falling", isVolunteer: false },
        { text: "Donate old clothes", isVolunteer: true }
      ]
    }
  ];

  const handleNeedToggle = (index) => {
    if (selectedNeeds.includes(index)) {
      setSelectedNeeds(selectedNeeds.filter(i => i !== index));
    } else {
      setSelectedNeeds([...selectedNeeds, index]);
    }
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedNeeds];
    setTaps(newTaps);

    const correctVolunteer = questions[currentLevel].needs.filter(n => n.isVolunteer).length;
    const isCorrect = selectedNeeds.length === correctVolunteer && selectedNeeds.every(s => questions[currentLevel].needs[s].isVolunteer);
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedNeeds([]); // Reset for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].needs.filter(n => n.isVolunteer).length;
        return sel.length === corr && sel.every(s => questions[idx].needs[s].isVolunteer);
      }).length;
      setFinalScore(correctLevels);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setTaps([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedNeeds([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Volunteer Reflex"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-83"
      gameType="uvls"
      totalLevels={100}
      currentLevel={83}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap to volunteer for needs!</p>
              <div className="space-y-3">
                {getCurrentLevel().needs.map((need, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleNeedToggle(idx)}
                    className={`w-full p-4 rounded text-left ${selectedNeeds.includes(idx) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {need.text} {selectedNeeds.includes(idx) ? '🤝' : '⬜'}
                  </button>
                ))}
              </div>
              <button onClick={handleTap} className="mt-4 bg-purple-500 text-white p-2 rounded">Submit</button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Volunteer Pro!" : "💪 Volunteer More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You volunteered correctly in {finalScore} levels!
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

export default VolunteerReflex;
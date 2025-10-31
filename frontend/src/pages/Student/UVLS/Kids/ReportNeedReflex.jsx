import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReportNeedReflex = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [taps, setTaps] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedScenes, setSelectedScenes] = useState([]);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenes: [
        { text: "Broken bench", isNeed: true },
        { text: "Green grass", isNeed: false },
        { text: "Litter ground", isNeed: true }
      ]
    },
    {
      id: 2,
      scenes: [
        { text: "Dirty water", isNeed: true },
        { text: "Blue sky", isNeed: false },
        { text: "Fallen sign", isNeed: true }
      ]
    },
    {
      id: 3,
      scenes: [
        { text: "Overgrown bush", isNeed: true },
        { text: "Nice flower", isNeed: false },
        { text: "Cracked sidewalk", isNeed: true }
      ]
    },
    {
      id: 4,
      scenes: [
        { text: "Leaky faucet", isNeed: true },
        { text: "Sunny day", isNeed: false },
        { text: "Noisy street", isNeed: true }
      ]
    },
    {
      id: 5,
      scenes: [
        { text: "Dark light", isNeed: true },
        { text: "Bird singing", isNeed: false },
        { text: "Trash bin full", isNeed: true }
      ]
    }
  ];

  const handleSceneToggle = (index) => {
    if (selectedScenes.includes(index)) {
      setSelectedScenes(selectedScenes.filter(i => i !== index));
    } else {
      setSelectedScenes([...selectedScenes, index]);
    }
  };

  const handleTap = () => {
    const newTaps = [...taps, selectedScenes];
    setTaps(newTaps);

    const correctNeeds = questions[currentLevel].scenes.filter(s => s.isNeed).length;
    const isCorrect = selectedScenes.length === correctNeeds && 
      selectedScenes.every(idx => questions[currentLevel].scenes[idx].isNeed);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedScenes([]); // Reset for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newTaps.filter((sel, idx) => {
        const corr = questions[idx].scenes.filter(s => s.isNeed).length;
        return sel.length === corr && sel.every(s => questions[idx].scenes[s].isNeed);
      }).length;
      setFinalScore(correctLevels);
      if (correctLevels >= 3) {
        setCoins(3);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setTaps([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedScenes([]);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Report Need Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-89"
      gameType="uvls"
      totalLevels={100}
      currentLevel={89}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap to flag community needs!</p>
              <div className="space-y-3">
                {getCurrentLevel().scenes.map((scene, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSceneToggle(idx)}
                    className={`w-full p-4 rounded text-left ${selectedScenes.includes(idx) ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    {scene.text} {selectedScenes.includes(idx) ? '🚩' : '⬜'}
                  </button>
                ))}
              </div>
              <button onClick={handleTap} className="mt-4 bg-purple-500 text-white p-2 rounded">Submit</button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Need Reporter!" : "💪 Report More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You reported correctly in {finalScore} levels!
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

export default ReportNeedReflex;
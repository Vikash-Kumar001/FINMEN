import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const StopListenReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedCues, setSelectedCues] = useState([]); // State for tracking selected cues
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      cues: [
        { text: "Bell rings", shouldStop: true },
        { text: "Bird sings", shouldStop: false },
        { text: "Teacher calls", shouldStop: true }
      ]
    },
    {
      id: 2,
      cues: [
        { text: "Friend shouts", shouldStop: true },
        { text: "Wind blows", shouldStop: false },
        { text: "Whistle blows", shouldStop: true }
      ]
    },
    {
      id: 3,
      cues: [
        { text: "Mom says stop", shouldStop: true },
        { text: "Cat meows", shouldStop: false },
        { text: "Alarm sounds", shouldStop: true }
      ]
    },
    {
      id: 4,
      cues: [
        { text: "Light flashes", shouldStop: true },
        { text: "Rain falls", shouldStop: false },
        { text: "Siren wails", shouldStop: true }
      ]
    },
    {
      id: 5,
      cues: [
        { text: "Hand raise", shouldStop: true },
        { text: "Leaf falls", shouldStop: false },
        { text: "Clap hands", shouldStop: true }
      ]
    }
  ];

  // Function to toggle cue selection
  const toggleCueSelection = (index) => {
    setSelectedCues(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleResponse = () => {
    const newResponses = [...responses, selectedCues];
    setResponses(newResponses);

    const correctStop = questions[currentLevel].cues.filter(c => c.shouldStop).length;
    const isCorrect = selectedCues.length === correctStop && selectedCues.every(s => questions[currentLevel].cues[s].shouldStop);
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedCues([]); // Reset selection for next level
      }, isCorrect ? 800 : 0);
    } else {
      const correctLevels = newResponses.filter((sel, idx) => {
        const corr = questions[idx].cues.filter(c => c.shouldStop).length;
        return sel.length === corr && sel.every(s => questions[idx].cues[s].shouldStop);
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
    setResponses([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedCues([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Stop & Listen Reflex"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-63"
      gameType="uvls"
      totalLevels={70}
      currentLevel={63}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Tap to stop and listen on cues!</p>
              <div className="space-y-3">
                {getCurrentLevel().cues.map((cue, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleCueSelection(idx)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedCues.includes(idx)
                        ? "bg-red-500/30 border-2 border-red-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedCues.includes(idx) ? "🛑" : "🔔"}
                    </div>
                    <div className="text-white font-medium text-left">{cue.text}</div>
                  </button>
                ))}
              </div>
              <button 
                onClick={handleResponse} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={selectedCues.length === 0} // Disable if no cues selected
              >
                Submit ({selectedCues.length} selected)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Reflex Listener!" : "💪 Respond More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You responded correctly in {finalScore} levels!
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

export default StopListenReflex;
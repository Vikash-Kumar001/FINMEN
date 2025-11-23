import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CommunicationPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [posters, setPosters] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSteps, setSelectedSteps] = useState([]); // State for tracking selected steps
  const [posterSteps, setPosterSteps] = useState([]); // State for tracking steps added to poster
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      steps: ["Look", "Listen", "Speak"]
    },
    {
      id: 2,
      steps: ["Greet", "Share", "Ask"]
    },
    {
      id: 3,
      steps: ["Eye contact", "Nod", "Respond"]
    },
    {
      id: 4,
      steps: ["Polite", "Clear", "Kind"]
    },
    {
      id: 5,
      steps: ["Wait turn", "Repeat back", "Thank"]
    }
  ];

  // Function to toggle step selection
  const toggleStepSelection = (step) => {
    setSelectedSteps(prev => {
      if (prev.includes(step)) {
        return prev.filter(s => s !== step);
      } else {
        return [...prev, step];
      }
    });
  };

  // Function to add selected steps to poster
  const addToPoster = () => {
    if (selectedSteps.length > 0) {
      setPosterSteps(prev => [...prev, ...selectedSteps]);
      setSelectedSteps([]); // Clear selection after adding
    }
  };

  const handlePoster = () => {
    const newPosters = [...posters, posterSteps];
    setPosters(newPosters);

    const isComplete = posterSteps.length >= 3;
    if (isComplete) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setPosterSteps([]); // Reset poster for next level
        setSelectedSteps([]); // Reset selection
      }, isComplete ? 800 : 0);
    } else {
      const completePosters = newPosters.filter(sel => sel.length >= 3).length;
      setFinalScore(completePosters);
      if (completePosters >= 3) {
        setCoins(5); // Badge
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setPosters([]);
    setCoins(0);
    setFinalScore(0);
    setPosterSteps([]); // Reset poster
    setSelectedSteps([]); // Reset selection
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Communication Poster"
      score={coins}
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="uvls-kids-66"
      gameType="uvls"
      totalLevels={70}
      currentLevel={66}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Build communication poster!</p>
              
              {/* Available steps to select */}
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Available Steps:</h3>
                <div className="flex flex-wrap gap-2">
                  {getCurrentLevel().steps.map(step => (
                    <button
                      key={step}
                      onClick={() => toggleStepSelection(step)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSteps.includes(step)
                          ? "bg-green-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {step} {selectedSteps.includes(step) ? "✅" : "🗣️"}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add to poster button */}
              <button 
                onClick={addToPoster}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
                disabled={selectedSteps.length === 0}
              >
                Add to Poster ({selectedSteps.length} selected)
              </button>
              
              {/* Poster area */}
              <div className="mt-4 bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-dashed border-white/30 rounded-xl p-4 min-h-40">
                <h3 className="text-white font-medium mb-2">Your Poster:</h3>
                {posterSteps.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {posterSteps.map((step, index) => (
                      <div key={index} className="bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {step} ✨
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70 italic">Add steps to build your poster...</p>
                )}
              </div>
              
              {/* Complete button */}
              <button 
                onClick={handlePoster} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition"
                disabled={posterSteps.length === 0}
              >
                Complete Poster ({posterSteps.length} steps)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Comm Poster!" : "💪 Build More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You completed {finalScore} posters!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned a Badge! 🏅" : "Try again!"}
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

export default CommunicationPoster;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleModelJournal = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [journals, setJournals] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedModel, setSelectedModel] = useState(""); // State for tracking selected role model
  const [fact, setFact] = useState(""); // State for tracking fact input
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      roleModels: ["Malala Yousafzai", "Albert Einstein", "Marie Curie"]
    },
    {
      id: 2,
      roleModels: ["Rosa Parks", "Neil Armstrong", "Wangari Maathai"]
    },
    {
      id: 3,
      roleModels: ["Katherine Johnson", "Stephen Hawking", "Ada Lovelace"]
    },
    {
      id: 4,
      roleModels: ["Serena Williams", "Lionel Messi", "Greta Thunberg"]
    },
    {
      id: 5,
      roleModels: ["Ruth Bader Ginsburg", "Martin Luther King Jr.", "Frida Kahlo"]
    }
  ];

  // Function to select a role model
  const selectModel = (model) => {
    setSelectedModel(model);
  };

  const handleJournal = () => {
    const newJournals = [...journals, { selected: selectedModel, fact }];
    setJournals(newJournals);

    const isValid = selectedModel && fact.trim().length > 0;
    if (isValid) {
      showCorrectAnswerFeedback(1, true);
    }

    if (currentLevel < questions.length - 1) {
      setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
        setSelectedModel(""); // Reset selection for next level
        setFact(""); // Reset fact for next level
      }, isValid ? 800 : 0);
    } else {
      const validJournals = newJournals.filter(j => j.selected && j.fact.trim().length > 0).length;
      setFinalScore(validJournals);
      if (validJournals >= 3) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentLevel(0);
    setJournals([]);
    setCoins(0);
    setFinalScore(0);
    setSelectedModel(""); // Reset selection
    setFact(""); // Reset fact
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  const getCurrentLevel = () => questions[currentLevel];

  return (
    <GameShell
      title="Role Model Journal"
      subtitle={`Question ${currentLevel + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="uvls-kids-27"
      gameType="uvls"
      totalLevels={30}
      currentLevel={27}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-4">Pick a role model and add a fact!</p>
              <div className="space-y-3">
                {getCurrentLevel().roleModels.map(model => (
                  <button 
                    key={model} 
                    onClick={() => selectModel(model)}
                    className={`w-full p-4 rounded transition-all transform hover:scale-102 flex items-center gap-3 ${
                      selectedModel === model
                        ? "bg-green-500/30 border-2 border-green-400" // Visual feedback for selected
                        : "bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40"
                    }`}
                  >
                    <div className="text-2xl">
                      {selectedModel === model ? "✅" : "🌟"}
                    </div>
                    <div className="text-white font-medium text-left">{model}</div>
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Quick fact" 
                className="mt-4 w-full p-3 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={fact}
                onChange={(e) => setFact(e.target.value)}
              />
              <button 
                onClick={handleJournal} 
                className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                disabled={!selectedModel || !fact.trim()} // Disable if no model or fact
              >
                Submit Entry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 3 ? "🎉 Journal Hero!" : "💪 Write More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You journaled {finalScore} role models!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 3 ? "You earned 5 Coins! 🪙" : "Try again!"}
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

export default RoleModelJournal;
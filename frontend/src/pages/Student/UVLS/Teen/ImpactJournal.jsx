import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ImpactJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [baseline, setBaseline] = useState("");
  const [action, setAction] = useState("");
  const [result, setResult] = useState("");
  const [reflection, setReflection] = useState("");
  const [currentField, setCurrentField] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const fields = [
    { prompt: "Enter baseline.", setter: setBaseline },
    { prompt: "Describe action.", setter: setAction },
    { prompt: "Record result.", setter: setResult },
    { prompt: "Reflect.", setter: setReflection }
  ];

  const values = [baseline, action, result, reflection];

  const handleChange = (e) => {
    fields[currentField].setter(e.target.value);
  };

  const handleSubmit = () => {
    if (values[currentField].trim() === "") return;
    showCorrectAnswerFeedback(1, false);
    if (currentField < fields.length - 1) {
      setTimeout(() => {
        setCurrentField(prev => prev + 1);
      }, 1500);
    } else {
      setShowResult(true);
      if (values.every(v => v.trim() !== "")) {
        setCoins(5);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = values.every(v => v.trim() !== "");

  return (
    <GameShell
      title="Impact Journal"
      subtitle={`Field ${currentField + 1} of ${fields.length}`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      gameId="civic-186"
      gameType="civic"
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      currentLevel={6}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">{fields[currentField].prompt}</p>
              
              <textarea
                value={values[currentField]}
                onChange={handleChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Write here..."
              />
              
              <button
                onClick={handleSubmit}
                disabled={values[currentField].trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  values[currentField].trim() !== ""
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Log
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Journal Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Your impact is recorded.
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Emphasize realistic metrics.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ImpactJournal;
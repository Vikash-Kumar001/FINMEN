import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EvidenceJournal = () => {
  const navigate = useNavigate();
  const [decision, setDecision] = useState("");
  const [evidenceList, setEvidenceList] = useState(["", "", "", "", ""]);
  const [currentEvidence, setCurrentEvidence] = useState(0);
  const [reflection, setReflection] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const handleDecisionChange = (e) => {
    setDecision(e.target.value);
  };

  const handleEvidenceChange = (e) => {
    const newEvidence = [...evidenceList];
    newEvidence[currentEvidence] = e.target.value;
    setEvidenceList(newEvidence);
  };

  const handleSubmitEvidence = () => {
    if (evidenceList[currentEvidence].trim() === "") return;
    showCorrectAnswerFeedback(1, false);
    if (currentEvidence < 4) {
      setTimeout(() => {
        setCurrentEvidence(prev => prev + 1);
      }, 1500);
    } else {
      setShowResult(true);
      if (evidenceList.every(e => e.trim() !== "") && reflection.trim() !== "") {
        setCoins(5);
      }
    }
  };

  const handleReflectionChange = (e) => {
    setReflection(e.target.value);
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const isComplete = decision.trim() !== "" && evidenceList.every(e => e.trim() !== "") && reflection.trim() !== "";

  return (
    <GameShell
      title="Evidence Journal"
      subtitle={`Evidence ${currentEvidence + 1} of 5`}
      onNext={handleNext}
      nextEnabled={showResult && isComplete}
      showGameOver={showResult && isComplete}
      score={coins}
      gameId="decision-157"
      gameType="decision"
      totalLevels={10}
      currentLevel={7}
      showConfetti={showResult && isComplete}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              {currentEvidence === 0 && (
                <>
                  <p className="text-white text-xl mb-6">Enter recent decision:</p>
                  <input
                    value={decision}
                    onChange={handleDecisionChange}
                    className="w-full p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                    placeholder="e.g., Choosing a club..."
                  />
                </>
              )}
              <p className="text-white text-xl mb-6">List evidence {currentEvidence + 1}:</p>
              
              <textarea
                value={evidenceList[currentEvidence]}
                onChange={handleEvidenceChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Evidence used..."
              />
              
              <button
                onClick={handleSubmitEvidence}
                disabled={evidenceList[currentEvidence].trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  evidenceList[currentEvidence].trim() !== ""
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Log Evidence
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Journal Complete!
            </h2>
            <p className="text-white/90 mb-4">Reflect on gaps:</p>
            <textarea
              value={reflection}
              onChange={handleReflectionChange}
              className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
              placeholder="Gaps and plan..."
            />
            <p className="text-yellow-400 text-2xl font-bold mt-6">
              {isComplete ? "Earned 5 Coins!" : "Complete for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Offer peer feedback.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EvidenceJournal;
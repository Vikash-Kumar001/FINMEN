import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateEqualityForAll = () => {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const topic = "Should all students be treated equally?";
  
  const positions = [
    { id: 1, text: "Yes, everyone deserves equal treatment", emoji: "✅", isCorrect: true },
    { id: 2, text: "No, some students deserve more", emoji: "❌", isCorrect: false }
  ];

  const evidenceOptions = [
    { id: 1, text: "Everyone has equal human rights", isStrong: true },
    { id: 2, text: "Discrimination causes harm and division", isStrong: true },
    { id: 3, text: "Some people are naturally superior", isStrong: false },
    { id: 4, text: "Equal opportunity leads to better outcomes", isStrong: true },
    { id: 5, text: "Diversity strengthens communities", isStrong: true }
  ];

  const handlePositionSelect = (positionId) => {
    setSelectedPosition(positionId);
    setEvidence([]);
  };

  const handleEvidenceToggle = (evidenceId) => {
    if (evidence.includes(evidenceId)) {
      setEvidence(evidence.filter(id => id !== evidenceId));
    } else if (evidence.length < 3) {
      setEvidence([...evidence, evidenceId]);
    }
  };

  const handleSubmit = () => {
    const position = positions.find(p => p.id === selectedPosition);
    const selectedEvidence = evidenceOptions.filter(e => evidence.includes(e.id));
    const hasStrongEvidence = selectedEvidence.filter(e => e.isStrong).length >= 2;
    
    if (position?.isCorrect && hasStrongEvidence) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
    }
    
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setSelectedPosition(null);
    setEvidence([]);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/teen/journal-of-inclusion");
  };

  const position = positions.find(p => p.id === selectedPosition);
  const isCorrect = position?.isCorrect && evidenceOptions.filter(e => evidence.includes(e.id) && e.isStrong).length >= 2;

  return (
    <GameShell
      title="Debate: Equality for All?"
      subtitle="Argue for Equal Treatment"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-16"
      gameType="crgc"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⚖️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Debate Topic</h2>
            <p className="text-xl text-gray-700 font-semibold">{topic}</p>
          </div>
        </div>

        {!showFeedback && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Position:</h3>
              <div className="grid gap-4">
                {positions.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => handlePositionSelect(pos.id)}
                    className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      selectedPosition === pos.id
                        ? 'border-amber-500 bg-amber-100 shadow-lg'
                        : 'border-gray-300 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{pos.emoji}</span>
                      <span className="text-lg font-medium text-gray-800">{pos.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedPosition && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Select 3 pieces of evidence:
                </h3>
                <div className="space-y-3">
                  {evidenceOptions.map((evi) => (
                    <button
                      key={evi.id}
                      onClick={() => handleEvidenceToggle(evi.id)}
                      disabled={!evidence.includes(evi.id) && evidence.length >= 3}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        evidence.includes(evi.id)
                          ? 'border-amber-500 bg-amber-100 shadow-md'
                          : 'border-gray-300 bg-white hover:border-amber-300'
                      } ${!evidence.includes(evi.id) && evidence.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-gray-800">{evi.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || evidence.length !== 3}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                selectedPosition && evidence.length === 3
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Debate
            </button>
          </div>
        )}

        {showFeedback && (
          <div className={`p-8 rounded-2xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className="text-6xl mb-4">{isCorrect ? '🏆' : '💭'}</div>
              <h3 className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Excellent Argument!' : 'Rethink Your Position'}
              </h3>
              <p className="text-lg text-gray-700">
                {isCorrect 
                  ? 'Perfect! All students deserve equal treatment. Equality is a fundamental human right that benefits everyone!'
                  : 'Consider this: Treating all students equally creates a fair and just society. Everyone deserves the same opportunities and respect.'}
              </p>
              {!isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="mt-4 px-8 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all transform hover:scale-105"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateEqualityForAll;


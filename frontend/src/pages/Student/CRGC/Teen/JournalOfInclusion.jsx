import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const JournalOfInclusion = () => {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const prompt = "One time I included someone new was...";

  const handleSubmit = () => {
    if (journalEntry.trim().length >= 20) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    navigate("/student/civic-responsibility/teen/simulation-school-event");
  };

  return (
    <GameShell
      title="Journal of Inclusion"
      subtitle="Reflect on Including Others"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="crgc-teen-17"
      gameType="crgc"
      totalLevels={20}
      currentLevel={17}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Inclusion Journal</h2>
            <p className="text-lg text-gray-700">{prompt}</p>
          </div>
        </div>

        {!showFeedback ? (
          <div className="space-y-6">
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write about a time you included someone new... (minimum 20 characters)"
              className="w-full h-48 p-6 border-2 border-teal-300 rounded-xl text-lg resize-none focus:border-teal-500 focus:outline-none"
            />
            
            <div className="text-sm text-gray-600 text-center">
              {journalEntry.length} characters (minimum 20 required)
            </div>

            <button
              onClick={handleSubmit}
              disabled={journalEntry.trim().length < 20}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                journalEntry.trim().length >= 20
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Journal Entry
            </button>
          </div>
        ) : (
          <div className="bg-green-50 p-8 rounded-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-green-700 mb-4">Beautiful Reflection!</h3>
              <p className="text-lg text-gray-700 mb-6">
                Thank you for sharing! Including others makes everyone feel valued and builds stronger communities.
              </p>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-gray-800 italic">&quot;{journalEntry}&quot;</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfInclusion;


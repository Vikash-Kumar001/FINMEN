import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateOneCareerOrMany = () => {
  const navigate = useNavigate();
  const [selectedSide, setSelectedSide] = useState(null);
  const [argumentText, setArgumentText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const debateTopic = {
    question: "Should teens pick one career early or explore many options first?",
    sides: [
      { id: 1, position: "Explore many careers first", isCorrect: true },
      { id: 2, position: "Pick one career immediately", isCorrect: false }
    ]
  };

  const handleSubmit = () => {
    if (selectedSide === 1 && argumentText.trim().length >= 20) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setShowResult(true);
    } else if (selectedSide && argumentText.trim().length >= 20) {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedSide(null);
    setArgumentText("");
    setShowResult(false);
    setCoins(0);
  };

  const handleNext = () => {
    navigate("/student/ehe/teen/journal-of-career-choice");
  };

  return (
    <GameShell
      title="Debate: One Career or Many?"
      subtitle="Career Exploration"
      onNext={handleNext}
      nextEnabled={showResult && coins > 0}
      showGameOver={showResult && coins > 0}
      score={coins}
      gameId="ehe-teen-6"
      gameType="educational"
      totalLevels={20}
      currentLevel={6}
      showConfetti={showResult && coins > 0}
      backPath="/games/entrepreneurship/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">⚖️</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Debate Topic:</h3>
            
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center font-semibold">
                {debateTopic.question}
              </p>
            </div>

            <h4 className="text-white font-bold mb-3">Choose your position:</h4>
            <div className="space-y-3 mb-6">
              {debateTopic.sides.map(side => (
                <button
                  key={side.id}
                  onClick={() => setSelectedSide(side.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedSide === side.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold text-center">{side.position}</div>
                </button>
              ))}
            </div>

            <h4 className="text-white font-bold mb-3">Write your argument (min 20 characters):</h4>
            <textarea
              value={argumentText}
              onChange={(e) => setArgumentText(e.target.value)}
              placeholder="Explain why you chose this position..."
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/40 rounded-xl text-white placeholder-white/50 focus:border-purple-400 focus:outline-none mb-4 min-h-[100px]"
            />

            <button
              onClick={handleSubmit}
              disabled={!selectedSide || argumentText.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedSide && argumentText.trim().length >= 20
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{coins > 0 ? "🏆" : "💭"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {coins > 0 ? "Great Debate!" : "Good Try!"}
            </h2>
            
            {coins > 0 ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Exploring multiple careers first helps you discover your true interests and 
                    strengths. You can always specialize later, but early exploration opens more doors!
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-yellow-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    While picking early shows focus, exploring many careers first helps teens understand 
                    their options better. Most successful people try various paths before specializing!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Another Position
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateOneCareerOrMany;


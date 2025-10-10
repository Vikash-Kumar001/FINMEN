import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateObeyOrQuestion = () => {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const topic = "Does respecting elders mean blind obedience?";
  const positions = [
    { id: 1, position: "Yes - never question elders", emoji: "🙇", isCorrect: false },
    { id: 2, position: "No - respect with polite questioning", emoji: "🤝", isCorrect: true }
  ];

  const handleSubmit = () => {
    if (selectedPosition === 2 && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      showCorrectAnswerFeedback(10, true);
      setCoins(10);
      setShowFeedback(true);
    } else if (selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/gratitude-story");
  };

  const selectedPos = positions.find(p => p.id === selectedPosition);

  return (
    <GameShell
      title="Debate: Obey or Question"
      subtitle="Respectful Independence"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="moral-teen-11"
      gameType="moral"
      totalLevels={20}
      currentLevel={11}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Debate Topic</h2>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl font-semibold text-center">{topic}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Position</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {positions.map(pos => (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosition(pos.id)}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedPosition === pos.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{pos.emoji}</div>
                  <div className="text-white font-semibold text-sm text-center">{pos.position}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Build Your Argument (min 30 chars)</h3>
            <textarea
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Provide evidence and reasoning..."
              className="w-full h-24 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{argument.length}/200</div>

            <h3 className="text-white font-bold mb-2">3. Prepare Your Rebuttal (min 20 chars)</h3>
            <textarea
              value={rebuttal}
              onChange={(e) => setRebuttal(e.target.value)}
              placeholder="Counter the opposing view..."
              className="w-full h-20 bg-white/10 border-2 border-white/30 rounded-xl p-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={150}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{rebuttal.length}/150</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedPosition || argument.trim().length < 30 || rebuttal.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedPosition && argument.trim().length >= 30 && rebuttal.trim().length >= 20
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Debate
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedPos.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedPos.isCorrect ? "🏆 Balanced Thinker!" : "Reconsider This..."}
            </h2>
            
            {selectedPos.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! Respect doesn't mean blind obedience. You can respect elders while politely 
                    asking questions, seeking clarity, or expressing concerns. Critical thinking and 
                    respect can coexist. Healthy relationships allow respectful dialogue and questioning!
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Argument:</p>
                  <p className="text-white italic">"{argument}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 10 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Blind obedience without thinking can lead to harm. Respect means listening and 
                    considering, but you can politely ask questions and express concerns. Critical 
                    thinking is important!
                  </p>
                </div>
                <p className="text-white/70 text-center">Try again with a balanced perspective!</p>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateObeyOrQuestion;


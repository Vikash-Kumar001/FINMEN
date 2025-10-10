import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EncourageRoleplay = () => {
  const navigate = useNavigate();
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [encouragingWords, setEncouragingWords] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenario = {
    situation: "Your classmate Maya is being cyberbullied. She's posting about feeling sad and alone.",
    emoji: "😢",
    approaches: [
      { id: 1, text: "Ignore it - not my business", isCorrect: false },
      { id: 2, text: "Encourage her and report the bullying", isCorrect: true },
      { id: 3, text: "Tell her to just delete social media", isCorrect: false }
    ]
  };

  const handleSubmit = () => {
    if (selectedApproach === 2 && encouragingWords.trim().length >= 20) {
      showCorrectAnswerFeedback(5, true);
      setCoins(5);
      setShowFeedback(true);
    } else if (selectedApproach && encouragingWords.trim().length >= 20) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    navigate("/student/dcos/teen/empathy-journal");
  };

  const selectedApp = scenario.approaches.find(a => a.id === selectedApproach);

  return (
    <GameShell
      title="Encourage Roleplay"
      subtitle="Support Bullying Victims"
      onNext={handleNext}
      nextEnabled={showFeedback && coins > 0}
      showGameOver={showFeedback && coins > 0}
      score={coins}
      gameId="dcos-teen-16"
      gameType="dcos"
      totalLevels={20}
      currentLevel={16}
      showConfetti={showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/digital-citizenship/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{scenario.emoji}</div>
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{scenario.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Approach</h3>
            <div className="space-y-3 mb-6">
              {scenario.approaches.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApproach(app.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedApproach === app.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="text-white font-semibold">{app.text}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. Write Encouraging Words (min 20 chars)</h3>
            <textarea
              value={encouragingWords}
              onChange={(e) => setEncouragingWords(e.target.value)}
              placeholder="What would you say to encourage Maya?..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{encouragingWords.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || encouragingWords.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && encouragingWords.trim().length >= 20
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Response
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedApp.isCorrect ? "💖" : "😔"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedApp.isCorrect ? "🌟 Compassionate Helper!" : "Not the Best Approach..."}
            </h2>
            
            {selectedApp.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Perfect! Encouraging victims and reporting bullying are both essential. Your support 
                    can help Maya feel less alone and the report can stop the bullying. Be the friend 
                    who stands up and speaks out!
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-white/80 text-sm mb-1">Your Encouraging Words:</p>
                  <p className="text-white italic">"{encouragingWords}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  You earned 5 Coins! 🪙
                </p>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {selectedApproach === 1
                      ? "Ignoring bullying allows it to continue and makes victims feel more isolated. Always offer support!"
                      : "While taking a break can help, the real solution is encouraging Maya and reporting the bullying to stop it!"}
                  </p>
                </div>
                <p className="text-white/70 text-center">Choose a more supportive approach!</p>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EncourageRoleplay;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayTruthfulLeader = () => {
  const navigate = useNavigate();
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leadershipStatement, setLeadershipStatement] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenario = {
    situation: "You're the leader of a group project. A teammate suggests copying parts from the internet to finish faster. How do you lead?",
    approaches: [
      { id: 1, text: "Go along to finish faster", isCorrect: false },
      { id: 2, text: "Insist on honest, original work", isCorrect: true },
      { id: 3, text: "Let them decide for themselves", isCorrect: false }
    ]
  };

  const handleSubmit = () => {
    if (selectedApproach === 2 && leadershipStatement.trim().length >= 20) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
      setShowFeedback(true);
    } else if (selectedApproach && leadershipStatement.trim().length >= 20) {
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/badge-integrity-hero");
  };

  const selectedApp = scenario.approaches.find(a => a.id === selectedApproach);

  return (
    <GameShell
      title="Roleplay: Truthful Leader"
      subtitle="Lead with Integrity"
      onNext={handleNext}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="moral-teen-9"
      gameType="moral"
      totalLevels={20}
      currentLevel={9}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">👥</div>
            <div className="bg-orange-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{scenario.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Leadership Approach</h3>
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

            <h3 className="text-white font-bold mb-2">2. What Would You Say? (min 20 chars)</h3>
            <textarea
              value={leadershipStatement}
              onChange={(e) => setLeadershipStatement(e.target.value)}
              placeholder="Write what you would say to your team to lead with honesty..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{leadershipStatement.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || leadershipStatement.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && leadershipStatement.trim().length >= 20
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit Leadership
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedApp.isCorrect ? "🏆" : "😔"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedApp.isCorrect ? "Truth Leader Badge!" : "Weak Leadership..."}
            </h2>
            
            {selectedApp.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent leadership! True leaders set the standard for integrity. By insisting 
                    on honest work, you taught your team that character matters more than shortcuts. 
                    Leaders who compromise integrity lose respect and credibility!
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">Your Leadership Statement:</p>
                  <p className="text-white italic">"{leadershipStatement}"</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-2">🏆</div>
                  <p className="text-white text-2xl font-bold">Truth Leader Badge!</p>
                  <p className="text-white/80 text-sm mt-2">You lead with honesty!</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    {selectedApproach === 1
                      ? "Leaders set standards. Going along with dishonesty makes you complicit and loses your team's respect!"
                      : "Leaders must guide, not be passive. Stand up for integrity and show your team the right path!"}
                  </p>
                </div>
                <p className="text-white/70 text-center">Try again with stronger leadership!</p>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayTruthfulLeader;


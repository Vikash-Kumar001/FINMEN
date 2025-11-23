import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayJusticeLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leaderResponse, setLeaderResponse] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation:
        "Two students argue during a group project. One accuses the other of not helping. As class captain, what do you do?",
      approaches: [
        { id: 1, text: "Ignore the fight and move on", isCorrect: false },
        { id: 2, text: "Listen to both sides and help them divide work fairly", isCorrect: true },
        { id: 3, text: "Take your friend’s side automatically", isCorrect: false },
      ],
    },
    {
      id: 2,
      situation:
        "A student forgot their lunch. Others have extra food. What’s the fair action as a leader?",
      approaches: [
        { id: 1, text: "Tell them to manage on their own", isCorrect: false },
        { id: 2, text: "Encourage sharing so everyone eats", isCorrect: true },
        { id: 3, text: "Give food only to your close friends", isCorrect: false },
      ],
    },
    {
      id: 3,
      situation:
        "During a class game, your best friend breaks a rule. What should a fair leader do?",
      approaches: [
        { id: 1, text: "Ignore it because they’re your friend", isCorrect: false },
        { id: 2, text: "Apply the same rule to everyone", isCorrect: true },
        { id: 3, text: "Scold others to distract attention", isCorrect: false },
      ],
    },
    {
      id: 4,
      situation:
        "Some students always volunteer to speak while quiet ones never get a chance. What should you do?",
      approaches: [
        { id: 1, text: "Only pick the fast volunteers", isCorrect: false },
        { id: 2, text: "Rotate turns so everyone can share", isCorrect: true },
        { id: 3, text: "Let the teacher handle it", isCorrect: false },
      ],
    },
    {
      id: 5,
      situation:
        "Your team wins a game, but one member didn’t get credit. What should you do as captain?",
      approaches: [
        { id: 1, text: "Take all the praise for yourself", isCorrect: false },
        { id: 2, text: "Acknowledge everyone’s contribution equally", isCorrect: true },
        { id: 3, text: "Ignore it—it doesn’t matter", isCorrect: false },
      ],
    },
  ];

  const currentScenario = scenarios[currentQuestion];

  const handleSubmit = () => {
    if (selectedApproach && leaderResponse.trim().length >= 20) {
      if (currentScenario.approaches.find((a) => a.id === selectedApproach)?.isCorrect) {
        showCorrectAnswerFeedback(1, true);
        setEarnedBadge(true);
      } else {
        setEarnedBadge(false);
      }
      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedApproach(null);
      setLeaderResponse("");
      setShowFeedback(false);
      setEarnedBadge(false);
    } else {
      navigate("/student/moral-values/teen/reflex-stand-up");
    }
  };

  const selectedApp = currentScenario.approaches.find((a) => a.id === selectedApproach);

  return (
    <GameShell
      title="Roleplay: Justice Leader"
      subtitle="Leading with Fairness"
      onNext={handleNext}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && currentQuestion === scenarios.length - 1 && earnedBadge}
      score={earnedBadge ? (currentQuestion + 1) * 1 : currentQuestion * 1}
      gameId="moral-teen-justice-leader-48"
      gameType="moral"
      totalLevels={100}
      currentLevel={48}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Justice Scenario {currentQuestion + 1}/5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {currentScenario.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose the Fairest Action</h3>
            <div className="space-y-3 mb-6">
              {currentScenario.approaches.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApproach(app.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedApproach === app.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold">{app.text}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. What Would You Say? (min 20 chars)</h3>
            <textarea
              value={leaderResponse}
              onChange={(e) => setLeaderResponse(e.target.value)}
              placeholder="Write what you would say to handle this fairly..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {leaderResponse.length}/200
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || leaderResponse.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && leaderResponse.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Leadership
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto text-center">
            <div className="text-7xl mb-4">{selectedApp.isCorrect ? "🏅" : "😕"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedApp.isCorrect ? "Fair Leader Badge!" : "Try Again..."}
            </h2>

            {selectedApp.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Great judgment! You showed fairness and equality. Justice leaders ensure
                    everyone is treated with respect — not based on favoritism but truth and balance.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">Your Response:</p>
                  <p className="text-white italic">"{leaderResponse}"</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    {selectedApproach === 1
                      ? "Ignoring problems never helps. Fair leaders resolve conflicts calmly and equally."
                      : "Taking sides shows bias. Justice means fairness to everyone, not favoritism."}
                  </p>
                </div>
                <p className="text-white/70">Reflect and try again with a fairer mindset!</p>
              </>
            )}

            {/* ✅ NEXT SCENARIO BUTTON */}
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < scenarios.length - 1 ? "Next Scenario →" : "Finish Game 🎯"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayJusticeLeader;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayRespectLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leadershipAction, setLeadershipAction] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation: "You're leading a group discussion. Some members are quiet while others dominate. How do you lead with respect?",
      approaches: [
        { id: 1, text: "Let loud members continue", isCorrect: false },
        { id: 2, text: "Listen to everyone's ideas equally", isCorrect: true },
        { id: 3, text: "Only listen to the smartest members", isCorrect: false },
      ],
    },
    {
      id: 2,
      situation: "A teammate disagrees with your idea during a project meeting. What’s your respectful response?",
      approaches: [
        { id: 1, text: "Ignore their opinion", isCorrect: false },
        { id: 2, text: "Listen carefully and discuss calmly", isCorrect: true },
        { id: 3, text: "Tell them you’re the leader and they must follow", isCorrect: false },
      ],
    },
    {
      id: 3,
      situation: "You notice one group member is always doing extra work. What’s a respectful leadership move?",
      approaches: [
        { id: 1, text: "Let them handle it since they’re responsible", isCorrect: false },
        { id: 2, text: "Appreciate them and redistribute tasks fairly", isCorrect: true },
        { id: 3, text: "Take credit for the team’s success", isCorrect: false },
      ],
    },
    {
      id: 4,
      situation: "Two members are arguing loudly in your group. How would you lead respectfully?",
      approaches: [
        { id: 1, text: "Let them argue it out", isCorrect: false },
        { id: 2, text: "Calm them, listen to both sides, and find balance", isCorrect: true },
        { id: 3, text: "Pick a side quickly to end it", isCorrect: false },
      ],
    },
    {
      id: 5,
      situation: "You’re presenting your group’s idea. Some classmates mock the plan. How do you respond as a respectful leader?",
      approaches: [
        { id: 1, text: "Argue back rudely", isCorrect: false },
        { id: 2, text: "Stay calm, respond politely, and stand by your team", isCorrect: true },
        { id: 3, text: "Stop presenting and give up", isCorrect: false },
      ],
    },
  ];

  const current = scenarios[currentScenario];
  const selectedApp = current.approaches.find((a) => a.id === selectedApproach);

  const handleSubmit = () => {
    if (selectedApproach && leadershipAction.trim().length >= 20) {
      if (selectedApp.isCorrect) {
        showCorrectAnswerFeedback(2, true);
        setCoins((prev) => prev + 2);
      }
      setShowFeedback(true);
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedApproach(null);
      setLeadershipAction("");
      setShowFeedback(false);
    } else {
      setEarnedBadge(true);
    }
  };

  const handleNextGame = () => {
    navigate("/student/moral-values/teen/reflex-gratitude");
  };

  return (
    <GameShell
      title="Roleplay: Respect Leader"
      subtitle="Lead by Listening"
      onNext={handleNextGame}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={coins}
      gameId="moral-teen-18"
      gameType="moral"
      totalLevels={20}
      currentLevel={18}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!earnedBadge ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-6xl mb-4 text-center">👥</div>
              <h2 className="text-white text-xl font-bold text-center mb-4">
                Scenario {currentScenario + 1} of {scenarios.length}
              </h2>

              <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                <p className="text-white text-lg leading-relaxed">{current.situation}</p>
              </div>

              <h3 className="text-white font-bold mb-4">1. Choose Your Leadership Approach</h3>
              <div className="space-y-3 mb-6">
                {current.approaches.map((app) => (
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

              <h3 className="text-white font-bold mb-2">2. What Would You Do? (min 20 chars)</h3>
              <textarea
                value={leadershipAction}
                onChange={(e) => setLeadershipAction(e.target.value)}
                placeholder="Describe how you would respond respectfully..."
                className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
                maxLength={200}
              />
              <div className="text-white/50 text-sm mb-4 text-right">{leadershipAction.length}/200</div>

              <button
                onClick={handleSubmit}
                disabled={!selectedApproach || leadershipAction.trim().length < 20}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedApproach && leadershipAction.trim().length >= 20
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                    : "bg-gray-500/50 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">
                {selectedApp.isCorrect ? "🏆" : "😔"}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {selectedApp.isCorrect ? "Great Leadership!" : "Needs Improvement"}
              </h2>

              <div
                className={`${
                  selectedApp.isCorrect ? "bg-green-500/20" : "bg-red-500/20"
                } rounded-lg p-4 mb-4`}
              >
                <p className="text-white text-center">
                  {selectedApp.isCorrect
                    ? "Excellent! Respectful leaders listen, stay calm, and value everyone’s ideas."
                    : "That choice might cause disrespect or imbalance in leadership. Try again with empathy and fairness."}
                </p>
              </div>

              <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                <p className="text-white/80 text-sm mb-1">Your Response:</p>
                <p className="text-white italic">"{leadershipAction}"</p>
              </div>

              <button
                onClick={handleNextScenario}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 transition"
              >
                {currentScenario < scenarios.length - 1
                  ? "Next Scenario →"
                  : "View Badge Result 🏅"}
              </button>
            </div>
          )
        ) : (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🏅</div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Respect Leader Badge Unlocked!
            </h2>
            <p className="text-white/80 text-lg">
              You led with respect, fairness, and empathy across all challenges.
            </p>
            <p className="text-yellow-200 text-2xl font-bold mt-4">
              Total Coins Earned: {coins} 🪙
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayRespectLeader;

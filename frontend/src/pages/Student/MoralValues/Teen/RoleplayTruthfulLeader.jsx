import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayTruthfulLeader = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leadershipStatement, setLeadershipStatement] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Project Plagiarism",
      emoji: "👥",
      situation:
        "You’re leading a school project. A teammate suggests copying from the internet to save time. What do you do?",
      approaches: [
        { id: 1, text: "Agree to copy and finish fast", isCorrect: false },
        { id: 2, text: "Insist on honest, original work", isCorrect: true },
        { id: 3, text: "Let them do what they want", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Group Conflict",
      emoji: "🤝",
      situation:
        "Two teammates argue and refuse to work together. How do you lead the situation?",
      approaches: [
        { id: 1, text: "Ignore it and work alone", isCorrect: false },
        { id: 2, text: "Calmly mediate and unite the team", isCorrect: true },
        { id: 3, text: "Take sides with your favorite", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Missed Deadlines",
      emoji: "⏰",
      situation:
        "One member keeps missing deadlines. Others are angry. What will you do as leader?",
      approaches: [
        { id: 1, text: "Scold publicly to set example", isCorrect: false },
        { id: 2, text: "Privately guide and motivate them", isCorrect: true },
        { id: 3, text: "Do their work silently", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Credit Sharing",
      emoji: "🏅",
      situation:
        "Your teacher praises only you for a group success. Others seem disappointed. What do you say?",
      approaches: [
        { id: 1, text: "Accept all credit silently", isCorrect: false },
        { id: 2, text: "Thank the whole team publicly", isCorrect: true },
        { id: 3, text: "Say 'they helped a bit'", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Fair Decision",
      emoji: "⚖️",
      situation:
        "You must select two members for a prize. One is your best friend, the other worked harder. What do you do?",
      approaches: [
        { id: 1, text: "Choose your friend", isCorrect: false },
        { id: 2, text: "Choose the one who earned it", isCorrect: true },
        { id: 3, text: "Avoid deciding", isCorrect: false },
      ],
    },
  ];

  const current = scenarios[currentScenario];
  const selectedApp = current.approaches.find((a) => a.id === selectedApproach);

  const handleSubmit = () => {
    if (selectedApproach && leadershipStatement.trim().length >= 20) {
      const isCorrect = selectedApp.isCorrect;
      if (isCorrect) {
        showCorrectAnswerFeedback(2, true);
        setTotalScore((prev) => prev + 2);
      }
      setShowFeedback(true);
      if (currentScenario === scenarios.length - 1 && isCorrect) {
        setEarnedBadge(true);
      }
    }
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((prev) => prev + 1);
      setSelectedApproach(null);
      setLeadershipStatement("");
      setShowFeedback(false);
      resetFeedback();
    }
  };

  const handleFinish = () => {
    navigate("/student/moral-values/teen/badge-integrity-hero");
  };

  return (
    <GameShell
      title="Roleplay: Truthful Leader"
      subtitle="Lead with Integrity"
      onNext={earnedBadge ? handleFinish : undefined}
      nextEnabled={earnedBadge}
      showGameOver={earnedBadge}
      score={totalScore}
      gameId="moral-teen-9"
      gameType="moral"
      totalLevels={20}
      currentLevel={9}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center text-black-400">
              {current.title}
            </h2>
            <div className="bg-orange-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {current.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">
              1. Choose Your Leadership Approach
            </h3>
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

            <h3 className="text-white font-bold mb-2">
              2. What Would You Say? (min 20 chars)
            </h3>
            <textarea
              value={leadershipStatement}
              onChange={(e) => setLeadershipStatement(e.target.value)}
              placeholder="Write what you would say to your team to lead with honesty..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {leadershipStatement.length}/200
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || leadershipStatement.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && leadershipStatement.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Leadership
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto" >
            <div className="text-7xl mb-4">
              {selectedApp?.isCorrect ? "🏆" : "😔"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedApp?.isCorrect
                ? "Great Leadership!"
                : "Weak Leadership..."}
            </h2>

            {selectedApp?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent leadership! You demonstrated integrity and fairness
                    even when it was hard.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">
                    Your Leadership Statement:
                  </p>
                  <p className="text-white italic">"{leadershipStatement}"</p>
                </div>
                {!earnedBadge ? (
                  <button
                    onClick={handleNextScenario}
                    className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Scenario →
                  </button>
                ) : (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center mt-4">
                    <div className="text-5xl mb-2">🏅</div>
                    <p className="text-white text-2xl font-bold">
                      Integrity Leader Badge!
                    </p>
                    <p className="text-white/80 text-sm mt-2">
                      You led all 5 scenarios with honesty!
                    </p>
                    <button
                      onClick={handleFinish}
                      className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      Finish Game 🎯
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Leaders earn respect by doing what's right, not what's easy.
                    Try again and guide with fairness.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    resetFeedback();
                  }}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayTruthfulLeader;

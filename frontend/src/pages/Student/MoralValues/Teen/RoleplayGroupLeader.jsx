import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayGroupLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leaderAction, setLeaderAction] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      situation:
        "Your team is behind schedule. How do you motivate them to finish tasks on time?",
      approaches: [
        { id: 1, text: "Yell at everyone to hurry", isCorrect: false },
        {
          id: 2,
          text: "Set clear priorities and encourage collaboration",
          isCorrect: true,
        },
        { id: 3, text: "Do all tasks yourself", isCorrect: false },
      ],
    },
    {
      situation:
        "A team member is not contributing. How do you handle it?",
      approaches: [
        { id: 1, text: "Ignore them and hope they improve", isCorrect: false },
        {
          id: 2,
          text: "Assign tasks suited to their strengths and guide them",
          isCorrect: true,
        },
        { id: 3, text: "Criticize publicly", isCorrect: false },
      ],
    },
    {
      situation:
        "Two team members are arguing and delaying work. What do you do?",
      approaches: [
        { id: 1, text: "Let them fight it out", isCorrect: false },
        {
          id: 2,
          text: "Mediate and help them reach agreement",
          isCorrect: true,
        },
        { id: 3, text: "Ignore conflict and focus on yourself", isCorrect: false },
      ],
    },
    {
      situation:
        "Deadline is tight and team is stressed. How do you act?",
      approaches: [
        { id: 1, text: "Add more pressure to force results", isCorrect: false },
        {
          id: 2,
          text: "Offer support, break tasks into manageable steps",
          isCorrect: true,
        },
        { id: 3, text: "Let them panic and figure it out", isCorrect: false },
      ],
    },
    {
      situation:
        "Some tasks are boring, some fun. How do you ensure everyone participates?",
      approaches: [
        { id: 1, text: "Assign fun tasks to favorites", isCorrect: false },
        {
          id: 2,
          text: "Rotate tasks fairly and motivate the team",
          isCorrect: true,
        },
        { id: 3, text: "Do boring tasks yourself", isCorrect: false },
      ],
    },
  ];

  const handleSubmit = () => {
    if (selectedApproach && leaderAction.trim().length >= 20) {
      const correct = scenarios[currentScenario].approaches.find(
        (a) => a.id === selectedApproach
      )?.isCorrect;

      if (correct) {
        showCorrectAnswerFeedback(3, true);
        setEarnedBadge(true);
        setCoins((prev) => prev + 3);
      } else {
        setEarnedBadge(false);
      }

      setShowFeedback(true);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((prev) => prev + 1);
      setSelectedApproach(null);
      setLeaderAction("");
      setShowFeedback(false);
      setEarnedBadge(false);
    } else {
      navigate("/student/moral-values/teen/reflex-duty-check");
    }
  };

  const selectedApp = scenarios[currentScenario].approaches.find(
    (a) => a.id === selectedApproach
  );

  return (
    <GameShell
      title="Roleplay: Group Leader"
      subtitle="Lead Your Team Effectively"
      score={coins}
      totalLevels={100}
      currentLevel={38}
      gameId="moral-teen-38"
      gameType="moral"
      backPath="/games/moral-values/teens"
      showConfetti={showFeedback && earnedBadge}
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">👥</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Scenario {currentScenario + 1} of {scenarios.length}
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {scenarios[currentScenario].situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">
              1. Choose Your Approach
            </h3>
            <div className="space-y-3 mb-6">
              {scenarios[currentScenario].approaches.map((app) => (
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
              2. Describe Your Leadership Action (min 20 chars)
            </h3>
            <textarea
              value={leaderAction}
              onChange={(e) => setLeaderAction(e.target.value)}
              placeholder="Explain how you would lead the team..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">
              {leaderAction.length}/200
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || leaderAction.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && leaderAction.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Leadership
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedApp?.isCorrect ? "🏆" : "😔"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedApp?.isCorrect
                ? "Effective Leader!"
                : "Review Your Approach..."}
            </h2>

            {selectedApp?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent leadership! You guided your team effectively and
                    handled the situation wisely.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">
                    Your Leadership Action:
                  </p>
                  <p className="text-white italic">"{leaderAction}"</p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center mb-4">
                  You earned +3 Coins! 🪙
                </p>
              </>
            ) : (
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-white text-center">
                  {selectedApproach === 1
                    ? "Yelling reduces morale. Great leaders motivate calmly and clearly."
                    : "Avoid doing everything yourself — teamwork builds trust and efficiency!"}
                </p>
              </div>
            )}

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentScenario === scenarios.length - 1
                ? "Finish Roleplay"
                : "Next Scenario"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayGroupLeader;

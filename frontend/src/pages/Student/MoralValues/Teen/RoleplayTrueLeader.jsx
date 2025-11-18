import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayTrueLeader = () => {
  const navigate = useNavigate();
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leaderResponse, setLeaderResponse] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧭 5 service-based leadership scenarios
  const scenarios = [
    {
      id: 1,
      situation:
        "Your team is struggling to complete a science project. Some members are tired. As a true leader, what do you do?",
      approaches: [
        { id: 1, text: "Tell them to hurry up without helping", isCorrect: false },
        { id: 2, text: "Offer to help and motivate the team to finish together", isCorrect: true },
        { id: 3, text: "Blame them for being slow", isCorrect: false },
      ],
    },
    {
      id: 2,
      situation:
        "During cleaning duty, one student refuses to help. How does a true leader respond?",
      approaches: [
        { id: 1, text: "Do the task yourself and inspire others by example", isCorrect: true },
        { id: 2, text: "Complain loudly to the teacher", isCorrect: false },
        { id: 3, text: "Ignore it and leave the work unfinished", isCorrect: false },
      ],
    },
    {
      id: 3,
      situation:
        "Your friend takes credit for work you helped with. What’s a true leader’s action?",
      approaches: [
        { id: 1, text: "Publicly argue and embarrass them", isCorrect: false },
        { id: 2, text: "Calmly talk later and focus on teamwork over ego", isCorrect: true },
        { id: 3, text: "Stop working with them forever", isCorrect: false },
      ],
    },
    {
      id: 4,
      situation:
        "A classmate makes a mistake while presenting. Everyone laughs. What do you do as a leader?",
      approaches: [
        { id: 1, text: "Join in the laughter", isCorrect: false },
        { id: 2, text: "Encourage them and remind others to be kind", isCorrect: true },
        { id: 3, text: "Stay silent and ignore it", isCorrect: false },
      ],
    },
    {
      id: 5,
      situation:
        "Your team wins a competition. As the leader, how do you celebrate?",
      approaches: [
        { id: 1, text: "Thank the team and share credit with everyone", isCorrect: true },
        { id: 2, text: "Take all the praise for yourself", isCorrect: false },
        { id: 3, text: "Ignore the team and post about it alone", isCorrect: false },
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
      navigate("/student/moral-values/teen/reflex-team-first");
    }
  };

  const selectedApp = currentScenario.approaches.find((a) => a.id === selectedApproach);

  return (
    <GameShell
      title="Roleplay: True Leader"
      subtitle="Leading by Serving Others"
      onNext={handleNext}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && currentQuestion === scenarios.length - 1 && earnedBadge}
      score={earnedBadge ? (currentQuestion + 1) * 1 : currentQuestion * 1}
      gameId="moral-teen-true-leader-78"
      gameType="moral"
      totalLevels={100}
      currentLevel={78}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          // 🧠 Question Screen
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🫶</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Leadership Scenario {currentQuestion + 1}/5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {currentScenario.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">1️⃣ Choose the Best Leadership Action</h3>
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

            <h3 className="text-white font-bold mb-2">2️⃣ What Would You Say? (min 20 chars)</h3>
            <textarea
              value={leaderResponse}
              onChange={(e) => setLeaderResponse(e.target.value)}
              placeholder="Write what you would say to inspire or support your team..."
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
          // ✅ Feedback Screen with Next Button
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">
              {selectedApp.isCorrect ? "🏅" : "🤔"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedApp.isCorrect ? "True Leader Badge!" : "Try Again..."}
            </h2>

            {selectedApp.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Excellent! A true leader serves others, leads with kindness,
                    and lifts the whole team up — not just themselves.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">Your Response:</p>
                  <p className="text-white italic">"{leaderResponse}"</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-center mb-6">
                  <div className="text-5xl mb-2">🏅</div>
                  <p className="text-white text-2xl font-bold">True Leader Badge!</p>
                  <p className="text-white/80 text-sm mt-2">
                    You led by example and service!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    {selectedApproach === 1
                      ? "Commanding without support isn’t leadership — it’s authority. True leaders serve first."
                      : "Ignoring or blaming weakens trust. A real leader inspires and helps others succeed."}
                  </p>
                </div>
                <p className="text-white/70 mb-6">
                  Reflect on how service builds true leadership — and try again!
                </p>
              </>
            )}

            {/* 👉 Added Next Button */}
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition"
            >
              {currentQuestion < scenarios.length - 1 ? "Next Scenario ➡️" : "Finish 🏁"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayTrueLeader;

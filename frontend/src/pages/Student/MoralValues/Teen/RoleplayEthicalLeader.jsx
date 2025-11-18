import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayEthicalLeader = () => {
  const navigate = useNavigate();
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [leaderResponse, setLeaderResponse] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // 🧠 5 Ethical Leadership Scenarios
  const scenarios = [
    {
      id: 1,
      situation:
        "Your classmates want to skip cleaning duty, but the rule says everyone should take turns. What would you do as a fair leader?",
      approaches: [
        { id: 1, text: "Ignore and let them skip—it’s not your problem", isCorrect: false },
        { id: 2, text: "Remind them kindly that rules apply equally to everyone", isCorrect: true },
        { id: 3, text: "Do all the work yourself silently", isCorrect: false },
      ],
    },
    {
      id: 2,
      situation:
        "You’re organizing an event. A talented but rude student wants the spotlight. How do you act ethically?",
      approaches: [
        { id: 1, text: "Give them all the attention—they’re talented", isCorrect: false },
        { id: 2, text: "Balance opportunities for all, promoting teamwork", isCorrect: true },
        { id: 3, text: "Exclude them to avoid drama", isCorrect: false },
      ],
    },
    {
      id: 3,
      situation:
        "A friend asks you to bend a rule just for them. What is the right ethical response?",
      approaches: [
        { id: 1, text: "Agree because they’re your close friend", isCorrect: false },
        { id: 2, text: "Politely refuse and explain fairness matters", isCorrect: true },
        { id: 3, text: "Pretend to agree but don’t actually help", isCorrect: false },
      ],
    },
    {
      id: 4,
      situation:
        "Your teacher praises your team, but another group’s idea was used. What’s the ethical thing to do?",
      approaches: [
        { id: 1, text: "Stay silent and take the credit", isCorrect: false },
        { id: 2, text: "Acknowledge the other group’s idea publicly", isCorrect: true },
        { id: 3, text: "Blame the teacher for missing it", isCorrect: false },
      ],
    },
    {
      id: 5,
      situation:
        "A student breaks a rule accidentally. The teacher didn’t see it. What should an ethical leader do?",
      approaches: [
        { id: 1, text: "Hide it to protect the student", isCorrect: false },
        { id: 2, text: "Encourage honesty and explain it calmly to the teacher", isCorrect: true },
        { id: 3, text: "Tell others to stay quiet about it", isCorrect: false },
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
    } else {
      alert("Please select an action and write at least 20 characters.");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedApproach(null);
      setLeaderResponse("");
      setShowFeedback(false);
      setEarnedBadge(false);
    } else {
      // ✅ All questions done → move to next game
      navigate("/student/moral-values/teen/reflex-true-hero");
    }
  };

  const selectedApp = currentScenario.approaches.find((a) => a.id === selectedApproach);

  return (
    <GameShell
      title="Roleplay: Ethical Leader"
      subtitle="Choosing Fair Rules for All"
      onNext={handleNextQuestion}
      nextEnabled={showFeedback && earnedBadge}
      showGameOver={showFeedback && currentQuestion === scenarios.length - 1 && earnedBadge}
      score={earnedBadge ? (currentQuestion + 1) * 1 : currentQuestion * 1}
      gameId="moral-teen-ethical-leader-98"
      gameType="moral"
      totalLevels={100}
      currentLevel={98}
      showConfetti={showFeedback && earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {/* ✅ Main Question Screen */}
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🧠</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Ethical Scenario {currentQuestion + 1}/5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">
                {currentScenario.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose the Most Ethical Action</h3>
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
              placeholder="Write your ethical leader response here..."
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
          // ✅ Feedback Screen + Next Button
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedApp?.isCorrect ? "🏅" : "😕"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedApp?.isCorrect ? "Ethical Leader Badge!" : "Reflect and Retry!"}
            </h2>

            {selectedApp?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    Excellent! You acted with ethics and fairness. Great leaders do what’s right —
                    not what’s easy or popular — and build trust through honesty and justice.
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6 text-left">
                  <p className="text-white/80 text-sm mb-1">Your Response:</p>
                  <p className="text-white italic">"{leaderResponse}"</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    {selectedApproach === 1
                      ? "Ignoring unfairness weakens leadership. True leaders guide others with ethics."
                      : "Avoid bias — ethics means equal treatment, not emotion-based decisions."}
                  </p>
                </div>
                <p className="text-white/70 mb-4">
                  Reflect and try again with fairness and courage!
                </p>
              </>
            )}

            {/* ✅ NEXT QUESTION BUTTON */}
            <button
              onClick={handleNextQuestion}
              className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              {currentQuestion < scenarios.length - 1
                ? "Next Question →"
                : "Finish Game ✅"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayEthicalLeader;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayGoodTeammate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [teamResponse, setTeamResponse] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  // 🤝 5 teamwork & empathy-based roleplay scenarios
  const scenarios = [
    {
      id: 1,
      situation: "A teammate is struggling to finish their part of a project. What do you do?",
      approaches: [
        { id: 1, text: "Complain that they’re slowing the team", isCorrect: false },
        { id: 2, text: "Offer to help and work together to complete it", isCorrect: true },
        { id: 3, text: "Ignore them and focus only on your part", isCorrect: false },
      ],
    },
    {
      id: 2,
      situation: "During a discussion, one team member keeps interrupting others. How do you respond?",
      approaches: [
        { id: 1, text: "Join in and interrupt too", isCorrect: false },
        { id: 2, text: "Calmly remind everyone to take turns and listen", isCorrect: true },
        { id: 3, text: "Stay silent and let the chaos continue", isCorrect: false },
      ],
    },
    {
      id: 3,
      situation: "Your team loses a competition. One member feels sad and blames themselves. What’s your reaction?",
      approaches: [
        { id: 1, text: "Say it’s their fault", isCorrect: false },
        { id: 2, text: "Encourage them and remind the team of effort and teamwork", isCorrect: true },
        { id: 3, text: "Stay quiet to avoid drama", isCorrect: false },
      ],
    },
    {
      id: 4,
      situation: "Two teammates disagree on an idea. What’s the best way to handle it?",
      approaches: [
        { id: 1, text: "Pick one side to end the argument quickly", isCorrect: false },
        { id: 2, text: "Listen to both sides and find a compromise", isCorrect: true },
        { id: 3, text: "Tell them to stop arguing without hearing them", isCorrect: false },
      ],
    },
    {
      id: 5,
      situation: "You finish your work early but others still have pending tasks. What should you do?",
      approaches: [
        { id: 1, text: "Relax and scroll your phone", isCorrect: false },
        { id: 2, text: "Offer help to others so the team finishes together", isCorrect: true },
        { id: 3, text: "Complain that others are too slow", isCorrect: false },
      ],
    },
  ];

  const currentScenario = scenarios[currentQuestion];
  const selectedApp = currentScenario.approaches.find((a) => a.id === selectedApproach);

  const handleSubmit = () => {
    if (!selectedApproach || teamResponse.trim().length < 20) return;
    if (selectedApp?.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setEarnedBadge(true);
    } else {
      setEarnedBadge(false);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedApproach(null);
      setTeamResponse("");
      setShowFeedback(false);
      setEarnedBadge(false);
    } else {
      // ✅ All questions done → next game
      navigate("/student/moral-values/teen/reflex-fair-share");
    }
  };

  return (
    <GameShell
      title="Roleplay: Good Teammate"
      subtitle="Working Together with Empathy"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={showFeedback && currentQuestion === scenarios.length - 1}
      score={(currentQuestion + 1) * (earnedBadge ? 1 : 0)}
      gameId="moral-teen-good-teammate-68"
      gameType="moral"
      totalLevels={100}
      currentLevel={68}
      showConfetti={showFeedback && earnedBadge}
      backPath="/games/moral-values/teens"
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {/* QUESTION MODE */}
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">🤝</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Team Scenario {currentQuestion + 1}/5
            </h2>

            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentScenario.situation}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1️⃣ Choose the Best Team Action</h3>
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
              value={teamResponse}
              onChange={(e) => setTeamResponse(e.target.value)}
              placeholder="Write what you would say to support your team..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{teamResponse.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedApproach || teamResponse.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedApproach && teamResponse.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Response
            </button>
          </div>
        ) : (
          // FEEDBACK MODE
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">
              {selectedApp?.isCorrect ? "🏅" : "😕"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedApp?.isCorrect ? "Good Teammate Choice!" : "Try Again..."}
            </h2>

            {selectedApp?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    You showed empathy, patience, and teamwork spirit — exactly what a good
                    teammate does!
                  </p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">Your Response:</p>
                  <p className="text-white italic">"{teamResponse}"</p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 hover:opacity-90"
                >
                  {currentQuestion < scenarios.length - 1 ? "Next Scenario →" : "Finish Game 🎉"}
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Teamwork means listening and supporting others — try to be more cooperative
                    next time!
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                >
                  Next Scenario →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayGoodTeammate;

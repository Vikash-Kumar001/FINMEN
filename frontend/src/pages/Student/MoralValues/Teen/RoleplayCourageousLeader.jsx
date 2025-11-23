import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RoleplayCourageousLeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [statement, setStatement] = useState("");
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "You see a team member being blamed unfairly for a group mistake. What do you do?",
      options: [
        { id: 1, text: "Stay silent to avoid conflict", isCorrect: false },
        { id: 2, text: "Speak up and clarify everyone’s role", isCorrect: true },
        { id: 3, text: "Join others in blaming to stay popular", isCorrect: false },
      ],
    },
    {
      id: 2,
      scenario: "A classmate is being teased for asking questions. How would you lead?",
      options: [
        { id: 1, text: "Ignore the teasing", isCorrect: false },
        { id: 2, text: "Tell others to stop and encourage curiosity", isCorrect: true },
        { id: 3, text: "Laugh along to fit in", isCorrect: false },
      ],
    },
    {
      id: 3,
      scenario: "Your team excludes a quiet member from discussions. What’s your action?",
      options: [
        { id: 1, text: "Let it continue, it’s their choice", isCorrect: false },
        { id: 2, text: "Include everyone and ensure fairness", isCorrect: true },
        { id: 3, text: "Only focus on your work", isCorrect: false },
      ],
    },
    {
      id: 4,
      scenario: "During a sports match, your team cheats to win. What do you do?",
      options: [
        { id: 1, text: "Say nothing since you won", isCorrect: false },
        { id: 2, text: "Admit the mistake and accept fair results", isCorrect: true },
        { id: 3, text: "Defend the cheating as teamwork", isCorrect: false },
      ],
    },
    {
      id: 5,
      scenario: "You notice favoritism in assigning team roles. What’s the right stand?",
      options: [
        { id: 1, text: "Accept it quietly", isCorrect: false },
        { id: 2, text: "Speak to the teacher about equal opportunities", isCorrect: true },
        { id: 3, text: "Complain secretly to friends", isCorrect: false },
      ],
    },
  ];

  const handleSubmit = () => {
    const current = questions[currentQuestion];
    const chosen = current.options.find(o => o.id === selectedOption);

    if (chosen && chosen.isCorrect && statement.trim().length >= 20) {
      showCorrectAnswerFeedback(1, true);
      setScore(score + 1);
    }

    setShowFeedback(true);
    if (currentQuestion === questions.length - 1) {
      if (score + (chosen?.isCorrect ? 1 : 0) === 5) {
        setEarnedBadge(true);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setStatement("");
      setShowFeedback(false);
    } else {
      navigate("/student/moral-values/teen/badge-courage-hero");
    }
  };

  const currentQ = questions[currentQuestion];
  const selected = currentQ.options.find(o => o.id === selectedOption);

  return (
    <GameShell
      title="Roleplay: Courageous Leader"
      subtitle="Stand Up for Justice"
      onNext={handleNext}
      nextEnabled={showFeedback}
      showGameOver={earnedBadge}
      score={earnedBadge ? 3 : 0}
      gameId="moral-teen-59"
      gameType="moral"
      totalLevels={100}
      currentLevel={59}
      showConfetti={earnedBadge}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">⚖️</div>
            <div className="bg-red-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentQ.scenario}</p>
            </div>

            <h3 className="text-white font-bold mb-4">1. Choose Your Response</h3>
            <div className="space-y-3 mb-6">
              {currentQ.options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full border-2 rounded-xl p-4 transition-all ${
                    selectedOption === opt.id
                      ? "bg-blue-500/50 border-blue-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="text-white font-semibold">{opt.text}</div>
                </button>
              ))}
            </div>

            <h3 className="text-white font-bold mb-2">2. What Would You Say? (min 20 chars)</h3>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Write how you'd act courageously and fairly..."
              className="w-full h-32 bg-white/10 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 resize-none mb-4"
              maxLength={200}
            />
            <div className="text-white/50 text-sm mb-4 text-right">{statement.length}/200</div>

            <button
              onClick={handleSubmit}
              disabled={!selectedOption || statement.trim().length < 20}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedOption && statement.trim().length >= 20
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Submit Response
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selected?.isCorrect ? "🏆" : "😔"}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selected?.isCorrect ? "Courageous Leader!" : "Missed the Mark..."}
            </h2>

            {selected?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    You acted with courage and fairness! Real leaders defend what’s right, even when 
                    it’s uncomfortable. Your brave stand inspires respect and creates fairness for all. 
                    Keep being the voice for justice!
                  </p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 mb-6">
                  <p className="text-white/80 text-sm mb-1">Your Leadership Statement:</p>
                  <p className="text-white italic">"{statement}"</p>
                </div>
                {earnedBadge && (
                  <div className="bg-gradient-to-r from-yellow-400 to-red-400 rounded-xl p-6 text-center mb-4">
                    <div className="text-5xl mb-2">🏅</div>
                    <p className="text-white text-2xl font-bold">Courageous Leader Badge!</p>
                    <p className="text-white/80 text-sm mt-2">You stood up for what’s right!</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white">
                    True leaders don’t stay silent in unfairness. Next time, stand up for others 
                    and show fairness through your actions!
                  </p>
                </div>
                <p className="text-white/70">Try again with more courage!</p>
              </>
            )}

            {/* ✅ NEXT BUTTON added here */}
            <button
              onClick={handleNext}
              className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              {currentQuestion < questions.length - 1 ? "Next Scenario →" : "Finish Game"}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayCourageousLeader;

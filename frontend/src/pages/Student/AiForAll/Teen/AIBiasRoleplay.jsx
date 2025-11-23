import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIBiasRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      title: "Hiring Junior Developers 👩‍💻👨‍💻",
      situation: "AI tends to shortlist only male candidates. What should you do?",
      choices: [
        { id: 1, text: "Hire boys only 👦", isCorrect: false },
        { id: 2, text: "Hire boys + girls 👦👧", isCorrect: true },
      ],
    },
    {
      title: "Project Manager Selection 🧑‍💼",
      situation: "AI favors male candidates due to biased training data. Correct action?",
      choices: [
        { id: 1, text: "Accept AI choice 👨", isCorrect: false },
        { id: 2, text: "Adjust for fairness 👩👨", isCorrect: true },
      ],
    },
    {
      title: "Intern Recruitment 🎓",
      situation: "AI shows only male interns in recommendations. What do you do?",
      choices: [
        { id: 1, text: "Hire only shown candidates 👦", isCorrect: false },
        { id: 2, text: "Include qualified girls 👧", isCorrect: true },
      ],
    },
    {
      title: "Team Lead Selection 🏢",
      situation: "AI suggests mostly male leads. Correct approach?",
      choices: [
        { id: 1, text: "Go with AI suggestion 👨", isCorrect: false },
        { id: 2, text: "Balance male + female leads 👨👩", isCorrect: true },
      ],
    },
    {
      title: "New Hire Onboarding 📄",
      situation: "AI filters out female applicants unintentionally. Best action?",
      choices: [
        { id: 1, text: "Ignore bias 👦 only", isCorrect: false },
        { id: 2, text: "Correct bias, hire fairly 👦👧", isCorrect: true },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = scenarios[currentScenario].choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(15, true);
      setCoins(prev => prev + 15);
    }
    setShowFeedback(true);
  };

  const handleNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      navigate("/student/ai-for-all/teen/wrong-prediction-quizz"); // update to next game
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const current = scenarios[currentScenario];
  const selectedChoiceData = current.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="AI Bias Roleplay"
      subtitle="Fair Hiring Practices"
      onNext={handleNextScenario}
      nextEnabled={showFeedback}
      showGameOver={currentScenario === scenarios.length - 1 && showFeedback}
      score={coins}
      gameId="ai-teen-bias-roleplay"
      gameType="ai"
      totalLevels={20}
      currentLevel={68}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-4 text-center">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{current.title}</h2>
            <div className="bg-purple-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-green-500/50 border-green-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  {choice.text}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedChoice}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                selectedChoice
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  : "bg-gray-500/50 cursor-not-allowed"
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "✅ Correct!" : "❌ Try Again!"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🎉 Well Done!" : "💪 Let's Correct Bias!"}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! You ensured fair hiring by including both boys and girls. 🧑👩
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold text-center">
                  +15 Coins Earned! 🪙
                </p>
                <button
                  onClick={handleNextScenario}
                  className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Next Scenario ➡️
                </button>
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    AI can be biased! Adjust decisions to ensure fairness in hiring. Try again!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Try Again 🔁
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIBiasRoleplay;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIBiasStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 AI bias scenarios
  const scenarios = [
    {
      id: 1,
      title: "Football Team Bias",
      emoji: "⚽🤖",
      situation: "The robot is choosing players for a football team but picks only boys. What should it do?",
      choices: [
        { id: 1, text: "Keep only boys", emoji: "👦", isCorrect: false },
        { id: 2, text: "Include both boys and girls", emoji: "👦👧", isCorrect: true },
        { id: 3, text: "Cancel the team", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 2,
      title: "Job Hiring Bias",
      emoji: "💼🤖",
      situation: "The AI resumes only male applicants. How to fix it?",
      choices: [
        { id: 1, text: "Hire only males", emoji: "👨", isCorrect: false },
        { id: 2, text: "Consider all qualified applicants equally", emoji: "👩👨", isCorrect: true },
        { id: 3, text: "Ignore all applicants", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 3,
      title: "Scholarship Bias",
      emoji: "🎓🤖",
      situation: "AI gives scholarships only to students from a particular school. What should it do?",
      choices: [
        { id: 1, text: "Keep giving only to that school", emoji: "🏫", isCorrect: false },
        { id: 2, text: "Evaluate students from all schools fairly", emoji: "🏫🏫", isCorrect: true },
        { id: 3, text: "Cancel scholarships", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Loan Approval Bias",
      emoji: "🏦🤖",
      situation: "AI approves loans only for people from a certain neighborhood. How to correct it?",
      choices: [
        { id: 1, text: "Approve only for that neighborhood", emoji: "🏘️", isCorrect: false },
        { id: 2, text: "Consider all applicants fairly", emoji: "🏘️🏘️", isCorrect: true },
        { id: 3, text: "Stop all loans", emoji: "🚫", isCorrect: false },
      ],
    },
    {
      id: 5,
      title: "Medical Diagnosis Bias",
      emoji: "🩺🤖",
      situation: "AI diagnoses only men for a disease. What is the right approach?",
      choices: [
        { id: 1, text: "Diagnose men only", emoji: "👨", isCorrect: false },
        { id: 2, text: "Check all patients equally", emoji: "👩👨", isCorrect: true },
        { id: 3, text: "Ignore diagnosis", emoji: "🚫", isCorrect: false },
      ],
    },
  ];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const scenario = scenarios[currentScenario];
  const selectedChoiceData = scenario.choices.find((c) => c.id === selectedChoice);
  const isLastScenario = currentScenario === scenarios.length - 1;

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = scenario.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(15, false);
      setCoins((prev) => prev + 15);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!isLastScenario) {
      setCurrentScenario((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/kids/safe-ai-quiz"); // next game
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title={scenario.title}
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastScenario && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-79-${currentScenario + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={79 + currentScenario}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{scenario.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{scenario.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {scenario.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? "bg-purple-500/50 border-purple-400 ring-2 ring-white"
                      : "bg-white/20 border-white/40 hover:bg-white/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-lg">{choice.text}</div>
                  </div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🤝 Fair AI Builder!" : "🤔 Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">You earned 15 Coins! 🪙</p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {selectedChoiceData?.isCorrect && (
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                {isLastScenario ? "Finish" : "Next Scenario"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIBiasStory;

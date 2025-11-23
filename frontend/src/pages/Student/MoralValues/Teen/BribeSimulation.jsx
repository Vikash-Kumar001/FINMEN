import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BribeSimulation = () => {
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
      title: "Prize Competition 🏆",
      situation: "You're competing for a scholarship prize. Someone offers you money to help them cheat and win instead. What do you do?",
      choices: [
        { id: 1, text: "Accept the bribe - easy money", emoji: "💰", isCorrect: false },
        { id: 2, text: "Refuse and report the bribery attempt", emoji: "🛡️", isCorrect: true },
        { id: 3, text: "Take the money but don't help", emoji: "🤔", isCorrect: false },
      ],
    },
    {
      title: "Sports Tournament ⚽",
      situation: "A coach offers you a spot on the team in exchange for a gift. You really want to play. What do you do?",
      choices: [
        { id: 1, text: "Give the gift secretly", emoji: "🎁", isCorrect: false },
        { id: 2, text: "Say no and earn your spot through effort", emoji: "💪", isCorrect: true },
        { id: 3, text: "Tell no one but accept the offer", emoji: "😬", isCorrect: false },
      ],
    },
    {
      title: "Class Representative 🏫",
      situation: "A friend says they'll vote for you as class rep if you promise to give them answers in exams. What’s your response?",
      choices: [
        { id: 1, text: "Agree—it’s just one favor", emoji: "😏", isCorrect: false },
        { id: 2, text: "Refuse and focus on fair election", emoji: "🗳️", isCorrect: true },
        { id: 3, text: "Ignore it and hope they forget", emoji: "😐", isCorrect: false },
      ],
    },
    {
      title: "Office Internship 💼",
      situation: "Your supervisor offers extra marks if you get them a personal favor done illegally. What do you do?",
      choices: [
        { id: 1, text: "Comply—it could help your career", emoji: "💸", isCorrect: false },
        { id: 2, text: "Report it to HR or authorities", emoji: "📢", isCorrect: true },
        { id: 3, text: "Stay silent and walk away", emoji: "😶", isCorrect: false },
      ],
    },
    {
      title: "Exam Paper Leak 📄",
      situation: "Someone secretly offers the leaked paper a day before your exam for a small amount. What will you do?",
      choices: [
        { id: 1, text: "Buy it—everyone else might too", emoji: "😈", isCorrect: false },
        { id: 2, text: "Refuse and inform the authorities", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Tell your friends but don't buy", emoji: "🙄", isCorrect: false },
      ],
    },
  ];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = scenarios[currentScenario].choices.find((c) => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins((prev) => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentScenario + 1 < scenarios.length) {
      setCurrentScenario((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
      setSelectedChoice(null);
    }
  };

  const handleTryAgain = () => {
    setCurrentScenario(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/teen/debate-lying-for-friend");
  };

  const scenario = scenarios[currentScenario];
  const selectedChoiceData = scenario.choices.find((c) => c.id === selectedChoice);

  const quizComplete = currentScenario === scenarios.length - 1 && showFeedback;

  return (
    <GameShell
      title="Bribe Simulation"
      score={coins}
      subtitle="Testing Your Integrity"
      onNext={handleNext}
      nextEnabled={quizComplete && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={quizComplete && coins > 0}
      
      gameId="moral-teen-5"
      gameType="moral"
      totalLevels={20}
      currentLevel={5}
      showConfetti={quizComplete && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/teens"
    >
      <div className="space-y-8">
        {!quizComplete ? (
          !showFeedback ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
              <div className="text-7xl mb-4 text-center">{scenario.title.split(" ")[1]}</div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {scenario.title}
              </h2>
              <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-5 mb-6">
                <p className="text-white text-lg leading-relaxed">
                  {scenario.situation}
                </p>
              </div>

              <h3 className="text-white font-bold mb-4">What should you do?</h3>

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
                      <div className="text-white font-semibold text-lg">
                        {choice.text}
                      </div>
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

              <p className="text-center text-white/70 mt-4">
                Scenario {currentScenario + 1} of {scenarios.length}
              </p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="text-7xl mb-4 text-center">
                {selectedChoiceData?.emoji}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                {selectedChoiceData?.isCorrect ? "💎 Great Decision!" : "⚠️ Wrong Choice"}
              </h2>
              <p className="text-white/90 text-lg mb-6 text-center">
                {selectedChoiceData?.text}
              </p>

              {selectedChoiceData?.isCorrect ? (
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Excellent! Rejecting bribes builds integrity, honesty, and respect. 
                    You’re learning to stand strong against corruption!
                  </p>
                </div>
              ) : (
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    That choice shows weakness to bribery. Remember, shortcuts destroy 
                    trust and fairness. Always choose honesty.
                  </p>
                </div>
              )}

              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentScenario + 1 === scenarios.length
                  ? "Finish Quiz"
                  : "Next Scenario"}
              </button>
            </div>
          )
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              🎉 Bribery Awareness Complete!
            </h2>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-lg">
                You completed all scenarios on honesty and corruption awareness.
                Your score:{" "}
                <span className="text-yellow-300 font-bold">{coins}/5</span>
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins * 5} Coins! 🪙
            </p>
            <button
              onClick={handleTryAgain}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BribeSimulation;

import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FootballStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      id: 1,
      title: "Football Story 1",
      emoji: "⚽",
      situation: "You hog the ball and don’t pass. Is that teamwork?",
      choices: [
        { id: 1, text: "Yes, it's fine", emoji: "🙃", isCorrect: false },
        { id: 2, text: "No, teamwork means passing", emoji: "🤝", isCorrect: true },
      ],
    },
    {
      id: 2,
      title: "Football Story 2",
      emoji: "⚽",
      situation: "Your teammate is struggling to score. Do you help or ignore?",
      choices: [
        { id: 1, text: "Ignore, let them fail", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Support and encourage them", emoji: "💪", isCorrect: true },
      ],
    },
    {
      id: 3,
      title: "Football Story 3",
      emoji: "⚽",
      situation: "You see a teammate open for a pass. Do you pass?",
      choices: [
        { id: 1, text: "Yes, share the opportunity", emoji: "🏃‍♂️", isCorrect: true },
        { id: 2, text: "No, keep it for yourself", emoji: "😏", isCorrect: false },
      ],
    },
    {
      id: 4,
      title: "Football Story 4",
      emoji: "⚽",
      situation: "The team is losing. Do you stay motivated or give up?",
      choices: [
        { id: 1, text: "Give up, it's hopeless", emoji: "😓", isCorrect: false },
        { id: 2, text: "Stay motivated and try your best", emoji: "🔥", isCorrect: true },
      ],
    },
    {
      id: 5,
      title: "Football Story 5",
      emoji: "⚽",
      situation: "Someone makes a mistake. Do you blame them or support them?",
      choices: [
        { id: 1, text: "Blame them, it's their fault", emoji: "😠", isCorrect: false },
        { id: 2, text: "Support and help them improve", emoji: "🤗", isCorrect: true },
      ],
    },
  ];

  const currentData = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentData.choices.find((c) => c.id === selectedChoice);
    setShowFeedback(true);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(5, true);
      setCoins((prev) => prev + 5);

      // ✅ Auto move to next question after 2.5 seconds
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedChoice(null);
          setShowFeedback(false);
        } else {
          navigate("/student/moral-values/kids/quiz-cooperation");
        }
      }, 2500);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const selectedChoiceData = currentData.choices.find((c) => c.id === selectedChoice);

  return (
    <GameShell
      title="Football Story"
      subtitle="Teamwork Matters"
      score={coins}
      gameId="moral-kids-61"
      gameType="educational"
      totalLevels={100}
      currentLevel={61 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              {currentData.title}
            </h2>
            <div className="bg-blue-500/20 border-2 border-blue-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentData.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4">What should you do?</h3>

            <div className="space-y-3 mb-6">
              {currentData.choices.map((choice) => (
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
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">
              {selectedChoiceData?.emoji}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "🌟 Right Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">
              {selectedChoiceData?.text}
            </p>

            {selectedChoiceData?.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold text-center">
                You earned 5 Coins! 🪙
              </p>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FootballStory;

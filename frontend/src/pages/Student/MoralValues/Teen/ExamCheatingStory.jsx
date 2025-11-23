import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ExamCheatingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Five moral choice questions
  const questions = [
    {
      title: "Exam Temptation",
      emoji: "📝",
      situation:
        "During an important exam, you can easily see your friend’s answers. No one is watching. What do you do?",
      choices: [
        { id: 1, text: "Cheat - no one will know", emoji: "😈", isCorrect: false },
        { id: 2, text: "Do your own work honestly", emoji: "💎", isCorrect: true },
        { id: 3, text: "Copy just one answer", emoji: "🤔", isCorrect: false },
      ],
    },
    {
      title: "Friend’s Homework",
      emoji: "📚",
      situation:
        "Your friend forgot to do their homework and asks you to show yours. What do you do?",
      choices: [
        { id: 1, text: "Let them copy yours", emoji: "🤝", isCorrect: false },
        { id: 2, text: "Explain answers instead of copying", emoji: "💡", isCorrect: true },
        { id: 3, text: "Ignore them completely", emoji: "🙄", isCorrect: false },
      ],
    },
    {
      title: "Online Test",
      emoji: "💻",
      situation:
        "You have an online test and answers are available on Google. What will you do?",
      choices: [
        { id: 1, text: "Search answers online", emoji: "🔍", isCorrect: false },
        { id: 2, text: "Try solving yourself honestly", emoji: "🧠", isCorrect: true },
        { id: 3, text: "Ask AI for direct answers", emoji: "🤖", isCorrect: false },
      ],
    },
    {
      title: "Group Project Credit",
      emoji: "👥",
      situation:
        "Your team finishes a project, but your teacher praises only you. What do you do?",
      choices: [
        { id: 1, text: "Stay quiet and take all credit", emoji: "😶", isCorrect: false },
        { id: 2, text: "Acknowledge everyone’s effort", emoji: "🌟", isCorrect: true },
        { id: 3, text: "Tell teacher later privately", emoji: "🗣️", isCorrect: true },
      ],
    },
    {
      title: "Report Card",
      emoji: "📄",
      situation:
        "Your parents didn’t see your low grades yet. You can change marks before showing. What do you do?",
      choices: [
        { id: 1, text: "Change marks and show", emoji: "✏️", isCorrect: false },
        { id: 2, text: "Show honestly and discuss", emoji: "💬", isCorrect: true },
        { id: 3, text: "Hide report card", emoji: "🙈", isCorrect: false },
      ],
    },
  ];

  const current = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = current.choices.find((c) => c.id === selectedChoice);
    if (choice?.isCorrect) {
      showCorrectAnswerFeedback(2, true);
      setTotalCoins((prev) => prev + 2);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
      resetFeedback();
    } else {
      setShowFeedback(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  const handleFinish = () => {
    navigate("/student/moral-values/teen/roleplay-truthful-leader");
  };

  const selectedChoiceData = current.choices.find((c) => c.id === selectedChoice);

  const isLast = currentQuestion === questions.length - 1;

  return (
    <GameShell
      title="Exam Cheating Story"
      subtitle="Academic Integrity Quiz"
      onNext={isLast && showFeedback ? handleFinish : undefined}
      nextEnabled={isLast && showFeedback}
      showGameOver={isLast && showFeedback}
      score={totalCoins}
      gameId="moral-teen-8"
      gameType="moral"
      totalLevels={20}
      currentLevel={8}
      showConfetti={isLast && showFeedback}
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
            <div className="text-8xl mb-4 text-center">{current.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center text-black-400">
              {current.title}
            </h2>
            <div className="bg-orange-500/20 border-2 border-orange-400 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed">{current.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {current.choices.map((choice) => (
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
                    <div className="text-3xl">{choice.emoji}</div>
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4">{selectedChoiceData?.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData?.isCorrect ? "💎 Honest Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Great! Integrity means doing the right thing even when no one is watching.
                  </p>
                </div>
                <p className="text-yellow-400 text-2xl font-bold mb-4">
                  +2 Coins Earned! 🪙
                </p>
                {!isLast && (
                  <button
                    onClick={handleNextQuestion}
                    className="mt-2 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Next Question →
                  </button>
                )}
                {isLast && (
                  <button
                    onClick={handleFinish}
                    className="mt-2 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                  >
                    Finish Game 🎯
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white text-center">
                    Integrity matters! Cheating or hiding truth weakens your values. Try again!
                  </p>
                </div>
                <button
                  onClick={handleTryAgain}
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

export default ExamCheatingStory;

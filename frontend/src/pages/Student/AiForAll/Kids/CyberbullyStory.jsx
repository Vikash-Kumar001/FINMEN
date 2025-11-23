import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CyberbullyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A robot posts mean comments online. What should you do?",
      emoji: "💻🤖💬",
      choices: [
        { id: 1, text: "Ignore it", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Report it", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Join and make fun too", emoji: "😈", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "Someone shares hurtful memes online. What's the right action?",
      emoji: "📱😡",
      choices: [
        { id: 1, text: "Laugh along", emoji: "😂", isCorrect: false },
        { id: 2, text: "Report it", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ignore it", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 3,
      text: "A classmate is being mocked in the chat group. What should you do?",
      emoji: "👧💬😢",
      choices: [
        { id: 1, text: "Join in", emoji: "😈", isCorrect: false },
        { id: 2, text: "Report it to teacher/parent", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ignore it", emoji: "🙈", isCorrect: false },
      ],
    },
    {
      id: 4,
      text: "Someone spreads rumors online about a friend. Your action?",
      emoji: "📰🤖",
      choices: [
        { id: 1, text: "Share it further", emoji: "📤", isCorrect: false },
        { id: 2, text: "Report and support friend", emoji: "🚨💖", isCorrect: true },
        { id: 3, text: "Laugh at it", emoji: "😂", isCorrect: false },
      ],
    },
    {
      id: 5,
      text: "You notice a cyberbully targeting someone in a game chat. What do you do?",
      emoji: "🎮💬",
      choices: [
        { id: 1, text: "Join them", emoji: "😈", isCorrect: false },
        { id: 2, text: "Report to moderators", emoji: "🚨", isCorrect: true },
        { id: 3, text: "Ignore it", emoji: "🙈", isCorrect: false },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);

  const question = questions[currentQuestion];
  const selectedChoiceData = question.choices.find((c) => c.id === selectedChoice);
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleChoice = (choiceId) => setSelectedChoice(choiceId);

  const handleConfirm = () => {
    const choice = question.choices.find((c) => c.id === selectedChoice);
    if (choice.isCorrect) {
      showCorrectAnswerFeedback(10, false);
      setCoins((prev) => prev + 10);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      navigate("/student/ai-for-all/kids/ai-rights-puzzle"); // Next game
    }
  };

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Cyberbully Story"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showFeedback && selectedChoiceData?.isCorrect}
      showGameOver={isLastQuestion && showFeedback && selectedChoiceData?.isCorrect}
      score={coins}
      gameId={`ai-kids-84-${currentQuestion + 1}`}
      gameType="ai"
      totalLevels={100}
      currentLevel={84 + currentQuestion}
      showConfetti={showFeedback && selectedChoiceData?.isCorrect}
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={() => {}}
      showAnswerConfetti={() => {}}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-xl mx-auto">
            <div className="text-8xl mb-4 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{question.text}</h2>

            <div className="space-y-3 mb-6">
              {question.choices.map((choice) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-xl mx-auto">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData?.isCorrect ? "🚨" : "🤔"}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData?.isCorrect ? "Good Job!" : "Try Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData?.text}</p>

            {selectedChoiceData?.isCorrect ? (
              <>
                <p className="text-yellow-400 text-2xl font-bold mb-4">
                  You earned 10 Coins! 🪙
                </p>
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                  {isLastQuestion ? "Finish" : "Next Question"}
                </button>
              </>
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

export default CyberbullyStory;

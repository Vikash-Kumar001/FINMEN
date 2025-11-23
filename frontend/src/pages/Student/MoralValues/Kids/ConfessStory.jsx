import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ConfessStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      title: "Broken Vase",
      emoji: "🏺",
      situation: "You accidentally broke a vase at home. Do you confess?",
      choices: [
        { id: 1, text: "Hide it", emoji: "🙈", isCorrect: false },
        { id: 2, text: "Confess", emoji: "🙋‍♂️", isCorrect: true }
      ]
    },
    {
      title: "Lost Book",
      emoji: "📖",
      situation: "You lost your friend's book. Do you tell them?",
      choices: [
        { id: 1, text: "Keep it secret", emoji: "🤫", isCorrect: false },
        { id: 2, text: "Tell the truth", emoji: "🗣️", isCorrect: true }
      ]
    },
    {
      title: "Forgot Homework",
      emoji: "📝",
      situation: "You forgot to do your homework. What do you do?",
      choices: [
        { id: 1, text: "Lie and say it's done", emoji: "😅", isCorrect: false },
        { id: 2, text: "Admit you forgot", emoji: "🙇", isCorrect: true }
      ]
    },
    {
      title: "Spilled Juice",
      emoji: "🥤",
      situation: "You spilled juice on the table. Confess or hide?",
      choices: [
        { id: 1, text: "Hide it", emoji: "🙊", isCorrect: false },
        { id: 2, text: "Confess", emoji: "🙋‍♀️", isCorrect: true }
      ]
    },
    {
      title: "Broken Toy",
      emoji: "🧸",
      situation: "You accidentally broke your sibling's toy. What do you do?",
      choices: [
        { id: 1, text: "Blame someone else", emoji: "🤥", isCorrect: false },
        { id: 2, text: "Confess and apologize", emoji: "🙏", isCorrect: true }
      ]
    }
  ];

  const question = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = question.choices.find(c => c.id === selectedChoice);

    if (choice.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      // Final score handling
      if (coins === questions.length) {
        setCoins(5); // total reward
      }
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/moral-values/kids/poster-courage");
  };

  const selectedChoiceData = question.choices.find(c => c.id === selectedChoice);

  return (
    <GameShell
      title="Confess Story"
      score={coins}
      subtitle={`Story ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={currentQuestion === questions.length - 1 && showFeedback && coins > 0}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={currentQuestion === questions.length - 1 && showFeedback && coins > 0}
      
      gameId="moral-kids-55"
      gameType="educational"
      totalLevels={100}
      currentLevel={55}
      showConfetti={currentQuestion === questions.length - 1 && showFeedback && coins > 0}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/moral-values/kids"
    >
      <div className="space-y-8">
        {!showFeedback ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{question.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{question.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg leading-relaxed text-center">{question.situation}</p>
            </div>

            <div className="space-y-3 mb-6">
              {question.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all text-left ${
                    selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Confirm Choice
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {selectedChoiceData.isCorrect ? "🌟 Honest Choice!" : "Think Again..."}
            </h2>
            <p className="text-white/90 text-lg mb-6 text-center">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <button
                onClick={handleNextQuestion}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {currentQuestion < questions.length - 1 ? "Next Story" : "Finish"}
              </button>
            ) : (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}

            {currentQuestion === questions.length - 1 && selectedChoiceData.isCorrect && coins === questions.length && (
              <p className="text-yellow-400 text-2xl font-bold text-center mt-4">
                You earned 5 Coins! 🪙
              </p>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ConfessStory;

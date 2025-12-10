import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIArtistGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const quizQuestions = [
    {
      text: "Can AI help you draw creative pictures from your ideas?",
      emoji: "🎨",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Yes! AI can turn your words into amazing pictures, just like DALL·E or other art generators.",
    },
    {
      text: "Can AI draw a flying cat if you tell it to?",
      emoji: "🐱✨",
      choices: [
        { id: 1, text: "No", emoji: "❌", isCorrect: false },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: true },
      ],
      explanation:
        "Yes! AI can imagine and draw creative scenes from your text prompts — even flying cats!",
    },
    {
      text: "Does AI use data from artists to learn how to draw?",
      emoji: "🧠🖌️",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "AI learns from many artworks and styles to understand colors, shapes, and how to draw objects.",
    },
    {
      text: "Can AI draw emotions, like a happy or sad face?",
      emoji: "😊😢",
      choices: [
        { id: 1, text: "No", emoji: "❌", isCorrect: false },
        { id: 2, text: "Yes", emoji: "✅", isCorrect: true },
      ],
      explanation:
        "Yes! AI can capture emotions and expressions when asked, just like an artist does.",
    },
    {
      text: "Can humans and AI work together to make art?",
      emoji: "🤝🎨",
      choices: [
        { id: 1, text: "Yes", emoji: "✅", isCorrect: true },
        { id: 2, text: "No", emoji: "❌", isCorrect: false },
      ],
      explanation:
        "Of course! Many artists use AI tools to enhance creativity — AI helps, but you imagine!",
    },
  ];

  // Function to get choices without rotation - keeping actual positions fixed
  const getRotatedChoices = (choices, questionIndex) => {
    // Return choices without any rotation to keep their actual positions fixed
    return choices;
  };

  const currentQuestion = quizQuestions[currentIndex];
  const displayChoices = getRotatedChoices(currentQuestion.choices, currentIndex);

  const handleChoice = (choiceId) => {
    const choice = currentQuestion.choices.find((c) => c.id === choiceId);
    const isCorrect = choice?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }

    // Move to next question after a short delay
    if (currentIndex < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        resetFeedback();
      }, 300);
    } else {
      // Show final result
      setTimeout(() => {
        setShowResult(true);
      }, 300);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentIndex(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/music-ai-story"); // update next route as needed
  };

  const accuracy = Math.round((score / quizQuestions.length) * 100);

  return (
    <GameShell
      title="AI Artist Game 🎨"
      subtitle={!showResult ? `Question ${currentIndex + 1} of ${quizQuestions.length}` : ""}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      score={score}
      gameId="ai-kids-43"
      gameType="ai"
      totalLevels={quizQuestions.length}
      // Fixed the currentLevel parameter to properly reflect progress
      currentLevel={currentIndex + 1}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
      // Added maxScore to ensure proper calculation
      maxScore={totalCoins}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center">{currentQuestion.emoji}</div>
            <h3 className="text-white text-2xl font-bold mb-6 text-center">
              {currentQuestion.text}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {displayChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-purple-500/30 hover:bg-purple-500/50 border-3 border-purple-400 rounded-xl p-8 transition-all transform hover:scale-105"
                >
                  <div className="text-5xl mb-2">{choice.emoji}</div>
                  <div className="text-white font-bold text-xl">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Great Job!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {quizQuestions.length} questions correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI artists are amazing tools that can help bring your creative visions to life. Great job learning about them!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {score} Points! 🪙
            </p>
            {accuracy < 70 && (
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

export default AIArtistGame;
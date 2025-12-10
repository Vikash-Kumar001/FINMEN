import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const YouTubeRecommendation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const questions = [
    {
      text: "What kind of videos should AI recommend to kids?",
      emoji: "📺",
      choices: [
        { id: 1, text: "Cartoons 🧸", isCorrect: true },
        { id: 2, text: "Adult Shows 📺", isCorrect: false },
      ],
      feedback:
        "Perfect! AI recommends fun and safe videos like cartoons or songs for kids!",
    },
    {
      text: "Which of these is a fun and educational video for kids?",
      emoji: "🎓",
      choices: [
        { id: 1, text: "Politics Debate 🏛️", isCorrect: false },
        { id: 2, text: "Science Experiment 🔬", isCorrect: true },
        
      ],
      feedback:
        "Correct! Science experiments teach and entertain kids — AI loves recommending such videos!",
    },
    {
      text: "If you watch DIY craft videos often, what will YouTube show next?",
      emoji: "✂️",
      choices: [
        { id: 1, text: "More DIY Craft Videos 🎨", isCorrect: true },
        { id: 2, text: "Random Scary Movies 👻", isCorrect: false },
      ],
      feedback:
        "Right! AI tracks your watching patterns and recommends more of what you enjoy — like crafts!",
    },
    {
      text: "AI uses what to decide your recommendations?",
      emoji: "🧠",
      choices: [
        { id: 1, text: "Your Watch History 📜", isCorrect: true },
        { id: 2, text: "Random Guessing 🎲", isCorrect: false },
      ],
      feedback:
        "Exactly! AI learns from your watch history and behavior to give smarter video suggestions.",
    },
    {
      text: "Why does YouTube ask 'Do you like this video?'",
      emoji: "👍",
      choices: [
        { id: 1, text: "Just for fun 🎈", isCorrect: false },
        { id: 2, text: "To learn your taste and improve recommendations 💡", isCorrect: true },
        
      ],
      feedback:
        "Yes! When you like or dislike a video, AI learns your preferences to show better content next time!",
    },
  ];

  const question = questions[currentQuestion];

  const handleChoice = (choiceId) => {
    const choice = question.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/smart-fridge-story");
  };

  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <GameShell
      title="YouTube Recommendation Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      showGameOver={showResult && accuracy >= 70}
      score={score}
      gameId="ai-kids-29"
      gameType="ai"
      totalLevels={20}
      currentLevel={29}
      showConfetti={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Test Your Knowledge</h3>
            
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="text-6xl mb-3 text-center">{question.emoji}</div>
              <p className="text-white text-xl font-semibold text-center">"{question.text}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {question.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-white/20 hover:bg-white/30 border-3 border-white/40 rounded-xl p-8 transition-all transform hover:scale-105"
                >
                  <div className="text-5xl mb-2">{choice.text.split(" ")[1]}</div>
                  <div className="text-white font-bold text-xl">{choice.text}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Recommendation Expert!" : "💪 Keep Learning!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You answered {score} out of {questions.length} correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI recommendation systems learn from your preferences to suggest content you'll enjoy!
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

export default YouTubeRecommendation;
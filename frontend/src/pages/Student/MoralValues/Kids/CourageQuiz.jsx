import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CourageQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      text: "Which shows courage?",
      emoji: "💪",
      choices: [
        { id: 1, text: "Running away", emoji: "🏃", isCorrect: false },
        { id: 2, text: "Speaking the truth", emoji: "🗣️", isCorrect: true },
        { id: 3, text: "Hiding from problems", emoji: "🙈", isCorrect: false }
      ]
    },
    {
      text: "You see someone being bullied. What is the courageous thing to do?",
      emoji: "🛡️",
      choices: [
        { id: 1, text: "Stand up and help", emoji: "✊", isCorrect: true },
        { id: 2, text: "Ignore it", emoji: "🙄", isCorrect: false },
        { id: 3, text: "Laugh along", emoji: "😂", isCorrect: false }
      ]
    },
    {
      text: "You made a mistake in class. Courage means you should?",
      emoji: "📚",
      choices: [
        { id: 1, text: "Blame someone else", emoji: "👤", isCorrect: false },
        { id: 2, text: "Admit your mistake", emoji: "🙋", isCorrect: true },
        { id: 3, text: "Stay quiet and hope nobody notices", emoji: "🤫", isCorrect: false }
      ]
    },
    {
      text: "A friend dares you to speak up about a wrong rule. Courage is?",
      emoji: "🎤",
      choices: [
        { id: 1, text: "Stay silent", emoji: "🤐", isCorrect: false },
        { id: 2, text: "Politely speak your mind", emoji: "🗨️", isCorrect: true },
        { id: 3, text: "Mock the rule and tease others", emoji: "😏", isCorrect: false }
      ]
    },
    {
      text: "Facing your fears in the dark or a new challenge shows?",
      emoji: "🌌",
      choices: [
        { id: 1, text: "Courage", emoji: "💪", isCorrect: true },
        { id: 2, text: "Cowardice", emoji: "😨", isCorrect: false },
        { id: 3, text: "Indifference", emoji: "😐", isCorrect: false }
      ]
    }
  ];

  const currentQuestionData = questions[currentQuestion];
  const selectedChoiceData = currentQuestionData.choices.find(c => c.id === selectedChoice);

  const handleChoice = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    const choice = currentQuestionData.choices.find(c => c.id === selectedChoice);
    if (choice.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(3, true);
    }
    setShowFeedback(true);
  };

  // ✅ Automatically move to next question after correct feedback
  useEffect(() => {
    if (showFeedback && selectedChoiceData?.isCorrect) {
      const timer = setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedChoice(null);
          setShowFeedback(false);
        } else {
          navigate("/student/moral-values/kids/reflex-brave-scared");
        }
      }, 2000); // 2 seconds delay before next question
      return () => clearTimeout(timer);
    }
  }, [showFeedback, selectedChoiceData, currentQuestion, navigate]);

  const handleTryAgain = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Courage Quiz"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      score={score * 3}
      gameId="moral-kids-52"
      gameType="educational"
      totalLevels={100}
      currentLevel={52}
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
            <div className="text-8xl mb-6 text-center">{currentQuestionData.emoji}</div>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-white text-xl leading-relaxed text-center font-semibold">
                {currentQuestionData.text}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {currentQuestionData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`w-full border-2 rounded-xl p-5 transition-all ${
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
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-7xl mb-4">{selectedChoiceData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {selectedChoiceData.isCorrect ? "✨ Correct!" : "Not Quite..."}
            </h2>
            <p className="text-white/90 text-lg mb-6">{selectedChoiceData.text}</p>

            {selectedChoiceData.isCorrect ? (
              <p className="text-yellow-400 text-2xl font-bold">You earned 3 Coins! 🪙</p>
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

export default CourageQuiz;

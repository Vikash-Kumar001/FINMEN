import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPeerPressure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Peer pressure means?",
      options: [
        { id: "a", text: "Friends push you" },
        { id: "b", text: "Teacher teaches" },
        { id: "c", text: "Parents advise" }
      ],
      correctAnswer: "a",
      explanation: "Peer pressure is when friends or peers try to influence your behavior, choices, or actions."
    },
    {
      id: 2,
      text: "Which is a positive example of peer influence?",
      options: [
        { id: "a", text: "Friends encouraging you to study together" },
        { id: "b", text: "Friends pressuring you to skip class" },
        { id: "c", text: "Friends daring you to break rules" }
      ],
      correctAnswer: "a",
      explanation: "When friends encourage positive behaviors like studying together, that's healthy peer influence."
    },
    {
      id: 3,
      text: "What's the best way to resist negative peer pressure?",
      options: [
        { id: "a", text: "Practice saying no and suggest alternatives" },
        { id: "b", text: "Always agree to avoid conflict" },
        { id: "c", text: "Ignore your friends completely" }
      ],
      correctAnswer: "a",
      explanation: "Learning to say no respectfully and suggesting positive alternatives helps you maintain your values while keeping friendships."
    },
    {
      id: 4,
      text: "Which situation shows negative peer pressure?",
      options: [
        { id: "a", text: "Friends invite you to join a study group" },
        { id: "b", text: "Friends pressure you to try alcohol" },
        { id: "c", text: "Friends encourage you to join sports" }
      ],
      correctAnswer: "b",
      explanation: "Pressuring someone to try alcohol or other harmful substances is negative peer pressure that can be dangerous."
    },
    {
      id: 5,
      text: "Why is it important to choose your friends carefully?",
      options: [
        { id: "a", text: "Good friends support your goals and values" },
        { id: "b", text: "Friends should always agree with you" },
        { id: "c", text: "Having many friends is more important" }
      ],
      correctAnswer: "a",
      explanation: "Good friends support your goals, respect your values, and encourage positive behaviors."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Peer Pressure"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-62"
      gameType="health-female"
      totalLevels={70}
      currentLevel={62}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="space-y-3">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    showCorrect
                      ? 'bg-green-500/20 border-2 border-green-500 text-white'
                      : showIncorrect
                      ? 'bg-red-500/20 border-2 border-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-500 text-white'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-lg mr-3 font-bold">
                      {option.id.toUpperCase()}.
                    </div>
                    <div>{option.text}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnPeerPressure;
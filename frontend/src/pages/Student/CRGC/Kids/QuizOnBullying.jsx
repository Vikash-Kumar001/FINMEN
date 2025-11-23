import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnBullying = () => {
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
      text: "Bullying means?",
      options: [
        { id: "a", text: "Hurting others on purpose" },
        { id: "b", text: "Helping others" },
        { id: "c", text: "Playing nicely with friends" }
      ],
      correctAnswer: "a",
      explanation: "Bullying is when someone intentionally hurts, threatens, or intimidates another person. It's not accidental and it's not helpful behavior."
    },
    {
      id: 2,
      text: "Which of these is NOT bullying?",
      options: [
        { id: "a", text: "Teasing someone repeatedly" },
        { id: "b", text: "Accidentally bumping into someone" },
        { id: "c", text: "Spreading rumors about someone" }
      ],
      correctAnswer: "b",
      explanation: "Accidentally bumping into someone is not bullying because it's not done on purpose. Bullying requires intent to hurt."
    },
    {
      id: 3,
      text: "What should you do if you see bullying?",
      options: [
        { id: "a", text: "Join in for fun" },
        { id: "b", text: "Ignore it completely" },
        { id: "c", text: "Tell a trusted adult" }
      ],
      correctAnswer: "c",
      explanation: "Telling a trusted adult is the best way to help stop bullying. Adults can intervene and make sure everyone stays safe."
    },
    {
      id: 4,
      text: "Cyberbullying happens:",
      options: [
        { id: "a", text: "Only at school" },
        { id: "b", text: "Only through technology" },
        { id: "c", text: "Only in person" }
      ],
      correctAnswer: "b",
      explanation: "Cyberbullying happens through technology like phones, computers, and social media. It's important to be kind online just like in person."
    },
    {
      id: 5,
      text: "If someone is bullying you, you should:",
      options: [
        { id: "a", text: "Keep it a secret" },
        { id: "b", text: "Tell a trusted adult" },
        { id: "c", text: "Bully them back" }
      ],
      correctAnswer: "b",
      explanation: "Telling a trusted adult is the best way to get help. Bullying back or keeping it secret often makes the problem worse."
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Bullying"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-32"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={32}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/kids"
    
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

export default QuizOnBullying;
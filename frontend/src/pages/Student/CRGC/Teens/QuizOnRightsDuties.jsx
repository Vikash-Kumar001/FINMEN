import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnRightsDuties = () => {
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
      text: "Which is a civic duty?",
      options: [
        { id: "a", text: "Pay taxes" },
        { id: "b", text: "Waste resources" },
        { id: "c", text: "Ignore laws" }
      ],
      correctAnswer: "a",
      explanation: "Paying taxes is a civic duty that helps fund public services like schools, hospitals, and infrastructure that benefit society."
    },
    {
      id: 2,
      text: "Which is a fundamental right?",
      options: [
        { id: "a", text: "Freedom of speech" },
        { id: "b", text: "Breaking traffic rules" },
        { id: "c", text: "Not attending school" }
      ],
      correctAnswer: "a",
      explanation: "Freedom of speech is a fundamental right that allows citizens to express their opinions and ideas without fear of government retaliation."
    },
    {
      id: 3,
      text: "What is the relationship between rights and duties?",
      options: [
        { id: "a", text: "They balance each other" },
        { id: "b", text: "Duties are more important" },
        { id: "c", text: "Rights are more important" }
      ],
      correctAnswer: "a",
      explanation: "Rights and duties balance each other - we enjoy rights but also have responsibilities to respect others' rights and contribute to society."
    },
    {
      id: 4,
      text: "Which is an example of exercising a right responsibly?",
      options: [
        { id: "a", text: "Voting in elections" },
        { id: "b", text: "Polluting the environment" },
        { id: "c", text: "Disrespecting others" }
      ],
      correctAnswer: "a",
      explanation: "Voting in elections is an example of exercising the right to participate in democracy while fulfilling the duty to contribute to governance."
    },
    {
      id: 5,
      text: "Why are civic duties important for society?",
      options: [
        { id: "a", text: "They help maintain order and collective welfare" },
        { id: "b", text: "They restrict personal freedom" },
        { id: "c", text: "They benefit only the government" }
      ],
      correctAnswer: "a",
      explanation: "Civic duties help maintain social order and collective welfare by ensuring citizens contribute to the functioning and improvement of society."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption) return; // Prevent changing answer after selection
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  if (gameFinished) {
    return (
      <GameShell
        title="Quiz on Rights & Duties"
        subtitle="Quiz Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-72"
        gameType="civic-responsibility"
        totalLevels={80}
        currentLevel={72}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand rights and duties!
          </div>
          <p className="text-white/80">
            Remember: Rights and duties go hand in hand - we enjoy rights but also have responsibilities to our society!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Rights & Duties"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-6">
            {getCurrentQuestion().text}
          </h2>

          <div className="space-y-4">
            {getCurrentQuestion().options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                disabled={selectedOption}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedOption
                    ? option.id === getCurrentQuestion().correctAnswer
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : selectedOption === option.id
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-white/10 border border-white/20'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="font-bold text-white">{option.id.toUpperCase()}</span>
                  </div>
                  <span className="text-white">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500'
                : 'bg-red-500/20 border border-red-500'
            }`}>
              <p className={selectedOption === getCurrentQuestion().correctAnswer ? 'text-green-300' : 'text-red-300'}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! '
                  : 'Incorrect. '}
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnRightsDuties;
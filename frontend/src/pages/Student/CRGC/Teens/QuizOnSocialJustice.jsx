import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnSocialJustice = () => {
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
      text: "What does social justice mean?",
      options: [
        { id: "a", text: "Fairness for all people" },
        { id: "b", text: "Favouritism toward certain groups" },
        { id: "c", text: "Ignoring inequality" }
      ],
      correctAnswer: "a",
      explanation: "Social justice means ensuring fairness and equal opportunities for all people, regardless of their background or circumstances."
    },
    {
      id: 2,
      text: "Which is a key principle of social justice?",
      options: [
        { id: "a", text: "Equal access to opportunities" },
        { id: "b", text: "Privilege based on wealth" },
        { id: "c", text: "Accepting inequality as natural" }
      ],
      correctAnswer: "a",
      explanation: "Equal access to opportunities is fundamental to social justice, ensuring everyone can pursue their potential regardless of their starting point."
    },
    {
      id: 3,
      text: "Why is social justice important for society?",
      options: [
        { id: "a", text: "It creates a more equitable and peaceful society" },
        { id: "b", text: "It benefits only certain groups" },
        { id: "c", text: "It eliminates all differences between people" }
      ],
      correctAnswer: "a",
      explanation: "Social justice creates a more equitable society where everyone has the opportunity to thrive, leading to greater peace and prosperity for all."
    },
    {
      id: 4,
      text: "Which action promotes social justice?",
      options: [
        { id: "a", text: "Advocating for marginalized communities" },
        { id: "b", text: "Ignoring systemic inequalities" },
        { id: "c", text: "Perpetuating stereotypes" }
      ],
      correctAnswer: "a",
      explanation: "Advocating for marginalized communities helps address systemic inequalities and ensures their voices are heard in creating solutions."
    },
    {
      id: 5,
      text: "How can teens contribute to social justice?",
      options: [
        { id: "a", text: "By educating themselves and raising awareness" },
        { id: "b", text: "By accepting the status quo" },
        { id: "c", text: "By avoiding difficult conversations" }
      ],
      correctAnswer: "a",
      explanation: "Teens can contribute to social justice by learning about issues, engaging in respectful dialogue, and supporting causes they believe in."
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
        title="Quiz on Social Justice"
        subtitle="Quiz Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-62"
        gameType="civic-responsibility"
        totalLevels={70}
        currentLevel={62}
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
            You understand social justice!
          </div>
          <p className="text-white/80">
            Remember: Social justice means fairness for all people and equal access to opportunities regardless of background!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Social Justice"
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

export default QuizOnSocialJustice;
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateApologyStrength = () => {
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
      text: "Is saying sorry a weakness or strength?",
      options: [
        { id: "a", text: "Weakness - It shows you lost the argument" },
        { id: "b", text: "Strength - It shows emotional maturity and courage" },
        { id: "c", text: "Neither - It's just a social convention" }
      ],
      correctAnswer: "b",
      explanation: "Apologizing takes courage and shows emotional maturity. It's a strength that helps maintain healthy relationships."
    },
    {
      id: 2,
      text: "What is the main benefit of apologizing when you've hurt someone?",
      options: [
        { id: "a", text: "It prevents the other person from getting revenge" },
        { id: "b", text: "It helps repair relationships and shows accountability" },
        { id: "c", text: "It makes you look better to others" }
      ],
      correctAnswer: "b",
      explanation: "Apologizing helps repair damaged relationships and shows that you take responsibility for your actions."
    },
    {
      id: 3,
      text: "When is the best time to apologize after a conflict?",
      options: [
        { id: "a", text: "Immediately, even if emotions are still high" },
        { id: "b", text: "After cooling down and reflecting on what happened" },
        { id: "c", text: "Only if the other person apologizes first" }
      ],
      correctAnswer: "b",
      explanation: "Taking time to cool down and reflect ensures that your apology is sincere and thoughtful rather than reactive."
    },
    {
      id: 4,
      text: "What should a good apology include?",
      options: [
        { id: "a", text: "An explanation of why you were right" },
        { id: "b", text: "Acknowledgment of hurt caused and commitment to change" },
        { id: "c", text: "A promise that it will never happen again" }
      ],
      correctAnswer: "b",
      explanation: "A meaningful apology acknowledges the harm caused and shows commitment to improving, which builds trust."
    },
    {
      id: 5,
      text: "How does apologizing affect your self-respect?",
      options: [
        { id: "a", text: "It decreases because you admit fault" },
        { id: "b", text: "It increases because you act with integrity" },
        { id: "c", text: "It has no effect either way" }
      ],
      correctAnswer: "b",
      explanation: "Acting with integrity by apologizing when appropriate actually increases self-respect because you're being honest and responsible."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption) return; // Prevent changing answer after selection
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      setCoins(prev => prev + 2);
      showCorrectAnswerFeedback(2, true);
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
        title="Debate: Apology = Weakness?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-46"
        gameType="civic-responsibility"
        totalLevels={50}
        currentLevel={46}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length * 2} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand the strength in taking responsibility!
          </div>
          <p className="text-white/80">
            Remember: Apologizing with sincerity shows emotional intelligence and builds stronger relationships!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Apology = Weakness?"
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

export default DebateApologyStrength;
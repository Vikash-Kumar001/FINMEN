import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateAllHumansEqual = () => {
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
      text: "Should all humans have equal rights?",
      options: [
        { id: "a", text: "Yes, equality is fundamental to justice" },
        { id: "b", text: "No, some people deserve more rights" },
        { id: "c", text: "It depends on circumstances" }
      ],
      correctAnswer: "a",
      explanation: "All humans have inherent dignity and should have equal rights regardless of their background, beliefs, or circumstances."
    },
    {
      id: 2,
      text: "What is the basis for human equality?",
      options: [
        { id: "a", text: "Inherent human dignity" },
        { id: "b", text: "Economic status" },
        { id: "c", text: "Cultural background" }
      ],
      correctAnswer: "a",
      explanation: "Human equality is based on inherent dignity that all people possess simply by being human, not on external factors."
    },
    {
      id: 3,
      text: "How does equality benefit society?",
      options: [
        { id: "a", text: "Creates stability and reduces conflict" },
        { id: "b", text: "Eliminates all differences between people" },
        { id: "c", text: "Only benefits certain groups" }
      ],
      correctAnswer: "a",
      explanation: "Equality creates a more stable society where everyone has opportunities to contribute, reducing conflict and promoting prosperity."
    },
    {
      id: 4,
      text: "What happens when equality is denied?",
      options: [
        { id: "a", text: "Social tension and injustice increase" },
        { id: "b", text: "Society becomes more efficient" },
        { id: "c", text: "Nothing significant changes" }
      ],
      correctAnswer: "a",
      explanation: "When equality is denied, it creates social tension, injustice, and can lead to conflict as people fight for their rights."
    },
    {
      id: 5,
      text: "How can we promote human equality?",
      options: [
        { id: "a", text: "Through education and advocacy" },
        { id: "b", text: "By maintaining existing hierarchies" },
        { id: "c", text: "By ignoring differences" }
      ],
      correctAnswer: "a",
      explanation: "Education and advocacy help people understand the importance of equality and work together to create a more just society."
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
        title="Debate: All Humans Equal?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-66"
        gameType="civic-responsibility"
        totalLevels={70}
        currentLevel={66}
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
            You understand human equality!
          </div>
          <p className="text-white/80">
            Remember: All humans have inherent dignity and deserve equal rights regardless of their background or circumstances!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: All Humans Equal?"
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

export default DebateAllHumansEqual;
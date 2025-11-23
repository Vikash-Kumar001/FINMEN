import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateServiceWaste = () => {
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
      text: "Is community service a waste of time?",
      options: [
        { id: "a", text: "Yes, it takes away from personal activities" },
        { id: "b", text: "No, it builds society and develops skills" },
        { id: "c", text: "Only if you don't enjoy it" }
      ],
      correctAnswer: "b",
      explanation: "Community service contributes to building stronger communities and helps individuals develop valuable life skills like leadership, empathy, and teamwork."
    },
    {
      id: 2,
      text: "What is a key benefit of volunteering for teens?",
      options: [
        { id: "a", text: "It guarantees college admission" },
        { id: "b", text: "It builds character and social awareness" },
        { id: "c", text: "It provides free meals" }
      ],
      correctAnswer: "b",
      explanation: "Volunteering helps teens develop character, gain real-world experience, and become more socially aware and responsible citizens."
    },
    {
      id: 3,
      text: "How does community service impact the volunteer?",
      options: [
        { id: "a", text: "It creates a sense of purpose and fulfillment" },
        { id: "b", text: "It reduces time for studying" },
        { id: "c", text: "It guarantees financial rewards" }
      ],
      correctAnswer: "a",
      explanation: "Community service often creates a sense of purpose and fulfillment by allowing individuals to make a positive impact and connect with their community."
    },
    {
      id: 4,
      text: "What is the broader impact of widespread community service?",
      options: [
        { id: "a", text: "It creates dependency on volunteers" },
        { id: "b", text: "It strengthens communities and addresses needs" },
        { id: "c", text: "It replaces government responsibilities" }
      ],
      correctAnswer: "b",
      explanation: "Widespread community service strengthens communities by addressing local needs, fostering connections, and creating positive social change."
    },
    {
      id: 5,
      text: "Why should schools encourage community service?",
      options: [
        { id: "a", text: "To reduce school operational costs" },
        { id: "b", text: "To develop well-rounded, socially responsible students" },
        { id: "c", text: "To replace academic subjects" }
      ],
      correctAnswer: "b",
      explanation: "Schools should encourage community service to help develop well-rounded students who are socially responsible and understand their role in society."
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
        title="Debate: Service = Waste?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-56"
        gameType="civic-responsibility"
        totalLevels={60}
        currentLevel={56}
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
            You understand the value of community service!
          </div>
          <p className="text-white/80">
            Remember: Community service builds character, strengthens communities, and develops essential life skills!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Service = Waste?"
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

export default DebateServiceWaste;
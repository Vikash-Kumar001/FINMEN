import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateRightsVsDuties = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Are rights more important than duties?",
      options: [
        { id: "a", text: "Both must balance" },
        { id: "b", text: "Rights are more important" },
        { id: "c", text: "Duties are more important" }
      ],
      correctAnswer: "a",
      explanation: "Rights and duties must balance each other - we enjoy rights but also have responsibilities to respect others' rights and contribute to society."
    },
    {
      id: 2,
      text: "What happens when citizens focus only on rights without duties?",
      options: [
        { id: "a", text: "Society becomes chaotic and unsustainable" },
        { id: "b", text: "Society becomes more efficient" },
        { id: "c", text: "Nothing changes" }
      ],
      correctAnswer: "a",
      explanation: "When citizens only focus on rights without fulfilling duties, society becomes chaotic as everyone demands benefits without contributing."
    },
    {
      id: 3,
      text: "What happens when citizens focus only on duties without rights?",
      options: [
        { id: "a", text: "People become oppressed and unmotivated" },
        { id: "b", text: "People become more creative" },
        { id: "c", text: "Society becomes stronger" }
      ],
      correctAnswer: "a",
      explanation: "When citizens only focus on duties without rights, they become oppressed and unmotivated, leading to an unhealthy society."
    },
    {
      id: 4,
      text: "How do rights and duties work together in a democracy?",
      options: [
        { id: "a", text: "Rights enable participation, duties maintain order" },
        { id: "b", text: "Only rights matter for democracy" },
        { id: "c", text: "Only duties matter for democracy" }
      ],
      correctAnswer: "a",
      explanation: "In a democracy, rights enable citizens to participate freely while duties help maintain the order necessary for democracy to function."
    },
    {
      id: 5,
      text: "Why is it important to teach both rights and duties?",
      options: [
        { id: "a", text: "To create responsible and empowered citizens" },
        { id: "b", text: "To make people fear the government" },
        { id: "c", text: "To reduce education costs" }
      ],
      correctAnswer: "a",
      explanation: "Teaching both rights and duties creates responsible and empowered citizens who can contribute positively to society while protecting their freedoms."
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
        title="Debate: Rights vs Duties"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-76"
        gameType="civic-responsibility"
        totalLevels={80}
        currentLevel={76}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length * 2} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand the balance between rights and duties!
          </div>
          <p className="text-white/80">
            Remember: Both rights and duties are essential for a healthy democracy and society - they must balance each other!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Rights vs Duties"
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

export default DebateRightsVsDuties;
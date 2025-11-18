import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnService = () => {
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
      text: "What does volunteering mean?",
      options: [
        { id: "a", text: "Getting paid for work" },
        { id: "b", text: "Helping others without expecting payment" },
        { id: "c", text: "Playing video games" }
      ],
      correctAnswer: "b",
      explanation: "Volunteering means giving your time and effort to help others or causes without receiving money in return."
    },
    {
      id: 2,
      text: "Which is a benefit of volunteering?",
      options: [
        { id: "a", text: "Losing friends" },
        { id: "b", text: "Learning new skills" },
        { id: "c", text: "Getting bored" }
      ],
      correctAnswer: "b",
      explanation: "Volunteering helps you develop new skills, gain experience, and meet new people while making a positive impact."
    },
    {
      id: 3,
      text: "Where can you volunteer?",
      options: [
        { id: "a", text: "Only at school" },
        { id: "b", text: "Only at home" },
        { id: "c", text: "At various places like hospitals, parks, and community centers" }
      ],
      correctAnswer: "c",
      explanation: "There are many places where you can volunteer, including hospitals, parks, community centers, animal shelters, and more."
    },
    {
      id: 4,
      text: "Why is volunteering important?",
      options: [
        { id: "a", text: "It helps only you" },
        { id: "b", text: "It strengthens communities and helps those in need" },
        { id: "c", text: "It's required by law" }
      ],
      correctAnswer: "b",
      explanation: "Volunteering is important because it helps those in need, strengthens communities, and creates positive change in society."
    },
    {
      id: 5,
      text: "What should you do before volunteering?",
      options: [
        { id: "a", text: "Expect payment" },
        { id: "b", text: "Research the organization and understand your role" },
        { id: "c", text: "Show up without telling anyone" }
      ],
      correctAnswer: "b",
      explanation: "Before volunteering, it's important to research the organization and understand your role to ensure a positive experience for everyone involved."
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
      title="Quiz on Service"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-52"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={52}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/kids"
    >
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

export default QuizOnService;
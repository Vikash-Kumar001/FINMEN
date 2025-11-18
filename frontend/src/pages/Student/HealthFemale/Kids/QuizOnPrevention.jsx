import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnPrevention = () => {
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
      text: "Why wash hands before meals?",
      options: [
        { id: "a", text: "To remove germs" },
        { id: "b", text: "Just tradition" }
      ],
      correctAnswer: "a",
      explanation: "Washing hands before meals removes germs that could make you sick. It's an important hygiene practice, not just tradition."
    },
    {
      id: 2,
      text: "How often should you brush your teeth?",
      options: [
        { id: "a", text: "Once a day" },
        { id: "b", text: "Twice a day" },
        { id: "c", text: "Only when they hurt" }
      ],
      correctAnswer: "b",
      explanation: "Dentists recommend brushing your teeth twice a day to prevent cavities and keep your mouth healthy."
    },
    {
      id: 3,
      text: "What's the best way to prevent the flu?",
      options: [
        { id: "a", text: "Get a flu vaccine" },
        { id: "b", text: "Stay home all winter" },
        { id: "c", text: "Take vitamins only" }
      ],
      correctAnswer: "a",
      explanation: "Getting a flu vaccine is the most effective way to prevent the flu. It helps your body build immunity to the virus."
    },
    {
      id: 4,
      text: "Why wear a helmet when riding a bike?",
      options: [
        { id: "a", text: "To look cool" },
        { id: "b", text: "To protect your head from injury" },
        { id: "c", text: "It's required by law only" }
      ],
      correctAnswer: "b",
      explanation: "Helmets protect your head from serious injury in case of a fall or accident. Safety is more important than looking cool."
    },
    {
      id: 5,
      text: "How often should you visit the dentist?",
      options: [
        { id: "a", text: "Only when you have a toothache" },
        { id: "b", text: "Twice a year for checkups" },
        { id: "c", text: "Once every few years" }
      ],
      correctAnswer: "b",
      explanation: "Dentists recommend visiting twice a year for checkups to catch problems early and keep your teeth healthy."
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
      title="Quiz on Prevention"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-female-kids-72"
      gameType="health-female"
      totalLevels={80}
      currentLevel={72}
      showConfetti={gameFinished}
      backPath="/games/health-female/kids"
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

export default QuizOnPrevention;
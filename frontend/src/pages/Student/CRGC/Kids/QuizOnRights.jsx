import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnRights = () => {
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
      text: "What is a human right?",
      options: [
        { id: "a", text: "A privilege given by the government" },
        { id: "b", text: "Something all people deserve" },
        { id: "c", text: "A reward for good behavior" }
      ],
      correctAnswer: "b",
      explanation: "Human rights are fundamental freedoms and protections that belong to every person, regardless of who they are or where they're from."
    },
    {
      id: 2,
      text: "Which of these is a basic human right?",
      options: [
        { id: "a", text: "Owning a luxury car" },
        { id: "b", text: "Access to education" },
        { id: "c", text: "Winning a competition" }
      ],
      correctAnswer: "b",
      explanation: "Access to education is a basic human right recognized by the United Nations. Every child has the right to learn and develop their potential."
    },
    {
      id: 3,
      text: "Why are human rights important?",
      options: [
        { id: "a", text: "They help create fair and just societies" },
        { id: "b", text: "They make some people more special than others" },
        { id: "c", text: "They are only for rich people" }
      ],
      correctAnswer: "a",
      explanation: "Human rights are important because they ensure that all people are treated with dignity and have opportunities to thrive."
    },
    {
      id: 4,
      text: "Who is responsible for protecting human rights?",
      options: [
        { id: "a", text: "Only the police" },
        { id: "b", text: "Only the government" },
        { id: "c", text: "Everyone in society" }
      ],
      correctAnswer: "c",
      explanation: "Protecting human rights is the responsibility of everyone - governments, communities, and individuals all play a role."
    },
    {
      id: 5,
      text: "What should you do if you see someone's rights being violated?",
      options: [
        { id: "a", text: "Ignore it to stay safe" },
        { id: "b", text: "Tell a trusted adult or authority" },
        { id: "c", text: "Join in to avoid being targeted" }
      ],
      correctAnswer: "b",
      explanation: "If you see someone's rights being violated, it's important to tell a trusted adult who can help address the situation."
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
      title="Quiz on Rights"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-62"
      gameType="civic-responsibility"
      totalLevels={70}
      currentLevel={62}
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

export default QuizOnRights;
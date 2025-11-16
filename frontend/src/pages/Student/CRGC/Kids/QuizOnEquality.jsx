import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnEquality = () => {
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
      text: "Boys and girls should get?",
      options: [
        { id: "a", text: "Equal chances" },
        { id: "b", text: "Only boys' chances" },
        { id: "c", text: "Only girls' chances" }
      ],
      correctAnswer: "a",
      explanation: "Everyone should have equal opportunities regardless of gender. This is the foundation of gender equality."
    },
    {
      id: 2,
      text: "Which statement shows gender equality?",
      options: [
        { id: "a", text: "Only boys can be leaders" },
        { id: "b", text: "Both boys and girls can pursue any career" },
        { id: "c", text: "Only girls should do household chores" }
      ],
      correctAnswer: "b",
      explanation: "Gender equality means that everyone, regardless of gender, can pursue their interests and careers without limitations."
    },
    {
      id: 3,
      text: "Why is gender equality important?",
      options: [
        { id: "a", text: "It makes one gender feel superior" },
        { id: "b", text: "It ensures everyone has fair opportunities" },
        { id: "c", text: "It helps ignore others' needs" }
      ],
      correctAnswer: "c",
      explanation: "Gender equality ensures that everyone has fair opportunities to develop their talents and contribute to society."
    },
    {
      id: 4,
      text: "Which situation demonstrates gender equality?",
      options: [
        { id: "a", text: "Only boys playing sports" },
        { id: "b", text: "Both boys and girls sharing household responsibilities" },
        { id: "c", text: "Only girls participating in science class" }
      ],
      correctAnswer: "a",
      explanation: "Gender equality involves sharing responsibilities and opportunities fairly, regardless of gender."
    },
    {
      id: 5,
      text: "How can you promote gender equality?",
      options: [
        { id: "a", text: "Treat everyone based on their gender stereotypes" },
        { id: "b", text: "Encourage everyone to participate equally in activities" },
        { id: "c", text: "Exclude people based on their gender" }
      ],
      correctAnswer: "c",
      explanation: "Promoting gender equality involves encouraging everyone to participate equally, regardless of gender."
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
      title="Quiz on Equality"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-22"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={22}
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

export default QuizOnEquality;
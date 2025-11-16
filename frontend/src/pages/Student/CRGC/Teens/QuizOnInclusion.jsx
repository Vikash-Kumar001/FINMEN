import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnInclusion = () => {
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
      text: "What does inclusion mean?",
      options: [
        { id: "a", text: "Leaving out people who are different" },
        { id: "b", text: "Including all people fairly and respectfully" },
        { id: "c", text: "Only including people who are similar to you" }
      ],
      correctAnswer: "b",
      explanation: "Inclusion means ensuring that all people, regardless of their differences, feel welcomed, valued, and respected in a group or community."
    },
    {
      id: 2,
      text: "Which action demonstrates inclusion?",
      options: [
        { id: "a", text: "Making fun of someone's accent" },
        { id: "b", text: "Inviting a new student to join your group project" },
        { id: "c", text: "Talking about others behind their backs" }
      ],
      correctAnswer: "b",
      explanation: "Inviting a new student to join your group shows inclusion by making them feel welcomed and valued as part of the team."
    },
    {
      id: 3,
      text: "Why is inclusion important in schools?",
      options: [
        { id: "a", text: "It creates a hostile environment for everyone" },
        { id: "b", text: "It helps all students feel valued and able to learn" },
        { id: "c", text: "It only benefits popular students" }
      ],
      correctAnswer: "b",
      explanation: "Inclusion in schools helps create a positive learning environment where all students feel safe, valued, and able to focus on their education."
    },
    {
      id: 4,
      text: "What should you do if you notice someone being excluded?",
      options: [
        { id: "a", text: "Join in the exclusion to fit in" },
        { id: "b", text: "Ignore it completely" },
        { id: "c", text: "Invite the person to join your group" }
      ],
      correctAnswer: "c",
      explanation: "When you see someone being excluded, taking action to include them helps create a more welcoming and inclusive environment for everyone."
    },
    {
      id: 5,
      text: "Which of these situations shows a lack of inclusion?",
      options: [
        { id: "a", text: "A school club that welcomes students from all grades" },
        { id: "b", text: "A group project that assigns roles based on stereotypes" },
        { id: "c", text: "A classroom where everyone's ideas are heard and respected" }
      ],
      correctAnswer: "b",
      explanation: "Assigning roles based on stereotypes rather than individual abilities or interests shows a lack of inclusion and can make some students feel undervalued."
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Inclusion"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-12"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={12}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
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
                  className={`w-full p-4 rounded-xl text-left transition-all text-white ${
                    showCorrect
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : showIncorrect
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-white/10 border border-white/20 hover:bg-white/20'
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

export default QuizOnInclusion;
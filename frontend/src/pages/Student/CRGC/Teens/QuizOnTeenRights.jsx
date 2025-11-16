import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnTeenRights = () => {
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
      text: "Which is a gender right?",
      options: [
        { id: "a", text: "Equal education for all genders" },
        { id: "b", text: "Unequal pay based on gender" },
        { id: "c", text: "Only boys can attend university" }
      ],
      correctAnswer: "a",
      explanation: "Equal education for all genders is a fundamental human right. Everyone should have access to quality education regardless of their gender."
    },
    {
      id: 2,
      text: "What does gender equality in the workplace mean?",
      options: [
        { id: "a", text: "Men should be paid more than women for the same work" },
        { id: "b", text: "Equal pay for equal work regardless of gender" },
        { id: "c", text: "Only men should be allowed in leadership positions" }
      ],
      correctAnswer: "b",
      explanation: "Gender equality in the workplace means that all employees should receive equal pay for equal work, regardless of their gender."
    },
    {
      id: 3,
      text: "Which statement supports gender equality?",
      options: [
        { id: "a", text: "Girls should not participate in sports" },
        { id: "b", text: "Leadership roles should be based on merit, not gender" },
        { id: "c", text: "Women should only work in certain professions" }
      ],
      correctAnswer: "b",
      explanation: "Leadership roles should be based on merit, qualifications, and skills rather than gender. Everyone should have equal opportunities to lead."
    },
    {
      id: 4,
      text: "Why is it important to challenge gender stereotypes?",
      options: [
        { id: "a", text: "To limit people's potential based on their gender" },
        { id: "b", text: "To allow people to pursue their interests and talents freely" },
        { id: "c", text: "To reinforce traditional gender roles" }
      ],
      correctAnswer: "b",
      explanation: "Challenging gender stereotypes allows people to pursue their interests, talents, and career paths without being limited by societal expectations based on gender."
    },
    {
      id: 5,
      text: "What is a key principle of gender equality?",
      options: [
        { id: "a", text: "Certain rights should only apply to specific genders" },
        { id: "b", text: "All people should have the same opportunities regardless of gender" },
        { id: "c", text: "Gender should determine one's role in society" }
      ],
      correctAnswer: "b",
      explanation: "A key principle of gender equality is that all people should have the same opportunities, rights, and freedoms regardless of their gender."
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
      title="Quiz on Teen Rights"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-22"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={22}
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

export default QuizOnTeenRights;
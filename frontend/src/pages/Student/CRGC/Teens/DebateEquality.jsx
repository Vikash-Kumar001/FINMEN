import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateEquality = () => {
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
      text: "Should all students be treated equally regardless of their background?",
      options: [
        { id: "a", text: "Yes, equality is a fundamental right" },
        { id: "b", text: "No, some students deserve more privileges" },
        { id: "c", text: "Only students from certain backgrounds should be treated equally" }
      ],
      correctAnswer: "a",
      explanation: "All students deserve equal treatment regardless of their background, race, religion, or socioeconomic status. Equality is a fundamental human right."
    },
    {
      id: 2,
      text: "Which approach best promotes equality in schools?",
      options: [
        { id: "a", text: "Providing the same resources to all students" },
        { id: "b", text: "Ignoring students' different needs" },
        { id: "c", text: "Treating all students exactly the same without considering individual circumstances" }
      ],
      correctAnswer: "a",
      explanation: "True equality in education means providing all students with the resources they need to succeed, which may sometimes require different approaches for different students."
    },
    {
      id: 3,
      text: "Why is equality important in society?",
      options: [
        { id: "a", text: "It creates division and conflict" },
        { id: "b", text: "It ensures fairness and justice for all" },
        { id: "c", text: "It only benefits certain groups" }
      ],
      correctAnswer: "b",
      explanation: "Equality ensures that everyone has the same opportunities and rights, which creates a fair and just society where all people can thrive."
    },
    {
      id: 4,
      text: "What is the difference between equality and equity?",
      options: [
        { id: "a", text: "Equality means giving everyone the same resources, while equity means giving everyone what they need to succeed" },
        { id: "b", text: "Equality and equity mean the same thing" },
        { id: "c", text: "Equality means giving more to some people, while equity means treating everyone the same" }
      ],
      correctAnswer: "a",
      explanation: "Equality means providing the same resources to everyone, while equity means providing each person with what they need to succeed, which may differ based on individual circumstances."
    },
    {
      id: 5,
      text: "How can we promote equality in our daily lives?",
      options: [
        { id: "a", text: "By standing up against discrimination and treating everyone with respect" },
        { id: "b", text: "By ignoring inequality when we see it" },
        { id: "c", text: "By only helping people who are similar to us" }
      ],
      correctAnswer: "a",
      explanation: "We can promote equality by treating everyone with respect, standing up against discrimination, and advocating for fair treatment for all people regardless of their differences."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 2); // 2 coins for debate questions
      showCorrectAnswerFeedback(2, true);
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
      title="Debate: Equality for All?"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-16"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={16}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate Question {currentQuestion + 1}/{questions.length}</span>
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

export default DebateEquality;
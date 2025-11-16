import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnRules = () => {
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
      text: "Why do we follow rules?",
      options: [
        { id: "a", text: "Only to avoid punishment" },
        { id: "b", text: "To ensure safety and order" },
        { id: "c", text: "Because rules are boring" }
      ],
      correctAnswer: "b",
      explanation: "Rules exist to keep everyone safe and maintain order in our communities. When we follow rules, we help create a predictable and secure environment for everyone."
    },
    {
      id: 2,
      text: "What should you do if you see someone breaking an important safety rule?",
      options: [
        { id: "a", text: "Ignore it to avoid conflict" },
        { id: "b", text: "Join them to fit in" },
        { id: "c", text: "Politely remind them or tell an adult" }
      ],
      correctAnswer: "c",
      explanation: "If someone is breaking an important safety rule, it's our civic duty to help prevent potential harm by politely reminding them or informing an adult who can help."
    },
    {
      id: 3,
      text: "Which of these is an example of following civic responsibility?",
      options: [
        { id: "a", text: "Littering in public spaces" },
        { id: "b", text: "Voting in elections when old enough" },
        { id: "c", text: "Ignoring traffic signals" }
      ],
      correctAnswer: "b",
      explanation: "Voting is a key civic responsibility that allows citizens to participate in democracy and have a say in how their community is governed."
    },
    {
      id: 4,
      text: "Why is it important to follow school rules?",
      options: [
        { id: "a", text: "Only to get good grades" },
        { id: "b", text: "To create a safe learning environment for everyone" },
        { id: "c", text: "Because teachers enjoy making rules" }
      ],
      correctAnswer: "b",
      explanation: "School rules help create a safe and conducive learning environment where all students can focus on their education without disruptions or safety concerns."
    },
    {
      id: 5,
      text: "What is a civic duty?",
      options: [
        { id: "a", text: "A responsibility we have as members of a community" },
        { id: "b", text: "A rule that only applies to adults" },
        { id: "c", text: "Something we do only when we feel like it" }
      ],
      correctAnswer: "a",
      explanation: "Civic duties are responsibilities that we have as members of a community. These include things like following laws, paying taxes, serving on juries, and participating in the democratic process."
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
      title="Quiz on Rules"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-72"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={72}
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

export default QuizOnRules;
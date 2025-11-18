import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnCivicAction = () => {
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
      text: "What does civic action mean?",
      options: [
        { id: "a", text: "Playing video games only" },
        { id: "b", text: "Helping improve your community" },
        { id: "c", text: "Watching TV all day" }
      ],
      correctAnswer: "b",
      explanation: "Civic action means taking part in activities that help improve your community and society."
    },
    {
      id: 2,
      text: "Which of these is an example of civic action?",
      options: [
        { id: "a", text: "Voting in elections when old enough" },
        { id: "b", text: "Ignoring problems in your neighborhood" },
        { id: "c", text: "Only focusing on personal entertainment" }
      ],
      correctAnswer: "a",
      explanation: "Voting is a key civic action that allows citizens to participate in democracy and have a say in how their community is governed."
    },
    {
      id: 3,
      text: "Why is it important to participate in civic actions?",
      options: [
        { id: "a", text: "To avoid responsibilities" },
        { id: "b", text: "To help create positive changes in society" },
        { id: "c", text: "To stay away from community activities" }
      ],
      correctAnswer: "b",
      explanation: "Participating in civic actions helps create positive changes in society by addressing community needs and improving the quality of life for everyone."
    },
    {
      id: 4,
      text: "What is one way kids can engage in civic action?",
      options: [
        { id: "a", text: "Organizing a neighborhood clean-up" },
        { id: "b", text: "Ignoring community problems" },
        { id: "c", text: "Complaining without taking action" }
      ],
      correctAnswer: "a",
      explanation: "Organizing a neighborhood clean-up is a great way for kids to engage in civic action by improving their community environment."
    },
    {
      id: 5,
      text: "Which civic action helps protect the environment?",
      options: [
        { id: "a", text: "Littering in public spaces" },
        { id: "b", text: "Planting trees in your community" },
        { id: "c", text: "Using more plastic bags" }
      ],
      correctAnswer: "b",
      explanation: "Planting trees helps protect the environment by providing oxygen, reducing pollution, and creating habitats for wildlife."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
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

  if (gameFinished) {
    return (
      <GameShell
        title="Quiz on Civic Action"
        subtitle="Game Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-kids-92"
        gameType="civic-responsibility"
        totalLevels={100}
        currentLevel={92}
        showConfetti={true}
        backPath="/games/civic-responsibility/kids"
      >
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold mb-4">Great Job!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You're becoming a civic action expert!
          </div>
          <p className="text-white/80">
            Remember: Civic action helps create positive changes in our communities!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Quiz on Civic Action"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      backPath="/games/civic-responsibility/kids"
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
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left transition-all text-white ${
                  selectedOption === option.id
                    ? showFeedback
                      ? option.id === getCurrentQuestion().correctAnswer
                        ? "bg-green-500/30 border-2 border-green-500"
                        : "bg-red-500/30 border-2 border-red-500"
                      : "bg-blue-500/30 border-2 border-blue-500"
                    : "bg-white/10 hover:bg-white/20 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="font-bold">{option.id.toUpperCase()}</span>
                  </div>
                  <span className="text-lg">{option.text}</span>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-xl mt-6 ${
              selectedOption === getCurrentQuestion().correctAnswer 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`text-lg font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer 
                  ? 'text-green-300' 
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer 
                  ? 'Correct! 🎉' 
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">{getCurrentQuestion().explanation}</p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizOnCivicAction;
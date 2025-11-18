import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnEmpathy = () => {
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
      text: "Empathy means?",
      options: [
        { id: "a", text: "Feeling with others" },
        { id: "b", text: "Ignoring others" },
        { id: "c", text: "Thinking only about yourself" }
      ],
      correctAnswer: "a",
      explanation: "Empathy is the ability to understand and share the feelings of others. It helps us connect with people and show compassion."
    },
    {
      id: 2,
      text: "Which action shows empathy?",
      options: [
        { id: "a", text: "Laughing at someone's mistake" },
        { id: "b", text: "Helping a friend who is sad" },
        { id: "c", text: "Ignoring someone who needs help" }
      ],
      correctAnswer: "b",
      explanation: "Helping a friend who is sad shows empathy because you recognize their feelings and want to support them."
    },
    {
      id: 3,
      text: "Why is empathy important?",
      options: [
        { id: "a", text: "It makes you feel superior" },
        { id: "b", text: "It helps you ignore others" },
        { id: "c", text: "It helps build better relationships" }
      ],
      correctAnswer: "c",
      explanation: "Empathy helps us understand others, which leads to stronger, more meaningful relationships and a more compassionate community."
    },
    {
      id: 4,
      text: "Which situation requires empathy?",
      options: [
        { id: "a", text: "Getting a new toy" },
        { id: "b", text: "A classmate fails a test" },
        { id: "c", text: "Winning a game" }
      ],
      correctAnswer: "b",
      explanation: "When a classmate fails a test, they might feel disappointed or upset. Showing empathy helps them feel supported during difficult times."
    },
    {
      id: 5,
      text: "How can you show empathy?",
      options: [
        { id: "a", text: "Interrupt others when speaking" },
        { id: "b", text: "Make fun of others' feelings" },
        { id: "c", text: "Listen actively to others" }
      ],
      correctAnswer: "c",
      explanation: "Listening actively shows that you care about what others are saying and helps you understand their perspective and feelings."
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
      title="Quiz on Empathy"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-2"
      gameType="civic-responsibility"
      totalLevels={10}
      currentLevel={2}
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

export default QuizOnEmpathy;
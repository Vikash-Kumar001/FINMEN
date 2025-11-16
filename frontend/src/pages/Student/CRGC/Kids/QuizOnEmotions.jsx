import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizOnEmotions = () => {
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
      text: "What emotion might someone feel when they lose their favorite toy?",
      options: [
        { id: "a", text: "Joy" },
        { id: "b", text: "Sadness" },
        { id: "c", text: "Excitement" }
      ],
      correctAnswer: "b",
      explanation: "Losing something important typically makes people feel sad because they miss what they've lost."
    },
    {
      id: 2,
      text: "Which emotion is shown when someone's eyes are wide and mouth is open?",
      options: [
        { id: "a", text: "Anger" },
        { id: "b", text: "Surprise" },
        { id: "c", text: "Boredom" }
      ],
      correctAnswer: "b",
      explanation: "Wide eyes and an open mouth are common expressions of surprise when someone sees something unexpected."
    },
    {
      id: 3,
      text: "What is a healthy way to manage anger?",
      options: [
        { id: "a", text: "Yelling at others" },
        { id: "b", text: "Taking deep breaths" },
        { id: "c", text: "Breaking things" }
      ],
      correctAnswer: "b",
      explanation: "Taking deep breaths activates the body's relaxation response and helps calm intense emotions like anger."
    },
    {
      id: 4,
      text: "Which emotion might someone feel when they achieve a goal?",
      options: [
        { id: "a", text: "Pride" },
        { id: "b", text: "Confusion" },
        { id: "c", text: "Fear" }
      ],
      correctAnswer: "a",
      explanation: "Achieving goals often leads to feelings of pride as people recognize their accomplishments and effort."
    },
    {
      id: 5,
      text: "How can you tell if someone is feeling anxious?",
      options: [
        { id: "a", text: "They are laughing loudly" },
        { id: "b", text: "They are fidgeting or seem restless" },
        { id: "c", text: "They are sleeping peacefully" }
      ],
      correctAnswer: "b",
      explanation: "Fidgeting, restlessness, and nervous movements are common physical signs of anxiety."
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
      title="Quiz on Emotions"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-kids-42"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={42}
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

export default QuizOnEmotions;
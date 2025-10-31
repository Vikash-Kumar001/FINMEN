import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const PuzzleOfBalanceHabits = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Match 'Sleep Early' to?",
      choices: [
        { id: 'a', text: 'Healthy', icon: '🛌😊' },
        { id: 'b', text: 'Tired', icon: '😴😓' }
      ],
      correct: 'a',
      explanation: 'Early sleep promotes health and energy!'
    },
    {
      id: 2,
      text: "Match 'Midnight Phone' to?",
      choices: [
        { id: 'a', text: 'Tired', icon: '📱😴🚫' },
        { id: 'b', text: 'Healthy', icon: '📱😊' }
      ],
      correct: 'a',
      explanation: 'Late phone use leads to fatigue!'
    },
    {
      id: 3,
      text: "Match 'Screen Limits' to?",
      choices: [
        { id: 'a', text: 'Better focus', icon: '⏰🧠' },
        { id: 'b', text: 'Distraction', icon: '📱😓' }
      ],
      correct: 'a',
      explanation: 'Screen limits improve concentration!'
    },
    {
      id: 4,
      text: "Match 'Tech Breaks' to?",
      choices: [
        { id: 'a', text: 'Refreshed', icon: '⏸️😌' },
        { id: 'b', text: 'Stressed', icon: '😓' }
      ],
      correct: 'a',
      explanation: 'Breaks from tech reduce stress!'
    },
    {
      id: 5,
      text: "Match 'Digital Detox' to?",
      choices: [
        { id: 'a', text: 'Balanced life', icon: '📱🚫😊' },
        { id: 'b', text: 'Overuse', icon: '📱🕒' }
      ],
      correct: 'a',
      explanation: 'Detox fosters healthier habits!'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(score + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setFeedbackType(null);
      } else {
        setLevelCompleted(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setFeedbackType(null);
      setShowConfetti(false);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/emotion/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Puzzle of Balance Habits"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-154"
      gameType="emotion"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/emotion/teens"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6">{currentQuestionData.text}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          {currentQuestionData.choices.map((choice) => (
            <OptionButton
              key={choice.id}
              option={`${choice.icon} ${choice.text}`}
              onClick={() => handleOptionSelect(choice.id)}
              selected={selectedOption === choice.id}
              disabled={!!selectedOption}
              feedback={showFeedback ? { type: feedbackType } : null}
            />
          ))}
        </div>
        
        {showFeedback && (
          <FeedbackBubble 
            message={feedbackType === "correct" ? "Correct! 🎉" : "Not quite! 🤔"}
            type={feedbackType}
          />
        )}
        
        {showFeedback && feedbackType === "wrong" && (
          <div className="mt-4 text-white/90 text-center">
            <p>💡 {currentQuestionData.explanation}</p>
          </div>
        )}
      </GameCard>
    </GameShell>
  );
};

export default PuzzleOfBalanceHabits;
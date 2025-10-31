// BadgeOptimistHero.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const BadgeOptimistHero = () => {
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
      text: "Scenario 1: Missed opportunity?",
      choices: [
        { id: 'a', text: 'Find next chance', icon: '🔄🌟' },
        { id: 'b', text: 'Feel defeated', icon: '😞' }
      ],
      correct: 'a',
      explanation: 'Looking forward keeps hope alive!'
    },
    {
      id: 2,
      text: "Scenario: Friend cancels?",
      choices: [
        { id: 'a', text: 'Plan solo fun', icon: '😊🎉' },
        { id: 'b', text: 'Stay upset', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'Positivity turns setbacks into fun!'
    },
    {
      id: 3,
      text: "Tough feedback received?",
      choices: [
        { id: 'a', text: 'Use to improve', icon: '📈' },
        { id: 'b', text: 'Take personally', icon: '😔' }
      ],
      correct: 'a',
      explanation: 'Feedback fuels growth!'
    },
    {
      id: 4,
      text: "Goal feels far away?",
      choices: [
        { id: 'yes', text: 'Break into steps', icon: '📋🔄' },
        { id: 'no', text: 'Give up', icon: '🙅‍♂️' }
      ],
      correct: 'yes',
      explanation: 'Small steps make goals achievable!'
    },
    {
      id: 5,
      text: "Final: Bad day?",
      choices: [
        { id: 'a', text: 'Find one positive', icon: '🌈' },
        { id: 'b', text: 'Dwell on bad', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'One positive shifts your whole day!'
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
      title="Badge: Optimist Hero"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-120"
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

export default BadgeOptimistHero;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const PuzzleOfSleepHealth = () => {
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
      text: "Match 'Screen Off' to?",
      choices: [
        { id: 'a', text: 'Good sleep', icon: '📱🚫😴' },
        { id: 'b', text: 'Bad sleep', icon: '📱😓' }
      ],
      correct: 'a',
      explanation: 'No screens before bed improves sleep quality!'
    },
    {
      id: 2,
      text: "Match 'Noise' to?",
      choices: [
        { id: 'a', text: 'Bad sleep', icon: '🔊😴🚫' },
        { id: 'b', text: 'Good sleep', icon: '🔊😌' }
      ],
      correct: 'a',
      explanation: 'Quiet environments promote restful sleep!'
    },
    {
      id: 3,
      text: "Match 'Consistent Bedtime' to?",
      choices: [
        { id: 'a', text: 'Better rest', icon: '📅🛌' },
        { id: 'b', text: 'Poor rest', icon: '😓' }
      ],
      correct: 'a',
      explanation: 'Regular sleep schedules enhance rest!'
    },
    {
      id: 4,
      text: "Match 'Caffeine' to?",
      choices: [
        { id: 'a', text: 'Disrupts sleep', icon: '☕🚫' },
        { id: 'b', text: 'Improves sleep', icon: '☕😴' }
      ],
      correct: 'a',
      explanation: 'Caffeine keeps you awake, avoid before bed!'
    },
    {
      id: 5,
      text: "Match 'Relaxation Routine' to?",
      choices: [
        { id: 'a', text: 'Good sleep', icon: '😌🛌' },
        { id: 'b', text: 'Bad sleep', icon: '😓' }
      ],
      correct: 'a',
      explanation: 'Calming routines prep body for sleep!'
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
      title="Puzzle of Sleep Health"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-134"
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

export default PuzzleOfSleepHealth;
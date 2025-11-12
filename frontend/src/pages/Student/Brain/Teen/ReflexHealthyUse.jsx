import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const ReflexHealthyUse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
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
      text: "Quick: Tech use choice!",
      choices: [
        { id: 'a', text: 'Digital detox', icon: '📱🚫' },
        { id: 'b', text: 'Screen all day', icon: '📱🕒' }
      ],
      correct: 'a',
      explanation: 'Digital detox restores balance!'
    },
    {
      id: 2,
      text: "Reflex: Free time?",
      choices: [
        { id: 'a', text: 'Limit screens', icon: '⏰📱' },
        { id: 'b', text: 'All screens', icon: '📱🕒' }
      ],
      correct: 'a',
      explanation: 'Screen limits boost productivity!'
    },
    {
      id: 3,
      text: "Fast: Evening tech?",
      choices: [
        { id: 'a', text: 'Switch off early', icon: '📱🚫' },
        { id: 'b', text: 'Use till late', icon: '📱🌙' }
      ],
      correct: 'a',
      explanation: 'Early tech cutoff aids sleep!'
    },
    {
      id: 4,
      text: "Quick: Tech stress?",
      choices: [
        { id: 'a', text: 'Take breaks', icon: '⏸️😌' },
        { id: 'b', text: 'Keep scrolling', icon: '📱🕒' }
      ],
      correct: 'a',
      explanation: 'Breaks reduce digital overload!'
    },
    {
      id: 5,
      text: "Reflex: Daily tech?",
      choices: [
        { id: 'a', text: 'Balanced use', icon: '⚖️📱' },
        { id: 'b', text: 'Unlimited use', icon: '📱🕒' }
      ],
      correct: 'a',
      explanation: 'Balanced tech use enhances well-being!'
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
      title="Reflex Healthy Use"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="emotion-teens-159"
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

export default ReflexHealthyUse;
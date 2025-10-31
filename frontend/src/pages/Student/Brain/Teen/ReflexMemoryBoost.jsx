// ReflexMemoryBoost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const ReflexMemoryBoost = () => {
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
      text: "Quick: Tap for boosting memory with quick reflexes!",
      choices: [
        { id: 'a', text: 'Revision', icon: '🔄' },
        { id: 'b', text: 'Forget', icon: '🗑️' }
      ],
      correct: 'a',
      explanation: 'Regular revision boosts memory through repetition!'
    },
    {
      id: 2,
      text: "Reflex: Choose the memory booster!",
      choices: [
        { id: 'a', text: 'Sleep well', icon: '🛌' },
        { id: 'b', text: 'Skip meals', icon: '🍽️🚫' }
      ],
      correct: 'a',
      explanation: 'Good sleep consolidates memories!'
    },
    {
      id: 3,
      text: "Fast tap: What's a reflex memory aid?",
      choices: [
        { id: 'a', text: 'Games', icon: '🎮' },
        { id: 'b', text: 'Boredom', icon: '😴' }
      ],
      correct: 'a',
      explanation: 'Brain games sharpen reflexes and memory!'
    },
    {
      id: 4,
      text: "Quick choice: Boost with exercise?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '🏃' },
        { id: 'no', text: 'No', icon: '🛋️' }
      ],
      correct: 'yes',
      explanation: 'Exercise increases blood flow to the brain!'
    },
    {
      id: 5,
      text: "Reflex: Tap for healthy habit!",
      choices: [
        { id: 'a', text: 'Hydration', icon: '💧' },
        { id: 'b', text: 'Dehydration', icon: '🏜️' }
      ],
      correct: 'a',
      explanation: 'Staying hydrated supports brain function!'
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
    navigate('/games/memory/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 10;
  };

  return (
    <GameShell
      title="Reflex Memory Boost"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="memory-teens-53"
      gameType="memory"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/memory/teens"
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

export default ReflexMemoryBoost;
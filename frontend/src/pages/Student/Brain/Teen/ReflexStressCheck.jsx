// ReflexStressCheck.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const ReflexStressCheck = () => {
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
      text: "Quick: Tap for stress relief!",
      choices: [
        { id: 'a', text: 'Meditate', icon: '🧘' },
        { id: 'b', text: 'Overthink', icon: '🤯' }
      ],
      correct: 'a',
      explanation: 'Meditation clears the mind and reduces stress hormones!'
    },
    {
      id: 2,
      text: "Reflex: Choose calm option!",
      choices: [
        { id: 'a', text: 'Deep breath', icon: '🌬️' },
        { id: 'b', text: 'Worry more', icon: '😟' }
      ],
      correct: 'a',
      explanation: 'Breathing exercises activate relaxation!'
    },
    {
      id: 3,
      text: "Fast tap: Stress check!",
      choices: [
        { id: 'a', text: 'Stretch', icon: '🤸' },
        { id: 'b', text: 'Clench fists', icon: '✊' }
      ],
      correct: 'a',
      explanation: 'Stretching releases tension in muscles!'
    },
    {
      id: 4,
      text: "Quick choice: For stress?",
      choices: [
        { id: 'a', text: 'Laugh', icon: '😂' },
        { id: 'b', text: 'Frown', icon: '😠' }
      ],
      correct: 'a',
      explanation: 'Laughter boosts mood and lowers stress!'
    },
    {
      id: 5,
      text: "Reflex: Tap for relief!",
      choices: [
        { id: 'a', text: 'Hydrate', icon: '💧' },
        { id: 'b', text: 'Dehydrate', icon: '🏜️' }
      ],
      correct: 'a',
      explanation: 'Water helps maintain bodily functions during stress!'
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
    navigate('/games/stress/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 10;
  };

  return (
    <GameShell
      title="Reflex Stress Check"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="stress-teens-73"
      gameType="stress"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/stress/teens"
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

export default ReflexStressCheck;
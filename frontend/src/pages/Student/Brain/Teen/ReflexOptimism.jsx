import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const ReflexOptimism = () => {
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
      text: "Quick: Positive choice!",
      choices: [
        { id: 'a', text: 'Gratitude', icon: '🙏' },
        { id: 'b', text: 'Jealousy', icon: '😒' }
      ],
      correct: 'a',
      explanation: 'Gratitude shifts focus to the positive!'
    },
    {
      id: 2,
      text: "Reflex: Tough day?",
      choices: [
        { id: 'a', text: 'Find a silver lining', icon: '🌟' },
        { id: 'b', text: 'Complain', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'Silver linings boost resilience!'
    },
    {
      id: 3,
      text: "Fast: Someone succeeds?",
      choices: [
        { id: 'a', text: 'Celebrate them', icon: '🎉' },
        { id: 'b', text: 'Feel envious', icon: '😔' }
      ],
      correct: 'a',
      explanation: 'Celebrating others spreads positivity!'
    },
    {
      id: 4,
      text: "Quick: Missed goal?",
      choices: [
        { id: 'a', text: 'Set new plan', icon: '📈' },
        { id: 'b', text: 'Feel defeated', icon: '😞' }
      ],
      correct: 'a',
      explanation: 'Planning keeps you moving forward!'
    },
    {
      id: 5,
      text: "Reflex: Bad news?",
      choices: [
        { id: 'a', text: 'Focus on solutions', icon: '💡' },
        { id: 'b', text: 'Dwell on negatives', icon: '😓' }
      ],
      correct: 'a',
      explanation: 'Solutions turn challenges into opportunities!'
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
      title="Reflex Optimism"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-113"
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

export default ReflexOptimism;
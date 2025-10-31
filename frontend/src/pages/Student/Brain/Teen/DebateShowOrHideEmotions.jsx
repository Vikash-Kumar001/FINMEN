// DebateShowOrHideEmotions.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const DebateShowOrHideEmotions = () => {
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
      text: "Should we always hide emotions?",
      choices: [
        { id: 'a', text: 'No, express healthy', icon: '😊💬' },
        { id: 'b', text: 'Yes, always hide', icon: '😐🚫' }
      ],
      correct: 'a',
      explanation: 'Healthy expression builds connections and relief!'
    },
    {
      id: 2,
      text: "Hiding emotions long-term?",
      choices: [
        { id: 'a', text: 'Builds up stress', icon: '💥' },
        { id: 'b', text: 'Makes stronger', icon: '💪' }
      ],
      correct: 'a',
      explanation: 'Suppressed emotions can lead to outbursts!'
    },
    {
      id: 3,
      text: "Showing vulnerability?",
      choices: [
        { id: 'a', text: 'Strengthens bonds', icon: '❤️' },
        { id: 'b', text: 'Weakness', icon: '😔' }
      ],
      correct: 'a',
      explanation: 'Authenticity fosters trust!'
    },
    {
      id: 4,
      text: "Cultural norms on emotions?",
      choices: [
        { id: 'a', text: 'Vary, but balance key', icon: '🌍⚖️' },
        { id: 'b', text: 'Always suppress', icon: '🚫' }
      ],
      correct: 'a',
      explanation: 'Adapt but prioritize mental health!'
    },
    {
      id: 5,
      text: "When to control expression?",
      choices: [
        { id: 'a', text: 'Inappropriate times', icon: '⏰' },
        { id: 'b', text: 'All times', icon: '🔒' }
      ],
      correct: 'a',
      explanation: 'Timing matters for effective communication!'
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
      title="Debate: Show or Hide Emotions?"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-96"
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

export default DebateShowOrHideEmotions;
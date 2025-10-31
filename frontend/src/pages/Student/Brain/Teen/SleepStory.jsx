import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const SleepStory = () => {
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
      text: "Slept 5 hrs before exam, feels tired. Is this good?",
      choices: [
        { id: 'a', text: 'No', icon: '😴🚫' },
        { id: 'b', text: 'Yes', icon: '✅' }
      ],
      correct: 'a',
      explanation: 'Lack of sleep harms focus and performance!'
    },
    {
      id: 2,
      text: "Woke up groggy after late night?",
      choices: [
        { id: 'a', text: 'Set earlier bedtime', icon: '🛌⏰' },
        { id: 'b', text: 'Push through tired', icon: '😓' }
      ],
      correct: 'a',
      explanation: 'Consistent sleep improves energy!'
    },
    {
      id: 3,
      text: "Skipped sleep for game?",
      choices: [
        { id: 'a', text: 'Prioritize rest', icon: '😴' },
        { id: 'b', text: 'Keep playing', icon: '🎮' }
      ],
      correct: 'a',
      explanation: 'Rest boosts health and focus!'
    },
    {
      id: 4,
      text: "Tired in class?",
      choices: [
        { id: 'a', text: 'Fix sleep schedule', icon: '📅🛌' },
        { id: 'b', text: 'Drink energy drinks', icon: '⚡' }
      ],
      correct: 'a',
      explanation: 'Healthy sleep beats quick fixes!'
    },
    {
      id: 5,
      text: "Poor sleep affecting mood?",
      choices: [
        { id: 'yes', text: 'Yes, improve routine', icon: '😊🛌' },
        { id: 'no', text: 'No, ignore it', icon: '🙈' }
      ],
      correct: 'yes',
      explanation: 'Good sleep lifts mood and focus!'
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
      title="Sleep Story"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-131"
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

export default SleepStory;
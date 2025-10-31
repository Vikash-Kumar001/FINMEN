// SimulationNegativeDay.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const SimulationNegativeDay = () => {
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
      text: "Bad day at school. Best choice?",
      choices: [
        { id: 'a', text: 'Stay upset', icon: '😔' },
        { id: 'b', text: 'Think of positives', icon: '🌟' },
        { id: 'c', text: 'Quit tasks', icon: '🚫' }
      ],
      correct: 'b',
      explanation: 'Focusing on positives shifts your mindset!'
    },
    {
      id: 2,
      text: "Sim: Fight with friend?",
      choices: [
        { id: 'a', text: 'Talk it out', icon: '💬😌' },
        { id: 'b', text: 'Stay angry', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'Talking resolves conflicts healthily!'
    },
    {
      id: 3,
      text: "Bad grade received?",
      choices: [
        { id: 'a', text: 'Study smarter', icon: '📚💡' },
        { id: 'b', text: 'Feel hopeless', icon: '😞' }
      ],
      correct: 'a',
      explanation: 'Effort improves future outcomes!'
    },
    {
      id: 4,
      text: "Feeling overwhelmed?",
      choices: [
        { id: 'a', text: 'Take small steps', icon: '📈' },
        { id: 'b', text: 'Give up', icon: '🙅‍♂️' }
      ],
      correct: 'a',
      explanation: 'Breaking tasks down makes them manageable!'
    },
    {
      id: 5,
      text: "End of day: Reflect?",
      choices: [
        { id: 'yes', text: 'Yes, find good', icon: '🌈' },
        { id: 'no', text: 'No, focus bad', icon: '😔' }
      ],
      correct: 'yes',
      explanation: 'Reflection finds hope in tough days!'
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
      title="Simulation: Negative Day"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-118"
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

export default SimulationNegativeDay;
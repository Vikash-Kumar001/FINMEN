import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const JournalOfSleepHealth = () => {
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
      text: "One bedtime rule I follow is ___?",
      choices: [
        { id: 'a', text: 'No screens before bed', icon: '📱🚫' },
        { id: 'b', text: 'Late-night scrolling', icon: '📱🌙' }
      ],
      correct: 'a',
      explanation: 'Avoiding screens promotes better sleep!'
    },
    {
      id: 2,
      text: "Journal: Sleep habit I value?",
      choices: [
        { id: 'a', text: 'Consistent bedtime', icon: '📅🛌' },
        { id: 'b', text: 'Irregular sleep', icon: '😴🔄' }
      ],
      correct: 'a',
      explanation: 'Regular sleep improves health!'
    },
    {
      id: 3,
      text: "Sleep environment choice?",
      choices: [
        { id: 'a', text: 'Quiet and dark', icon: '🌙🔇' },
        { id: 'b', text: 'Noisy and bright', icon: '🔊💡' }
      ],
      correct: 'a',
      explanation: 'Calm settings enhance rest!'
    },
    {
      id: 4,
      text: "Evening routine for sleep?",
      choices: [
        { id: 'a', text: 'Relaxing activity', icon: '😌🛁' },
        { id: 'b', text: 'High-energy task', icon: '⚡' }
      ],
      correct: 'a',
      explanation: 'Relaxation preps body for sleep!'
    },
    {
      id: 5,
      text: "Journal: Sleep goal?",
      choices: [
        { id: 'a', text: '7–8 hours nightly', icon: '🛌7️⃣8️⃣' },
        { id: 'b', text: 'Minimal sleep', icon: '😴🚫' }
      ],
      correct: 'a',
      explanation: 'Adequate sleep boosts performance!'
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
      title="Journal of Sleep Health"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="emotion-teens-137"
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

export default JournalOfSleepHealth;
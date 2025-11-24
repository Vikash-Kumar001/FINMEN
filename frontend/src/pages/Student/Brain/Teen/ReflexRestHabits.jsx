import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const ReflexRestHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-63";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
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
      text: "Quick: Sleep habit choice!",
      choices: [
        { id: 'a', text: 'Consistent sleep', icon: '🛌📅' },
        { id: 'b', text: 'All-nighter', icon: '🌙📚' }
      ],
      correct: 'a',
      explanation: 'Regular sleep boosts health and focus!'
    },
    {
      id: 2,
      text: "Reflex: Before bed?",
      choices: [
        { id: 'a', text: 'Relax routine', icon: '😌🛁' },
        { id: 'b', text: 'Watch screens', icon: '📱' }
      ],
      correct: 'a',
      explanation: 'Relaxing prepares body for rest!'
    },
    {
      id: 3,
      text: "Fast: Tired afternoon?",
      choices: [
        { id: 'a', text: 'Short nap', icon: '😴⏰' },
        { id: 'b', text: 'Push through', icon: '😓' }
      ],
      correct: 'a',
      explanation: 'Short naps recharge without disrupting night!'
    },
    {
      id: 4,
      text: "Quick: Sleepy in class?",
      choices: [
        { id: 'a', text: 'Fix bedtime', icon: '🛌⏰' },
        { id: 'b', text: 'More coffee', icon: '☕' }
      ],
      correct: 'a',
      explanation: 'Consistent sleep is better than caffeine!'
    },
    {
      id: 5,
      text: "Reflex: Weekend sleep?",
      choices: [
        { id: 'a', text: 'Keep schedule', icon: '📅' },
        { id: 'b', text: 'Sleep in late', icon: '😴🕒' }
      ],
      correct: 'a',
      explanation: 'Stable sleep patterns optimize rest!'
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
      setScore(score + 1); // 1 coin for correct answer
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
    navigate('/games/brain-health/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Reflex Rest Habits"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/teens"
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

export default ReflexRestHabits;
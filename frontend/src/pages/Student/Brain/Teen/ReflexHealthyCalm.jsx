// ReflexHealthyCalm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const ReflexHealthyCalm = () => {
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
      text: "Tap for healthy calm!",
      choices: [
        { id: 'a', text: 'Exercise', icon: '🏃' },
        { id: 'b', text: 'Avoid work', icon: '🛋️' }
      ],
      correct: 'a',
      explanation: 'Exercise promotes endorphins for natural calm!'
    },
    {
      id: 2,
      text: "Quick: Calm reflex!",
      choices: [
        { id: 'a', text: 'Tea time', icon: '🍵' },
        { id: 'b', text: 'Energy drinks', icon: '⚡🥤' }
      ],
      correct: 'a',
      explanation: 'Herbal tea soothes nerves!'
    },
    {
      id: 3,
      text: "Fast: Choose calm!",
      choices: [
        { id: 'a', text: 'Mindful walk', icon: '🚶🧠' },
        { id: 'b', text: 'Rush around', icon: '🏃‍♂️💨' }
      ],
      correct: 'a',
      explanation: 'Mindful activities ground you!'
    },
    {
      id: 4,
      text: "Reflex: Healthy choice?",
      choices: [
        { id: 'a', text: 'Balanced diet', icon: '🥗' },
        { id: 'b', text: 'Skip meals', icon: '🚫🍽️' }
      ],
      correct: 'a',
      explanation: 'Nutrition supports stable mood!'
    },
    {
      id: 5,
      text: "Tap for calm habit!",
      choices: [
        { id: 'a', text: 'Routine sleep', icon: '🛌' },
        { id: 'b', text: 'Late nights', icon: '🌙' }
      ],
      correct: 'a',
      explanation: 'Consistent sleep regulates stress!'
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
      title="Reflex Healthy Calm"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="stress-teens-79"
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

export default ReflexHealthyCalm;
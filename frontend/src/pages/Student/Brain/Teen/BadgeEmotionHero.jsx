// BadgeEmotionHero.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const BadgeEmotionHero = () => {
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
      text: "Scenario 1: Bullied? Handle positively?",
      choices: [
        { id: 'a', text: 'Report & stay strong', icon: '🚨💪' },
        { id: 'b', text: 'Retaliate', icon: '⚔️' }
      ],
      correct: 'a',
      explanation: 'Seeking help empowers without harm!'
    },
    {
      id: 2,
      text: "Scenario: Lost game?",
      choices: [
        { id: 'a', text: 'Congratulate opponent', icon: '🏆👍' },
        { id: 'b', text: 'Complain', icon: '😠' }
      ],
      correct: 'a',
      explanation: 'Sportsmanship shows true character!'
    },
    {
      id: 3,
      text: "Sad day: Positive action?",
      choices: [
        { id: 'a', text: 'Talk to loved one', icon: '💬❤️' },
        { id: 'b', text: 'Isolate', icon: '🚶‍♂️' }
      ],
      correct: 'a',
      explanation: 'Support turns sadness to strength!'
    },
    {
      id: 4,
      text: "Excited news: Share?",
      choices: [
        { id: 'yes', text: 'Yes, include others', icon: '🎉👥' },
        { id: 'no', text: 'No, hoard joy', icon: '🔒😊' }
      ],
      correct: 'yes',
      explanation: 'Sharing multiplies happiness!'
    },
    {
      id: 5,
      text: "Final: Conflict resolution?",
      choices: [
        { id: 'a', text: 'Listen & compromise', icon: '👂🤝' },
        { id: 'b', text: 'Win at all costs', icon: '🏆⚔️' }
      ],
      correct: 'a',
      explanation: 'Compromise creates win-win solutions!'
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
      title="Badge: Emotion Hero"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-100"
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

export default BadgeEmotionHero;
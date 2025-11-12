// JournalOfGratitude.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const JournallOfGratitude = () => {
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
      text: "Today I am thankful for ___?",
      choices: [
        { id: 'a', text: 'Supportive friends', icon: '👥❤️' },
        { id: 'b', text: 'Holding grudges', icon: '😣🔒' }
      ],
      correct: 'a',
      explanation: 'Gratitude for friends boosts positivity!'
    },
    {
      id: 2,
      text: "Journal: Grateful moment?",
      choices: [
        { id: 'a', text: 'Helping someone', icon: '🤝' },
        { id: 'b', text: 'Feeling jealous', icon: '😒' }
      ],
      correct: 'a',
      explanation: 'Helping others creates joy!'
    },
    {
      id: 3,
      text: "Thankful for challenge?",
      choices: [
        { id: 'a', text: 'Growth it brought', icon: '🌱' },
        { id: 'b', text: 'Frustration', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'Challenges teach valuable lessons!'
    },
    {
      id: 4,
      text: "Gratitude for today?",
      choices: [
        { id: 'yes', text: 'Small wins', icon: '🏆' },
        { id: 'no', text: 'Only negatives', icon: '😔' }
      ],
      correct: 'yes',
      explanation: 'Small wins fuel positivity!'
    },
    {
      id: 5,
      text: "Journal: Thankful for self?",
      choices: [
        { id: 'a', text: 'Own effort', icon: '💪' },
        { id: 'b', text: 'Self-doubt', icon: '🤔' }
      ],
      correct: 'a',
      explanation: 'Appreciating effort builds confidence!'
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
      title="Journal of Gratitude"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="emotion-teens-117"
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

export default JournallOfGratitude;
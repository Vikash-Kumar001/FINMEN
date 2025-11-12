// PuzzleOfRelief.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const PuzzleOfRelief = () => {
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
      text: "Match 'Talk to Friend' to?",
      choices: [
        { id: 'a', text: 'Emotional support', icon: '👫❤️' },
        { id: 'b', text: 'More stress', icon: '😟' },
        { id: 'c', text: 'Isolation', icon: '🚶' }
      ],
      correct: 'a',
      explanation: 'Friends provide perspective and comfort!'
    },
    {
      id: 2,
      text: "Match 'Sleep' to?",
      choices: [
        { id: 'a', text: 'Brain refresh', icon: '🛌💡' },
        { id: 'b', text: 'Insomnia', icon: '🌙🚫' },
        { id: 'c', text: 'Tiredness', icon: '😴' }
      ],
      correct: 'a',
      explanation: 'Good sleep restores energy and reduces stress!'
    },
    {
      id: 3,
      text: "Match 'Hobby' to relief?",
      choices: [
        { id: 'yes', text: 'Yes, distraction', icon: '🎨' },
        { id: 'no', text: 'No, boredom', icon: '😴' }
      ],
      correct: 'yes',
      explanation: 'Hobbies bring joy and break stress cycles!'
    },
    {
      id: 4,
      text: "Match 'Yoga' to?",
      choices: [
        { id: 'a', text: 'Flexibility & calm', icon: '🧘‍♀️' },
        { id: 'b', text: 'Strain', icon: '🤕' }
      ],
      correct: 'a',
      explanation: 'Yoga combines movement and mindfulness!'
    },
    {
      id: 5,
      text: "Match 'Nature walk' to?",
      choices: [
        { id: 'a', text: 'Fresh air relief', icon: '🌳🚶' },
        { id: 'b', text: 'Pollution', icon: '🏭' }
      ],
      correct: 'a',
      explanation: 'Nature reduces cortisol levels!'
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
      title="Puzzle of Relief"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="stress-teens-74"
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

export default PuzzleOfRelief;
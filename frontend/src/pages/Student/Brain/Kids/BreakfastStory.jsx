import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const BreakfastStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 10; // Default 10 for this game
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({}); // Track answers for each question

  const questions = [
    {
      id: 1,
      text: "Kid skips breakfast. Is this good for brain?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ],
      correct: 'no',
      explanation: 'Breakfast fuels your brain for the day ahead!'
    },
    {
      id: 2,
      text: "Which breakfast is best for your brain?",
      choices: [
        { id: 'cereal', text: 'Whole grain cereal with milk' },
        { id: 'candy', text: 'Candy bar' }
      ],
      correct: 'cereal',
      explanation: 'Whole grains and protein help your brain work well!'
    },
    {
      id: 3,
      text: "Why is breakfast called the most important meal?",
      choices: [
        { id: 'first', text: 'It\'s the first meal after sleeping' },
        { id: 'expensive', text: 'It\'s the most expensive meal' }
      ],
      correct: 'first',
      explanation: 'After fasting overnight, your brain needs fuel to wake up!'
    },
    {
      id: 4,
      text: "How does breakfast help your school performance?",
      choices: [
        { id: 'focus', text: 'Helps you focus and learn better' },
        { id: 'sleepy', text: 'Makes you sleepy in class' }
      ],
      correct: 'focus',
      explanation: 'A good breakfast improves concentration and memory!'
    },
    {
      id: 5,
      text: "What should you do if you\'re running late for school?",
      choices: [
        { id: 'skip', text: 'Skip breakfast completely' },
        { id: 'quick', text: 'Grab a quick healthy snack' }
      ],
      correct: 'quick',
      explanation: 'A piece of fruit or yogurt is better than skipping breakfast.'
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(score + 10); // 10 coins for correct answer (max 50 coins for 5 questions)
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    // Auto-advance to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setFeedbackType(null);
        setShowConfetti(false);
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
    navigate('/games/brain-health/kids');
  };

  const currentQuestionData = questions[currentQuestion];

  // Calculate coins based on correct answers (max 50 coins for 5 questions)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 10;
  };

  return (
    <GameShell
      title="Breakfast for Brain Power"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-5"
      gameType="brain"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6">{currentQuestionData.text}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestionData.choices.map((choice) => (
            <OptionButton
              key={choice.id}
              option={choice.text}
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

export default BreakfastStory;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const QuizOnBrainFood = () => {
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
  const [answers, setAnswers] = useState({}); // Track answers for each question

  const questions = [
    {
      id: 1,
      text: "Which food is healthy for brain?",
      choices: [
        { id: 'a', text: 'Fruits' },
        { id: 'b', text: 'Chips' },
        { id: 'c', text: 'Cola' }
      ],
      correct: 'a',
      explanation: 'Fruits contain vitamins and antioxidants that support brain health!'
    },
    {
      id: 2,
      text: "Which nutrient helps your brain grow?",
      choices: [
        { id: 'a', text: 'Protein' },
        { id: 'b', text: 'Sugar' },
        { id: 'c', text: 'Salt' }
      ],
      correct: 'a',
      explanation: 'Protein helps build and repair brain cells!'
    },
    {
      id: 3,
      text: "What drink is best for your brain?",
      choices: [
        { id: 'a', text: 'Water' },
        { id: 'b', text: 'Soda' },
        { id: 'c', text: 'Energy drinks' }
      ],
      correct: 'a',
      explanation: 'Water keeps your brain hydrated and functioning well!'
    },
    {
      id: 4,
      text: "Which food helps you concentrate better?",
      choices: [
        { id: 'a', text: 'Fish with omega-3' },
        { id: 'b', text: 'Candy' },
        { id: 'c', text: 'Chips' }
      ],
      correct: 'a',
      explanation: 'Omega-3 fatty acids support brain function!'
    },
    {
      id: 5,
      text: "Why are vegetables good for your brain?",
      choices: [
        { id: 'a', text: 'They have vitamins and minerals' },
        { id: 'b', text: 'They taste bad' },
        { id: 'c', text: 'They are expensive' }
      ],
      correct: 'a',
      explanation: 'Vitamins and minerals help your brain work properly!'
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
      title="Brain Food Quiz"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-2"
      gameType="brain"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/kids"
    >
      {/* Removed LevelCompleteHandler */}
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6">{currentQuestionData.text}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

export default QuizOnBrainFood;
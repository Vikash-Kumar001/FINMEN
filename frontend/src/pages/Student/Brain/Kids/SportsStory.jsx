import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const SportsStory = () => {
  const navigate = useNavigate();
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
      text: "Playing football helps brain?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ],
      correct: 'yes',
      explanation: 'Physical activity increases blood flow to the brain!'
    },
    {
      id: 2,
      text: "How does playing sports help your school work?",
      choices: [
        { id: 'focus', text: 'Helps you focus better' },
        { id: 'tired', text: 'Makes you too tired to study' }
      ],
      correct: 'focus',
      explanation: 'Exercise improves concentration and memory!'
    },
    {
      id: 3,
      text: "Which sport is best for brain health?",
      choices: [
        { id: 'any', text: 'Any sport you enjoy' },
        { id: 'football', text: 'Only football' }
      ],
      correct: 'any',
      explanation: 'The best sport is one you\'ll stick with regularly!'
    },
    {
      id: 4,
      text: "When is the best time to play sports?",
      choices: [
        { id: 'regular', text: 'Regularly, even for short periods' },
        { id: 'weekend', text: 'Only on weekends' }
      ],
      correct: 'regular',
      explanation: 'Consistent activity is more beneficial than occasional intense sessions!'
    },
    {
      id: 5,
      text: "What should you do after playing sports?",
      choices: [
        { id: 'hydrate', text: 'Drink water and rest' },
        { id: 'continue', text: 'Keep playing without rest' }
      ],
      correct: 'hydrate',
      explanation: 'Rehydrating helps your brain recover too!'
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
      setScore(score + 3); // 3 coins for correct answer (max 15 coins for 5 questions)
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

  // Calculate coins based on correct answers (max 15 coins for 5 questions)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 3;
  };

  return (
    <GameShell
      title="Sports for Brain Health"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="sports-story"
      gameType="brain-health"
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

export default SportsStory;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const QuizOnHabits = () => {
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
      text: "Which of these is best for brain health?",
      choices: [
        { id: 'a', text: 'Sleep late' },
        { id: 'b', text: 'Balanced diet' },
        { id: 'c', text: 'Skip water' }
      ],
      correct: 'b',
      explanation: 'A balanced diet provides essential nutrients that support brain function and cognitive health!'
    },
    {
      id: 2,
      text: "How many hours of sleep do teens need for optimal brain function?",
      choices: [
        { id: 'a', text: '6-7 hours' },
        { id: 'b', text: '8-10 hours' },
        { id: 'c', text: '4-5 hours' }
      ],
      correct: 'b',
      explanation: 'Teens need 8-10 hours of quality sleep for proper brain development and cognitive performance!'
    },
    {
      id: 3,
      text: "Which habit helps improve focus and concentration?",
      choices: [
        { id: 'a', text: 'Multitasking' },
        { id: 'b', text: 'Regular meditation' },
        { id: 'c', text: 'Skipping breakfast' }
      ],
      correct: 'b',
      explanation: 'Regular meditation and mindfulness practices improve focus, attention, and emotional regulation!'
    },
    {
      id: 4,
      text: "What is the effect of chronic stress on the brain?",
      choices: [
        { id: 'a', text: 'Improves memory' },
        { id: 'b', text: 'Damages brain cells' },
        { id: 'c', text: 'Has no effect' }
      ],
      correct: 'b',
      explanation: 'Chronic stress releases cortisol which can damage brain cells and impair memory and learning!'
    },
    {
      id: 5,
      text: "Which activity promotes neuroplasticity (brain\'s ability to adapt)?",
      choices: [
        { id: 'a', text: 'Learning new skills' },
        { id: 'b', text: 'Watching TV all day' },
        { id: 'c', text: 'Avoiding challenges' }
      ],
      correct: 'a',
      explanation: 'Learning new skills, languages, or engaging in challenging activities promotes neuroplasticity and brain growth!'
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
      setScore(score + 3); // 3 coins for correct answer
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

  // Calculate coins based on correct answers (max 15 coins for 5 questions)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 3;
  };

  return (
    <GameShell
      title="Quiz on Habits"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="quiz-on-habits"
      gameType="brain-health"
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

export default QuizOnHabits;
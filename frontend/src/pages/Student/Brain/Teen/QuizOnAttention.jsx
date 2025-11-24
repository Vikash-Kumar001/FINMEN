import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const QuizOnAttention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-12";
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
  const [answers, setAnswers] = useState({}); // Track answers for each question

  const questions = [
    {
      id: 1,
      text: "Which of these boosts focus the most?",
      choices: [
        { id: 'a', text: 'Multitasking' },
        { id: 'b', text: 'Single task' },
        { id: 'c', text: 'Daydreaming' }
      ],
      correct: 'b',
      explanation: 'Focusing on one task at a time (single-tasking) improves concentration and productivity. Multitasking actually reduces efficiency and increases errors!'
    },
    {
      id: 2,
      text: "What is the effect of digital multitasking on productivity?",
      choices: [
        { id: 'a', text: 'Increases productivity by 40%' },
        { id: 'b', text: 'Reduces productivity by up to 40%' },
        { id: 'c', text: 'Has no measurable effect' }
      ],
      correct: 'b',
      explanation: 'Research shows that digital multitasking can reduce productivity by up to 40% due to task-switching costs!'
    },
    {
      id: 3,
      text: "Which technique helps maintain sustained attention?",
      choices: [
        { id: 'a', text: 'Checking phone every 5 minutes' },
        { id: 'b', text: 'Pomodoro Technique (25 min focus + 5 min break)' },
        { id: 'c', text: 'Working for 8 hours straight' }
      ],
      correct: 'b',
      explanation: 'The Pomodoro Technique helps maintain focus by breaking work into intervals with planned breaks!'
    },
    {
      id: 4,
      text: "How does sleep deprivation affect attention?",
      choices: [
        { id: 'a', text: 'Improves alertness' },
        { id: 'b', text: 'Impairs concentration and reaction time' },
        { id: 'c', text: 'Only affects physical performance' }
      ],
      correct: 'b',
      explanation: 'Sleep deprivation significantly impairs attention, concentration, and reaction time, making it harder to focus!'
    },
    {
      id: 5,
      text: "What environmental factor most improves focus?",
      choices: [
        { id: 'a', text: 'Noisy, chaotic environment' },
        { id: 'b', text: 'Organized, distraction-free space' },
        { id: 'c', text: 'Dimly lit room' }
      ],
      correct: 'b',
      explanation: 'An organized, distraction-free environment minimizes interruptions and helps maintain sustained attention!'
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
      setScore(score + 1); // 1 coin for correct answer
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

  // Calculate coins based on correct answers (1 coin per question)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 1;
  };

  return (
    <GameShell
      title="Quiz on Attention"
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
      {/* Removed LevelCompleteHandler */}
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

export default QuizOnAttention;
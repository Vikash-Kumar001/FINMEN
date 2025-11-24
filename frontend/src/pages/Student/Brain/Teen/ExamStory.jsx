import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const ExamStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-11";
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
      text: "Jamie studies for 1 hour with their phone nearby. Will this lead to strong focus?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ],
      correct: 'no',
      explanation: 'Having your phone nearby while studying is a major distraction that reduces focus and retention. A phone-free environment is best for effective studying!'
    },
    {
      id: 2,
      text: "What is the most effective study technique for long-term retention?",
      choices: [
        { id: 'a', text: 'Cramming the night before' },
        { id: 'b', text: 'Spaced repetition' },
        { id: 'c', text: 'Highlighting text only' }
      ],
      correct: 'b',
      explanation: 'Spaced repetition involves reviewing material at increasing intervals, which strengthens long-term memory retention!'
    },
    {
      id: 3,
      text: "How does multitasking affect exam performance?",
      choices: [
        { id: 'a', text: 'Improves performance' },
        { id: 'b', text: 'Reduces efficiency by up to 40%' },
        { id: 'c', text: 'Has no effect' }
      ],
      correct: 'b',
      explanation: 'Multitasking actually reduces productivity and increases errors, as the brain struggles to switch between tasks!'
    },
    {
      id: 4,
      text: "What is the benefit of taking short breaks during study sessions?",
      choices: [
        { id: 'a', text: 'Decreases focus' },
        { id: 'b', text: 'Prevents mental fatigue' },
        { id: 'c', text: 'Wastes valuable study time' }
      ],
      correct: 'b',
      explanation: 'Short breaks help prevent mental fatigue and maintain optimal concentration throughout study sessions!'
    },
    {
      id: 5,
      text: "Which environment is best for exam preparation?",
      choices: [
        { id: 'a', text: 'Noisy café with friends' },
        { id: 'b', text: 'Quiet, dedicated study space' },
        { id: 'c', text: 'Loud party atmosphere' }
      ],
      correct: 'b',
      explanation: 'A quiet, dedicated study space minimizes distractions and maximizes focus and retention!'
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
      title="Exam Story"
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

export default ExamStory;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const QuizOnFocus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-12";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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
      text: "What helps focus?",
      choices: [
        { id: 'a', text: 'TV' },
        { id: 'b', text: 'Quiet room' },
        { id: 'c', text: 'Phone games' }
      ],
      correct: 'b',
      explanation: 'A quiet environment helps you concentrate better!'
    },
    {
      id: 2,
      text: "Which activity improves concentration?",
      choices: [
        { id: 'a', text: 'Meditation' },
        { id: 'b', text: 'Listening to loud music' },
        { id: 'c', text: 'Multitasking' }
      ],
      correct: 'a',
      explanation: 'Meditation trains your brain to focus better!'
    },
    {
      id: 3,
      text: "When is the best time to study?",
      choices: [
        { id: 'a', text: 'When you\'re most alert' },
        { id: 'b', text: 'Very late at night' },
        { id: 'c', text: 'During your favorite TV show' }
      ],
      correct: 'a',
      explanation: 'Studying when alert maximizes your learning efficiency!'
    },
    {
      id: 4,
      text: "What should you do before starting homework?",
      choices: [
        { id: 'a', text: 'Clear your desk and gather materials' },
        { id: 'b', text: 'Check all social media' },
        { id: 'c', text: 'Start with the hardest task' }
      ],
      correct: 'a',
      explanation: 'An organized space helps you focus on your work!'
    },
    {
      id: 5,
      text: "How long should you focus before taking a break?",
      choices: [
        { id: 'a', text: '25-30 minutes' },
        { id: 'b', text: 'Several hours without break' },
        { id: 'c', text: '5 minutes' }
      ],
      correct: 'a',
      explanation: 'Short focused sessions with breaks help maintain concentration!'
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
      title="Focus Quiz"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-12"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/kids"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
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

export default QuizOnFocus;
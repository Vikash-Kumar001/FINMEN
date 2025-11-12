import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const JunkFoodStory = () => {
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
      text: "Sam eats junk food every day. Does this weaken brain function?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ],
      correct: 'yes',
      explanation: 'Excessive junk food consumption can lead to inflammation and impair cognitive function over time!'
    },
    {
      id: 2,
      text: "Which nutrient is essential for brain development and function?",
      choices: [
        { id: 'a', text: 'Omega-3 fatty acids' },
        { id: 'b', text: 'Trans fats' },
        { id: 'c', text: 'High fructose corn syrup' }
      ],
      correct: 'a',
      explanation: 'Omega-3 fatty acids are crucial for brain cell membrane health and cognitive function!'
    },
    {
      id: 3,
      text: "How does sugar consumption affect focus and attention?",
      choices: [
        { id: 'a', text: 'Improves sustained attention' },
        { id: 'b', text: 'Causes energy crashes' },
        { id: 'c', text: 'Has no effect on focus' }
      ],
      correct: 'b',
      explanation: 'High sugar intake causes blood sugar spikes followed by crashes, leading to decreased focus and irritability!'
    },
    {
      id: 4,
      text: "Which food group provides steady energy for the brain?",
      choices: [
        { id: 'a', text: 'Processed snacks' },
        { id: 'b', text: 'Complex carbohydrates' },
        { id: 'c', text: 'Sugary drinks' }
      ],
      correct: 'b',
      explanation: 'Complex carbohydrates provide steady glucose release, maintaining consistent brain energy levels!'
    },
    {
      id: 5,
      text: "What is the effect of a balanced diet on academic performance?",
      choices: [
        { id: 'a', text: 'Decreases test scores' },
        { id: 'b', text: 'Improves concentration and grades' },
        { id: 'c', text: 'Only affects physical health' }
      ],
      correct: 'b',
      explanation: 'A balanced diet rich in nutrients supports optimal brain function, improving concentration, memory, and academic performance!'
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

  // Calculate coins based on correct answers (max 50 coins for 5 questions)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 10;
  };

  return (
    <GameShell
      title="Junk Food Story"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-teens-5"
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

export default JunkFoodStory;
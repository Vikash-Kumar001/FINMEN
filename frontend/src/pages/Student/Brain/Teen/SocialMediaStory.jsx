import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const SocialMediaStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-15";
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
      text: "Taylor scrolls through social media while studying. Is this good for focus?",
      choices: [
        { id: 'yes', text: 'Yes' },
        { id: 'no', text: 'No' }
      ],
      correct: 'no',
      explanation: 'Multitasking with social media while studying significantly reduces focus and retention. It\'s best to study in a distraction-free environment!'
    },
    {
      id: 2,
      text: "How does excessive social media use affect sleep quality?",
      choices: [
        { id: 'a', text: 'Improves sleep' },
        { id: 'b', text: 'Disrupts sleep patterns' },
        { id: 'c', text: 'Has no effect' }
      ],
      correct: 'b',
      explanation: 'The blue light from screens and mental stimulation from social media can interfere with sleep quality and duration!'
    },
    {
      id: 3,
      text: "What is the impact of social media comparison on mental health?",
      choices: [
        { id: 'a', text: 'Boosts self-esteem' },
        { id: 'b', text: 'Can lead to anxiety and depression' },
        { id: 'c', text: 'Only affects adults' }
      ],
      correct: 'b',
      explanation: 'Constant comparison with others on social media can negatively impact self-esteem and contribute to anxiety and depression!'
    },
    {
      id: 4,
      text: "What is a healthy approach to social media usage?",
      choices: [
        { id: 'a', text: 'Unlimited scrolling anytime' },
        { id: 'b', text: 'Set time limits and take breaks' },
        { id: 'c', text: 'Avoid it completely' }
      ],
      correct: 'b',
      explanation: 'Setting time limits and taking regular breaks helps maintain a healthy relationship with social media while preserving mental well-being!'
    },
    {
      id: 5,
      text: "How does social media affect face-to-face communication skills?",
      choices: [
        { id: 'a', text: 'Improves communication skills' },
        { id: 'b', text: 'Can reduce empathy and social skills' },
        { id: 'c', text: 'Only affects older people' }
      ],
      correct: 'b',
      explanation: 'Over-reliance on digital communication can reduce empathy and face-to-face social skills, especially in teens still developing these abilities!'
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
      title="Social Media Story"
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

export default SocialMediaStory;
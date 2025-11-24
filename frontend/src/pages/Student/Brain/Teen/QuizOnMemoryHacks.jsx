// QuizOnMemoryHacks.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const QuizOnMemoryHacks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-22";
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
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Which memory hack uses acronyms?",
      choices: [
        { id: 'a', text: 'Mnemonics', icon: '🔤' },
        { id: 'b', text: 'Cramming', icon: '📖' },
        { id: 'c', text: 'Forgetting', icon: '🗑️' }
      ],
      correct: 'a',
      explanation: 'Mnemonics like acronyms help remember lists easily!'
    },
    {
      id: 2,
      text: "What's a good hack for remembering names?",
      choices: [
        { id: 'a', text: 'Association with faces', icon: '👥' },
        { id: 'b', text: 'Ignoring them', icon: '🙉' },
        { id: 'c', text: 'Writing once', icon: '✏️' }
      ],
      correct: 'a',
      explanation: 'Linking names to visual cues boosts recall!'
    },
    {
      id: 3,
      text: "Does chunking help with phone numbers?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '📞' },
        { id: 'no', text: 'No', icon: '🚫' }
      ],
      correct: 'yes',
      explanation: 'Breaking info into chunks makes it easier to remember!'
    },
    {
      id: 4,
      text: "Which hack involves repeating information?",
      choices: [
        { id: 'a', text: 'Spaced repetition', icon: '🔄' },
        { id: 'b', text: 'Single read', icon: '📄' },
        { id: 'c', text: 'Distraction', icon: '📱' }
      ],
      correct: 'a',
      explanation: 'Spaced repetition reinforces memory over time!'
    },
    {
      id: 5,
      text: "Is mind mapping a visual memory hack?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '🗺️' },
        { id: 'no', text: 'No', icon: '❌' }
      ],
      correct: 'yes',
      explanation: 'Mind maps organize info visually for better recall!'
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
      setScore(score + 1); // 1 coin for correct answer
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
    navigate('/games/brain-health/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 1;
  };

  return (
    <GameShell
      title="Quiz on Memory Hacks"
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

export default QuizOnMemoryHacks;
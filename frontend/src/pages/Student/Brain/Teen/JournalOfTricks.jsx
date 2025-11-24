// JournalOfTricks.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const JournalOfTricks = () => {
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
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "Journal: One memory trick I use is ___?",
      choices: [
        { id: 'a', text: 'Mnemonics', icon: '🔤' },
        { id: 'b', text: 'Cramming', icon: '📖' },
        { id: 'c', text: 'Forgetting', icon: '🗑️' }
      ],
      correct: 'a',
      explanation: 'Mnemonics are a great trick for memory!'
    },
    {
      id: 2,
      text: "Write in journal: Favorite trick?",
      choices: [
        { id: 'a', text: 'Visualization', icon: '🖼️' },
        { id: 'b', text: 'Distraction', icon: '📱' }
      ],
      correct: 'a',
      explanation: 'Visualization makes memories vivid!'
    },
    {
      id: 3,
      text: "Journal entry: Trick for lists?",
      choices: [
        { id: 'a', text: 'Acronyms', icon: 'ABC' },
        { id: 'b', text: 'Ignoring', icon: '🙈' }
      ],
      correct: 'a',
      explanation: 'Acronyms simplify lists!'
    },
    {
      id: 4,
      text: "One trick: Spaced repetition?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '🔄' },
        { id: 'no', text: 'No', icon: '🚫' }
      ],
      correct: 'yes',
      explanation: 'It\'s effective for long-term memory!'
    },
    {
      id: 5,
      text: "Journal: Trick with stories?",
      choices: [
        { id: 'a', text: 'Story linking', icon: '📖' },
        { id: 'b', text: 'Random facts', icon: '❓' }
      ],
      correct: 'a',
      explanation: 'Linking info in stories aids recall!'
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
      title="Journal of Tricks"
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

export default JournalOfTricks;
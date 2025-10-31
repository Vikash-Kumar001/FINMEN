// NoteTakingStory.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const NoteTakingStory = () => {
  const navigate = useNavigate();
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
      text: "Taking notes in class improves memory. Yes or No?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '📝' },
        { id: 'no', text: 'No', icon: '🚫' }
      ],
      correct: 'yes',
      explanation: 'Writing notes reinforces learning and aids recall!'
    },
    {
      id: 2,
      text: "Best note-taking method for visuals?",
      choices: [
        { id: 'a', text: 'Mind mapping', icon: '🗺️' },
        { id: 'b', text: 'Copying verbatim', icon: '📋' },
        { id: 'c', text: 'Ignoring diagrams', icon: '🙈' }
      ],
      correct: 'a',
      explanation: 'Mind maps capture relationships visually!'
    },
    {
      id: 3,
      text: "Does highlighting help in notes?",
      choices: [
        { id: 'a', text: 'Yes, for key points', icon: '🖍️' },
        { id: 'b', text: 'No, it distracts', icon: '🚫' }
      ],
      correct: 'a',
      explanation: 'Highlighting focuses on important info!'
    },
    {
      id: 4,
      text: "Should notes be reviewed regularly?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '🔄' },
        { id: 'no', text: 'No', icon: '🗑️' }
      ],
      correct: 'yes',
      explanation: 'Regular review strengthens memory!'
    },
    {
      id: 5,
      text: "Digital or handwritten notes better for memory?",
      choices: [
        { id: 'a', text: 'Handwritten', icon: '✍️' },
        { id: 'b', text: 'Digital', icon: '💻' },
        { id: 'c', text: 'Both equal', icon: '⚖️' }
      ],
      correct: 'a',
      explanation: 'Handwriting engages more brain areas!'
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
      setScore(score + 10);
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
    navigate('/games/memory/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 10;
  };

  return (
    <GameShell
      title="Note-taking Story"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="memory-teens-55"
      gameType="memory"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/memory/teens"
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

export default NoteTakingStory;
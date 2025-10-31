// PuzzleMnemonicMatch.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const PuzzleMnemonicMatch = () => {
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
      text: "Match VIBGYOR to what?",
      choices: [
        { id: 'a', text: 'Rainbow colors', icon: '🌈' },
        { id: 'b', text: 'Math order', icon: '➗' },
        { id: 'c', text: 'Planets', icon: '🪐' }
      ],
      correct: 'a',
      explanation: 'VIBGYOR stands for Violet, Indigo, Blue, Green, Yellow, Orange, Red!'
    },
    {
      id: 2,
      text: "BODMAS matches to?",
      choices: [
        { id: 'a', text: 'Bracket, Of, Division, etc.', icon: '🧮' },
        { id: 'b', text: 'Colors', icon: '🎨' },
        { id: 'c', text: 'Animals', icon: '🐾' }
      ],
      correct: 'a',
      explanation: 'BODMAS is the order of operations in math!'
    },
    {
      id: 3,
      text: "Match PEMDAS to math?",
      choices: [
        { id: 'yes', text: 'Yes, similar to BODMAS', icon: '📐' },
        { id: 'no', text: 'No, it\'s for music', icon: '🎵' }
      ],
      correct: 'yes',
      explanation: 'PEMDAS is Parentheses, Exponents, Multiplication, etc.!'
    },
    {
      id: 4,
      text: "ROYGBIV is for?",
      choices: [
        { id: 'a', text: 'Rainbow', icon: '🌈' },
        { id: 'b', text: 'Directions', icon: '🧭' },
        { id: 'c', text: 'Fruits', icon: '🍎' }
      ],
      correct: 'a',
      explanation: 'It\'s the reverse of VIBGYOR for colors!'
    },
    {
      id: 5,
      text: "Match HOMES to Great Lakes?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '🌊' },
        { id: 'no', text: 'No', icon: '🏠' }
      ],
      correct: 'yes',
      explanation: 'Huron, Ontario, Michigan, Erie, Superior!'
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
      title="Puzzle: Mnemonic Match"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="memory-teens-54"
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

export default PuzzleMnemonicMatch;
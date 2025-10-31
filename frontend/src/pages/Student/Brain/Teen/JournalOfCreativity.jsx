import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const JournalOfCreativity = () => {
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
      text: "One creative idea I had was ___?",
      choices: [
        { id: 'a', text: 'New project', icon: '💡🔬' },
        { id: 'b', text: 'Copy others', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Original projects spark creativity!'
    },
    {
      id: 2,
      text: "Journal: Creative habit?",
      choices: [
        { id: 'a', text: 'Brainstorm ideas', icon: '🧠💡' },
        { id: 'b', text: 'Follow examples', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Brainstorming fuels innovation!'
    },
    {
      id: 3,
      text: "Creative problem-solving?",
      choices: [
        { id: 'a', text: 'Try new solutions', icon: '🔧💡' },
        { id: 'b', text: 'Give up', icon: '🚫' }
      ],
      correct: 'a',
      explanation: 'New solutions drive progress!'
    },
    {
      id: 4,
      text: "Creative project idea?",
      choices: [
        { id: 'a', text: 'Unique design', icon: '💡🎨' },
        { id: 'b', text: 'Copy template', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Unique designs stand out!'
    },
    {
      id: 5,
      text: "Journal: Creative goal?",
      choices: [
        { id: 'a', text: 'Innovate', icon: '💡🔄' },
        { id: 'b', text: 'Replicate', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Innovation builds creative skills!'
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
    navigate('/games/emotion/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Journal of Creativity"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-177"
      gameType="emotion"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/emotion/teens"
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

export default JournalOfCreativity;
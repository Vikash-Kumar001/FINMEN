import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const BadgeInnovatorHero = () => {
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
      text: "Challenge 1: Project fails?",
      choices: [
        { id: 'a', text: 'Innovate solution', icon: '🔧💡' },
        { id: 'b', text: 'Give up', icon: '🚫' }
      ],
      correct: 'a',
      explanation: 'Innovative solutions overcome failure!'
    },
    {
      id: 2,
      text: "Challenge: No ideas?",
      choices: [
        { id: 'a', text: 'Brainstorm new', icon: '🧠💡' },
        { id: 'b', text: 'Copy others', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Brainstorming sparks originality!'
    },
    {
      id: 3,
      text: "Challenge: Tough problem?",
      choices: [
        { id: 'a', text: 'Try new approach', icon: '🔄💡' },
        { id: 'b', text: 'Complain', icon: '😣' }
      ],
      correct: 'a',
      explanation: 'New approaches solve tough issues!'
    },
    {
      id: 4,
      text: "Challenge: School fair?",
      choices: [
        { id: 'a', text: 'Unique project', icon: '💡🔬' },
        { id: 'b', text: 'Copy template', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Unique projects impress!'
    },
    {
      id: 5,
      text: "Challenge: Creative task?",
      choices: [
        { id: 'a', text: 'Original idea', icon: '🧠💡' },
        { id: 'b', text: 'Imitate', icon: '📝' }
      ],
      correct: 'a',
      explanation: 'Original ideas drive innovation!'
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
      title="Badge: Innovator Hero"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-180"
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

export default BadgeInnovatorHero;
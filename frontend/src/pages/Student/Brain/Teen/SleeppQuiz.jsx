import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const SleeppQuiz = () => {
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
      text: "How many hours should teens sleep?",
      choices: [
        { id: 'a', text: '5 hours', icon: '😴5️⃣' },
        { id: 'b', text: '6–8 hours', icon: '🛌6️⃣8️⃣' },
        { id: 'c', text: '12 hours', icon: '😴1️⃣2️⃣' }
      ],
      correct: 'b',
      explanation: '6–8 hours supports teen brain and body health!'
    },
    {
      id: 2,
      text: "Best bedtime habit?",
      choices: [
        { id: 'a', text: 'Consistent schedule', icon: '📅🛌' },
        { id: 'b', text: 'Late-night gaming', icon: '🎮' }
      ],
      correct: 'a',
      explanation: 'Regular sleep improves rest quality!'
    },
    {
      id: 3,
      text: "Screens before bed?",
      choices: [
        { id: 'a', text: 'Disrupt sleep', icon: '📱🚫' },
        { id: 'b', text: 'Help relax', icon: '😌' }
      ],
      correct: 'a',
      explanation: 'Blue light delays melatonin production!'
    },
    {
      id: 4,
      text: "Naps for teens?",
      choices: [
        { id: 'a', text: 'Short, refreshing', icon: '😴⏰' },
        { id: 'b', text: 'Long, disruptive', icon: '😴🕒' }
      ],
      correct: 'a',
      explanation: 'Short naps boost energy without ruining sleep!'
    },
    {
      id: 5,
      text: "Sleep impacts focus?",
      choices: [
        { id: 'yes', text: 'Yes, greatly', icon: '🧠💡' },
        { id: 'no', text: 'No, not much', icon: '🙈' }
      ],
      correct: 'yes',
      explanation: 'Good sleep sharpens focus and memory!'
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
      title="Sleep Quiz"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="emotion-teens-132"
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

export default SleeppQuiz;
// DebateStressGoodOrBad.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const DebateStressGoodOrBad = () => {
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
      text: "Can stress sometimes motivate us?",
      choices: [
        { id: 'a', text: 'Yes, in small amounts', icon: '⚡' },
        { id: 'b', text: 'No, always bad', icon: '🚫' }
      ],
      correct: 'a',
      explanation: 'Eustress can push us to perform better!'
    },
    {
      id: 2,
      text: "Chronic stress is harmful?",
      choices: [
        { id: 'yes', text: 'Yes', icon: '😩' },
        { id: 'no', text: 'No', icon: '😊' }
      ],
      correct: 'yes',
      explanation: 'Long-term stress affects health negatively!'
    },
    {
      id: 3,
      text: "Stress helps in deadlines?",
      choices: [
        { id: 'a', text: 'Sometimes, motivates', icon: '⏰💪' },
        { id: 'b', text: 'Always paralyzes', icon: '🛑' }
      ],
      correct: 'a',
      explanation: 'Moderate stress sharpens focus!'
    },
    {
      id: 4,
      text: "All stress should be avoided?",
      choices: [
        { id: 'a', text: 'No, some is useful', icon: '⚖️' },
        { id: 'b', text: 'Yes, eliminate all', icon: '🗑️' }
      ],
      correct: 'a',
      explanation: 'Balance is key; some stress drives growth!'
    },
    {
      id: 5,
      text: "Stress response is natural?",
      choices: [
        { id: 'yes', text: 'Yes, fight or flight', icon: '🏃‍♂️' },
        { id: 'no', text: 'No, modern issue', icon: '🕰️' }
      ],
      correct: 'yes',
      explanation: 'It\'s an evolutionary survival mechanism!'
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
    navigate('/games/stress/teens');
  };

  const currentQuestionData = questions[currentQuestion];

  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 10;
  };

  return (
    <GameShell
      title="Debate: Stress Good or Bad?"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      gameId="stress-teens-76"
      gameType="stress"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={currentQuestion < questions.length - 1}
      nextLabel="Next"
      showAnswerConfetti={showConfetti}
      backPath="/games/stress/teens"
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

export default DebateStressGoodOrBad;
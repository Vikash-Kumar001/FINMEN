// File: PositivityQuiz.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Sun, Check, X, Smile, Heart, Sparkles, ThumbsUp } from 'lucide-react';

const PositivityQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levels = [
    {
      id: 1,
      question: "What is positive thinking? (a) Complaining, (b) Looking for good side, (c) Giving up",
      options: ["(a) Complaining", "(b) Looking for good side", "(c) Giving up"],
      correct: "(b) Looking for good side",
      icon: <Sun className="w-8 h-8" />
    },
    {
      id: 2,
      question: "Positive attitude means? (a) See the bright side, (b) Always sad, (c) Ignore problems",
      options: ["(a) See the bright side", "(b) Always sad", "(c) Ignore problems"],
      correct: "(a) See the bright side",
      icon: <Smile className="w-8 h-8" />
    },
    {
      id: 3,
      question: "Gratitude is? (a) Saying thanks, (b) Complaining, (c) Forgetting",
      options: ["(a) Saying thanks", "(b) Complaining", "(c) Forgetting"],
      correct: "(a) Saying thanks",
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 4,
      question: "Optimism is? (a) Hoping for best, (b) Expecting worst, (c) Doing nothing",
      options: ["(a) Hoping for best", "(b) Expecting worst", "(c) Doing nothing"],
      correct: "(a) Hoping for best",
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      id: 5,
      question: "Positive thinking helps? (a) Feel better, (b) Feel worse, (c) No change",
      options: ["(a) Feel better", "(b) Feel worse", "(c) No change"],
      correct: "(a) Feel better",
      icon: <ThumbsUp className="w-8 h-8" />
    }
  ];

  const currentLevelData = levels[currentLevel - 1];

  const handleAnswerSelect = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
      if (selectedAnswer === currentLevelData.correct) {
        setFeedbackType("correct");
        setFeedbackMessage("Positive answer! Correct.");
        setScore(prev => prev + 3);
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setSelectedAnswer(null);
            setIsSubmitted(false);
          } else {
            setLevelCompleted(true);
          }
        }, 2000);
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("Not positive. Try again!");
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setIsSubmitted(false);
        }, 2000);
      }
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Select an answer!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Quiz on Positivity"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-102"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Quiz on Positivity</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.question}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center mb-4">{currentLevelData.icon}</div>
          <div className="space-y-4">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-lg ${selectedAnswer === option ? 'bg-blue-500' : 'bg-white/20'} text-white text-left`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitted}
              className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg ${
                selectedAnswer && !isSubmitted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
        
        {showFeedback && (
          <FeedbackBubble 
            message={feedbackMessage}
            type={feedbackType}
          />
        )}
      </GameCard>
    </GameShell>
  );
};

export default PositivityQuiz;
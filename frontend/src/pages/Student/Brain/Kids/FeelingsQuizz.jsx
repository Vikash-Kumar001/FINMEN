// File: FeelingsQuiz.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Smile, Check, X, Frown, Zap, Sparkles, AlertTriangle } from 'lucide-react';

const FeelingsQuizz = () => {
  const navigate = useNavigate();
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
      question: "Which is an emotion? (a) Happiness, (b) Shoes, (c) Pen",
      options: ["(a) Happiness", "(b) Shoes", "(c) Pen"],
      correct: "(a) Happiness",
      icon: <Smile className="w-8 h-8" />
    },
    {
      id: 2,
      question: "What’s a feeling? (a) Table, (b) Sadness, (c) Book",
      options: ["(a) Table", "(b) Sadness", "(c) Book"],
      correct: "(b) Sadness",
      icon: <Frown className="w-8 h-8" />
    },
    {
      id: 3,
      question: "Which is an emotion? (a) Anger, (b) Car, (c) Pencil",
      options: ["(a) Anger", "(b) Car", "(c) Pencil"],
      correct: "(a) Anger",
      icon: <Zap className="w-8 h-8" />
    },
    {
      id: 4,
      question: "What’s a feeling? (a) Excitement, (b) Clock, (c) Chair",
      options: ["(a) Excitement", "(b) Clock", "(c) Chair"],
      correct: "(a) Excitement",
      icon: <Sparkles className="w-8 h-8" />
    },
    {
      id: 5,
      question: "Which is an emotion? (a) Fear, (b) Lamp, (c) Ball",
      options: ["(a) Fear", "(b) Lamp", "(c) Ball"],
      correct: "(a) Fear",
      icon: <AlertTriangle className="w-8 h-8" />
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
        setFeedbackMessage("Correct! That’s an emotion.");
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
        setFeedbackMessage("That’s not an emotion. Try again!");
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
      title="Quiz on Feelings"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      gameId="brain-kids-82"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Quiz on Feelings</h3>
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

export default FeelingsQuizz;
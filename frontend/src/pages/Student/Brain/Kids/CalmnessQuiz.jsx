// File: CalmnessQuiz.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Wind, Check, X, Flower2, Music, Clock, Users } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const CalmnessQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-32";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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
      question: "What reduces stress? (a) Deep breathing, (b) Shouting, (c) Worrying",
      options: ["(a) Deep breathing", "(b) Shouting", "(c) Worrying"],
      correct: "(a) Deep breathing",
      icon: <Wind className="w-8 h-8" />
    },
    {
      id: 2,
      question: "Best for calmness? (a) Running around, (b) Meditation, (c) Arguing",
      options: ["(a) Running around", "(b) Meditation", "(c) Arguing"],
      correct: "(b) Meditation",
      icon: <Flower2 className="w-8 h-8" />
    },
    {
      id: 3,
      question: "To relax? (a) Listen to music, (b) Watch scary movies, (c) Eat junk",
      options: ["(a) Listen to music", "(b) Watch scary movies", "(c) Eat junk"],
      correct: "(a) Listen to music",
      icon: <Music className="w-8 h-8" />
    },
    {
      id: 4,
      question: "Handle anger? (a) Count to 10, (b) Hit something, (c) Yell",
      options: ["(a) Count to 10", "(b) Hit something", "(c) Yell"],
      correct: "(a) Count to 10",
      icon: <Clock className="w-8 h-8" />
    },
    {
      id: 5,
      question: "For peace? (a) Talk to friend, (b) Isolate, (c) Worry more",
      options: ["(a) Talk to friend", "(b) Isolate", "(c) Worry more"],
      correct: "(a) Talk to friend",
      icon: <Users className="w-8 h-8" />
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
        setFeedbackMessage("Correct! Good job.");
        setScore(prev => prev + 1);
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
        setFeedbackMessage("Incorrect. Try again.");
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
      title="Quiz on Calmness"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-62"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Quiz on Calmness</h3>
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

export default CalmnessQuiz;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Monitor, Check, X, Moon, Clock, Gamepad, Eye } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const ScreensQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-142";
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
      question: "Too much screen time causes? (a) Eye strain, (b) More energy, (c) Superpowers",
      options: ["(a) Eye strain", "(b) More energy", "(c) Superpowers"],
      correct: "(a) Eye strain",
      icon: <Monitor className="w-8 h-8" />
    },
    {
      id: 2,
      question: "Screens before bed affect? (a) Sleep, (b) Strength, (c) Height",
      options: ["(a) Sleep", "(b) Strength", "(c) Height"],
      correct: "(a) Sleep",
      icon: <Moon className="w-8 h-8" />
    },
    {
      id: 3,
      question: "Best screen time limit? (a) 10 hrs, (b) 1–2 hrs, (c) No limit",
      options: ["(a) 10 hrs", "(b) 1–2 hrs", "(c) No limit"],
      correct: "(b) 1–2 hrs",
      icon: <Clock className="w-8 h-8" />
    },
    {
      id: 4,
      question: "Too much gaming causes? (a) Focus, (b) Tiredness, (c) Speed",
      options: ["(a) Focus", "(b) Tiredness", "(c) Speed"],
      correct: "(b) Tiredness",
      icon: <Gamepad className="w-8 h-8" />
    },
    {
      id: 5,
      question: "Balanced screen use helps? (a) Eyes, (b) Headaches, (c) Laziness",
      options: ["(a) Eyes", "(b) Headaches", "(c) Laziness"],
      correct: "(a) Eyes",
      icon: <Eye className="w-8 h-8" />
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
        setFeedbackMessage("Correct! Good screen knowledge.");
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
        setFeedbackMessage("Not quite! Try again.");
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
      title="Quiz on Screens"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-142"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Quiz on Screens</h3>
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

export default ScreensQuiz;
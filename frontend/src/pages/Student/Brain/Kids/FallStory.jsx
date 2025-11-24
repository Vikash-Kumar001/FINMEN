import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Bike, Check, X, Play, Palette, Music, Zap } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const FallStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-181";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levels = [
    {
      id: 1,
      story: "Kid falls while cycling. Do they quit or try again?",
      choices: ["Try again", "Quit"],
      correct: "Try again",
      icon: <Bike className="w-8 h-8" />
    },
    {
      id: 2,
      story: "Kid trips during a race. Best choice?",
      choices: ["Get up and run", "Stop running"],
      correct: "Get up and run",
      icon: <Play className="w-8 h-8" />
    },
    {
      id: 3,
      story: "Kid drops art project. What to do?",
      choices: ["Start over", "Give up"],
      correct: "Start over",
      icon: <Palette className="w-8 h-8" />
    },
    {
      id: 4,
      story: "Kid messes up in dance class. Next step?",
      choices: ["Practice again", "Quit dancing"],
      correct: "Practice again",
      icon: <Music className="w-8 h-8" />
    },
    {
      id: 5,
      story: "Kid falls off skateboard. Best action?",
      choices: ["Try again", "Stop skating"],
      correct: "Try again",
      icon: <Zap className="w-8 h-8" />
    }
  ];

  const currentLevelData = levels[currentLevel - 1];

  const handleChoiceSelect = (choice) => {
    if (!isSubmitted) {
      setSelectedChoice(choice);
    }
  };

  const handleSubmit = () => {
    if (selectedChoice) {
      setIsSubmitted(true);
      if (selectedChoice === currentLevelData.correct) {
        setFeedbackType("correct");
        setFeedbackMessage("Great resilience!");
        setScore(prev => prev + 1);
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setSelectedChoice(null);
            setIsSubmitted(false);
          } else {
            setLevelCompleted(true);
          }
        }, 2000);
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("Keep trying! Try again.");
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setIsSubmitted(false);
        }, 2000);
      }
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Select a choice!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Fall Story"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-181"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Fall Story</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.story}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center mb-4">{currentLevelData.icon}</div>
          <div className="grid grid-cols-2 gap-4">
            {currentLevelData.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(choice)}
                className={`p-4 rounded-lg ${selectedChoice === choice ? 'bg-blue-500' : 'bg-white/20'} text-white`}
              >
                {choice}
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedChoice || isSubmitted}
              className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg ${
                selectedChoice && !isSubmitted
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

export default FallStory;
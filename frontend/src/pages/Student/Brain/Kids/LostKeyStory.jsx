import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Key, Check, X, Book, ToyBrick, Droplet, Bus } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const LostKeyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-161";
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
      story: "Kid loses classroom key. Best action?",
      choices: ["Tell teacher & find solution", "Hide it", "Ignore it"],
      correct: "Tell teacher & find solution",
      icon: <Key className="w-8 h-8" />
    },
    {
      id: 2,
      story: "Kid forgets homework at home. Best action?",
      choices: ["Ask teacher for help", "Pretend it's done", "Skip class"],
      correct: "Ask teacher for help",
      icon: <Book className="w-8 h-8" />
    },
    {
      id: 3,
      story: "Kid breaks toy. Best action?",
      choices: ["Fix or replace it", "Hide it", "Blame someone"],
      correct: "Fix or replace it",
      icon: <ToyBrick className="w-8 h-8" />
    },
    {
      id: 4,
      story: "Kid spills juice in class. Best action?",
      choices: ["Clean it up", "Leave it", "Deny it"],
      correct: "Clean it up",
      icon: <Droplet className="w-8 h-8" />
    },
    {
      id: 5,
      story: "Kid misses bus. Best action?",
      choices: ["Find another way", "Skip school", "Wait all day"],
      correct: "Find another way",
      icon: <Bus className="w-8 h-8" />
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
        setFeedbackMessage("Great problem-solving!");
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
        setFeedbackMessage("Try a better solution!");
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
      title="Lost Key Story"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-161"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Lost Key Story</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.story}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center mb-4">{currentLevelData.icon}</div>
          <div className="space-y-4">
            {currentLevelData.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(choice)}
                className={`w-full p-4 rounded-lg ${selectedChoice === choice ? 'bg-blue-500' : 'bg-white/20'} text-white text-left`}
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

export default LostKeyStory;
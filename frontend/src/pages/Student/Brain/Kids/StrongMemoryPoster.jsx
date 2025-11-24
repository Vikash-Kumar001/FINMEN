// File: StrongMemoryPoster.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Moon, Apple, Book, Dumbbell, Zap } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const StrongMemoryPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-46";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levelPosters = [
    // Level 1
    [
      {
        id: 1,
        title: "Practice Daily",
        elements: [{ icon: <Brain />, text: "Repeat" }, { icon: <Book />, text: "Read" }],
        color: "bg-gradient-to-r from-blue-500 to-green-500"
      },
      {
        id: 2,
        title: "Eat Well",
        elements: [{ icon: <Apple />, text: "Fruits" }, { icon: <Moon />, text: "Sleep" }],
        color: "bg-gradient-to-r from-red-500 to-yellow-500"
      }
    ],
    // Level 2
    [
      {
        id: 1,
        title: "Exercise Mind",
        elements: [{ icon: <Dumbbell />, text: "Puzzles" }, { icon: <Zap />, text: "Quick Think" }],
        color: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        id: 2,
        title: "Rest Brain",
        elements: [{ icon: <Moon />, text: "Sleep" }, { icon: <Brain />, text: "Relax" }],
        color: "bg-gradient-to-r from-green-500 to-blue-500"
      }
    ],
    // Add similar for levels 3-5
    [
      {
        id: 1,
        title: "Learn New",
        elements: [{ icon: <Book />, text: "Study" }, { icon: <Apple />, text: "Healthy Food" }],
        color: "bg-gradient-to-r from-yellow-500 to-orange-500"
      },
      {
        id: 2,
        title: "Play Games",
        elements: [{ icon: <Dumbbell />, text: "Active" }, { icon: <Zap />, text: "Energy" }],
        color: "bg-gradient-to-r from-blue-500 to-purple-500"
      }
    ],
    [
      {
        id: 1,
        title: "Memory Tips",
        elements: [{ icon: <Brain />, text: "Focus" }, { icon: <Moon />, text: "Rest" }],
        color: "bg-gradient-to-r from-pink-500 to-red-500"
      },
      {
        id: 2,
        title: "Strong Habits",
        elements: [{ icon: <Apple />, text: "Eat" }, { icon: <Book />, text: "Learn" }],
        color: "bg-gradient-to-r from-green-500 to-yellow-500"
      }
    ],
    [
      {
        id: 1,
        title: "Brain Boost",
        elements: [{ icon: <Zap />, text: "Hydrate" }, { icon: <Dumbbell />, text: "Move" }],
        color: "bg-gradient-to-r from-orange-500 to-red-500"
      },
      {
        id: 2,
        title: "Memory Master",
        elements: [{ icon: <Brain />, text: "Practice" }, { icon: <Book />, text: "Read" }],
        color: "bg-gradient-to-r from-purple-500 to-blue-500"
      }
    ]
  ];

  const posters = levelPosters[currentLevel - 1];

  const handlePosterSelect = (poster) => {
    if (!isSubmitted) {
      setSelectedPoster(poster);
    }
  };

  const handleSubmit = () => {
    if (selectedPoster) {
      setIsSubmitted(true);
      setFeedbackType("correct");
      setFeedbackMessage("Awesome poster choice!");
      setScore(prev => prev + 1); // 1 coin per correct answer
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentLevel < 5) {
          setCurrentLevel(prev => prev + 1);
          setSelectedPoster(null);
          setIsSubmitted(false);
        } else {
          setLevelCompleted(true);
        }
      }, 2000);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Select a poster!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Poster: Strong Memory"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-46"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Strong Memory Poster</h3>
        <p className="text-white/80 mb-6 text-center">Create or select a poster for strong memory.</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posters.map((poster) => (
              <div
                key={poster.id}
                onClick={() => handlePosterSelect(poster)}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPoster?.id === poster.id ? 'border-white ring-2 ring-white/30 bg-white/20' : 'border-white/30 hover:border-white/50 bg-white/10'
                }`}
              >
                <div className={`rounded-lg p-4 mb-4 ${poster.color}`}>
                  <h5 className="text-white font-bold text-center">{poster.title}</h5>
                </div>
                <div className="space-y-3">
                  {poster.elements.map((element, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-white mr-3">{element.icon}</div>
                      <span className="text-white">{element.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedPoster || isSubmitted}
              className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg ${
                selectedPoster && !isSubmitted
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

export default StrongMemoryPoster;
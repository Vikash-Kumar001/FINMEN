import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Moon, Battery, Bed, Clock } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const SleepWellPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-126";
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
    [
      {
        id: 1,
        title: "Sleep = Brain Fuel",
        elements: [{ icon: <Moon />, text: "Rest Well" }, { icon: <Battery />, text: "Energy" }],
        color: "bg-gradient-to-r from-blue-500 to-purple-500"
      },
      {
        id: 2,
        title: "Dreams Charge You",
        elements: [{ icon: <Bed />, text: "Sleep Early" }, { icon: <Clock />, text: "Routine" }],
        color: "bg-gradient-to-r from-green-500 to-teal-500"
      }
    ],
    [
      {
        id: 1,
        title: "Rest to Shine",
        elements: [{ icon: <Moon />, text: "Calm Night" }, { icon: <Battery />, text: "Focus" }],
        color: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        id: 2,
        title: "Sleep Smart",
        elements: [{ icon: <Bed />, text: "No Screens" }, { icon: <Clock />, text: "9 PM Bed" }],
        color: "bg-gradient-to-r from-teal-500 to-blue-500"
      }
    ],
    [
      {
        id: 1,
        title: "Power of Rest",
        elements: [{ icon: <Moon />, text: "Sleep Well" }, { icon: <Battery />, text: "Strength" }],
        color: "bg-gradient-to-r from-yellow-500 to-orange-500"
      },
      {
        id: 2,
        title: "Night Recharge",
        elements: [{ icon: <Bed />, text: "Dark Room" }, { icon: <Clock />, text: "Schedule" }],
        color: "bg-gradient-to-r from-blue-500 to-green-500"
      }
    ],
    [
      {
        id: 1,
        title: "Sleep for Success",
        elements: [{ icon: <Moon />, text: "Rest Easy" }, { icon: <Battery />, text: "Alert" }],
        color: "bg-gradient-to-r from-pink-500 to-red-500"
      },
      {
        id: 2,
        title: "Dream Big",
        elements: [{ icon: <Bed />, text: "Early Bed" }, { icon: <Clock />, text: "Timing" }],
        color: "bg-gradient-to-r from-green-500 to-yellow-500"
      }
    ],
    [
      {
        id: 1,
        title: "Rest is Best",
        elements: [{ icon: <Moon />, text: "Good Sleep" }, { icon: <Battery />, text: "Power" }],
        color: "bg-gradient-to-r from-orange-500 to-red-500"
      },
      {
        id: 2,
        title: "Sleep to Win",
        elements: [{ icon: <Bed />, text: "Calm Bed" }, { icon: <Clock />, text: "Early" }],
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
      setFeedbackMessage("Great sleep poster!");
      setScore(prev => prev + 1);
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
      title="Poster: Sleep Well"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-126"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Poster: Sleep Well</h3>
        <p className="text-white/80 mb-6 text-center">Select a sleep poster.</p>
        
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

export default SleepWellPoster;
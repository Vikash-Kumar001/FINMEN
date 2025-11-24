import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Heart, Apple, Droplet, Zap, Target } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';
import { getBrainKidsGames } from '../../../Games/GameCategories/Brain/kidGamesData';

const PosterBrainHealth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-6";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  // Find next game path if not provided in location.state
  const nextGamePath = useMemo(() => {
    // First, check if nextGamePath is already in location.state
    if (location.state?.nextGamePath) {
      return location.state.nextGamePath;
    }
    
    // Otherwise, find the next game programmatically
    try {
      const games = getBrainKidsGames({});
      const currentGameIndex = games.findIndex(g => g.id === gameId);
      if (currentGameIndex !== -1 && currentGameIndex < games.length - 1) {
        const nextGame = games[currentGameIndex + 1];
        return nextGame?.path || null;
      }
    } catch (error) {
      console.error('Error finding next game:', error);
    }
    
    return null;
  }, [location.state, gameId]);

  const posters = [
    {
      id: 1,
      title: "Healthy Brain = Happy You",
      description: "A poster showing how brain health leads to happiness",
      elements: [
        { icon: <Brain className="w-8 h-8" />, text: "Think Clearly" },
        { icon: <Heart className="w-8 h-8" />, text: "Feel Good" },
        { icon: <Zap className="w-8 h-8" />, text: "Stay Active" }
      ],
      color: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      id: 2,
      title: "Feed Your Brain",
      description: "A poster showing brain-healthy foods",
      elements: [
        { icon: <Apple className="w-8 h-8" />, text: "Eat Fruits" },
        { icon: <Droplet className="w-8 h-8" />, text: "Drink Water" },
        { icon: <Brain className="w-8 h-8" />, text: "Stay Healthy" }
      ],
      color: "bg-gradient-to-r from-green-400 to-blue-500"
    },
    {
      id: 3,
      title: "Brain Power",
      description: "A poster showing ways to boost brain power",
      elements: [
        { icon: <Target className="w-8 h-8" />, text: "Set Goals" },
        { icon: <Zap className="w-8 h-8" />, text: "Stay Active" },
        { icon: <Brain className="w-8 h-8" />, text: "Learn Daily" }
      ],
      color: "bg-gradient-to-r from-purple-400 to-pink-500"
    },
    {
      id: 4,
      title: "My Brain Health Plan",
      description: "Create your own brain health poster",
      elements: [
        { icon: <Droplet className="w-8 h-8" />, text: "Stay Hydrated" },
        { icon: <Apple className="w-8 h-8" />, text: "Eat Healthy" },
        { icon: <Target className="w-8 h-8" />, text: "Exercise Daily" }
      ],
      color: "bg-gradient-to-r from-yellow-400 to-red-500"
    }
  ];

  const handlePosterSelect = (poster) => {
    if (!isSubmitted && !levelCompleted) {
      setSelectedPoster(poster);
    }
  };

  const handleSubmit = () => {
    if (selectedPoster) {
      setIsSubmitted(true);
      setScore(1); // 1 coin for completing the activity
      
      // Auto-complete after delay
      setTimeout(() => {
        setLevelCompleted(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    // This is a single-level game, so completing it moves to the next game
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Brain Health Poster"
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-6"
      gameType="brain"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={levelCompleted}
      nextLabel="Complete"
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
      maxScore={1} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Brain Health Poster</h3>
        <p className="text-white/80 mb-8 text-center">Create or select a poster that shows how to keep your brain healthy</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {posters.map((poster) => (
            <div
              key={poster.id}
              onClick={() => handlePosterSelect(poster)}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                selectedPoster?.id === poster.id
                  ? 'border-blue-400 ring-2 ring-blue-200 bg-blue-500/10'
                  : 'border-white/20 hover:border-blue-300/50'
              }`}
            >
              <div className={`rounded-lg p-4 mb-4 ${poster.color}`}>
                <h4 className="text-white font-bold text-center text-lg">{poster.title}</h4>
              </div>
              <p className="text-white/70 text-sm mb-4">{poster.description}</p>
              
              <div className="space-y-3">
                {poster.elements.map((element, index) => (
                  <div key={index} className="flex items-center">
                    <div className="text-blue-400 mr-3">
                      {element.icon}
                    </div>
                    <span className="text-white/90">{element.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedPoster || isSubmitted || levelCompleted}
            className={`px-8 py-3 rounded-lg font-medium transition duration-200 ${
              selectedPoster && !isSubmitted && !levelCompleted
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitted ? 'Submitted!' : 'Submit My Choice'}
          </button>
        </div>
        
        {isSubmitted && (
          <FeedbackBubble 
            message="Great choice! This poster shows excellent brain health principles. 🎉"
            type="correct"
          />
        )}
      </GameCard>
    </GameShell>
  );
};

export default PosterBrainHealth;


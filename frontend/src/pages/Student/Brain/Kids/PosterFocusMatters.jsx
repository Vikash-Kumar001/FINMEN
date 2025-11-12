import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { Zap, VolumeX, Brain, Target, Eye } from 'lucide-react';

const PosterFocusMatters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const posters = [
    {
      id: 1,
      title: "Focus = Power",
      description: "A poster showing how focus leads to success",
      elements: [
        { icon: <Zap className="w-8 h-8" />, text: "Concentrate" },
        { icon: <Target className="w-8 h-8" />, text: "Achieve Goals" },
        { icon: <Brain className="w-8 h-8" />, text: "Learn Better" }
      ],
      color: "bg-gradient-to-r from-blue-400 to-purple-500"
    },
    {
      id: 2,
      title: "Power of Focus",
      description: "A poster showing focus-building techniques",
      elements: [
        { icon: <Eye className="w-8 h-8" />, text: "Stay Alert" },
        { icon: <VolumeX className="w-8 h-8" />, text: "Minimize Noise" },
        { icon: <Brain className="w-8 h-8" />, text: "Think Clearly" }
      ],
      color: "bg-gradient-to-r from-green-400 to-blue-500"
    },
    {
      id: 3,
      title: "Focused Mind",
      description: "A poster showing benefits of focus",
      elements: [
        { icon: <Zap className="w-8 h-8" />, text: "Quick Learning" },
        { icon: <Target className="w-8 h-8" />, text: "Better Results" },
        { icon: <Brain className="w-8 h-8" />, text: "Clear Thinking" }
      ],
      color: "bg-gradient-to-r from-purple-400 to-pink-500"
    },
    {
      id: 4,
      title: "My Focus Plan",
      description: "Create your own focus poster",
      elements: [
        { icon: <Eye className="w-8 h-8" />, text: "Eliminate Distractions" },
        { icon: <Zap className="w-8 h-8" />, text: "Stay Consistent" },
        { icon: <Target className="w-8 h-8" />, text: "Reach Goals" }
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
      setScore(15); // 15 coins for completing the activity (max allowed)
      
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

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Focus Matters Poster"
      score={score}
      currentLevel={1}
      totalLevels={1}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-16"
      gameType="brain-health"
      showGameOver={levelCompleted}
      onNext={handleNext}
      nextEnabled={levelCompleted}
      nextLabel="Complete"
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Focus Matters Poster</h3>
        <p className="text-white/80 mb-8 text-center">Create or select a poster that shows why focus is important</p>
        
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
            message="Great choice! This poster shows excellent focus principles. 🎉"
            type="correct"
          />
        )}
      </GameCard>
    </GameShell>
  );
};

export default PosterFocusMatters;
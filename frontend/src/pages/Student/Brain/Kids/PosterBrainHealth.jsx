import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Moon, Apple, Book, Dumbbell, Zap } from 'lucide-react';

const PosterBrainHealth = () => {
  const navigate = useNavigate();
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const posters = [
    {
      id: 1,
      title: "Eat, Sleep, Think Well",
      description: "A poster showing the three pillars of brain health",
      elements: [
        { icon: <Apple className="w-8 h-8" />, text: "Eat Healthy" },
        { icon: <Moon className="w-8 h-8" />, text: "Sleep Well" },
        { icon: <Brain className="w-8 h-8" />, text: "Think Well" }
      ],
      color: "bg-gradient-to-r from-green-500 to-blue-500"
    },
    {
      id: 2,
      title: "Fuel Your Brain",
      description: "A poster showing brain-healthy foods",
      elements: [
        { icon: <Apple className="w-8 h-8" />, text: "Fruits & Veggies" },
        { icon: <Book className="w-8 h-8" />, text: "Learn Daily" },
        { icon: <Dumbbell className="w-8 h-8" />, text: "Stay Active" }
      ],
      color: "bg-gradient-to-r from-yellow-500 to-red-500"
    },
    {
      id: 3,
      title: "Brain Power Habits",
      description: "A poster showing daily brain-boosting habits",
      elements: [
        { icon: <Moon className="w-8 h-8" />, text: "8 Hours Sleep" },
        { icon: <Zap className="w-8 h-8" />, text: "Stay Hydrated" },
        { icon: <Brain className="w-8 h-8" />, text: "Mindfulness" }
      ],
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      id: 4,
      title: "My Brain Care Plan",
      description: "Create your own brain care poster",
      elements: [
        { icon: <Book className="w-8 h-8" />, text: "Read Books" },
        { icon: <Dumbbell className="w-8 h-8" />, text: "Play Outside" },
        { icon: <Zap className="w-8 h-8" />, text: "Drink Water" }
      ],
      color: "bg-gradient-to-r from-blue-500 to-green-500"
    }
  ];

  const handlePosterSelect = (poster) => {
    if (!isSubmitted) {
      setSelectedPoster(poster);
    }
  };

  const handleSubmit = () => {
    if (selectedPoster) {
      setIsSubmitted(true);
      setFeedbackType("correct");
      setFeedbackMessage("Great choice! This poster shows excellent brain care habits.");
      setShowFeedback(true);
      setScore(15); // 15 coins for creative activity (max allowed)
      setLevelCompleted(true);
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Please select a poster first!");
      setShowFeedback(true);
      
      // Hide feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Brain Health Poster"
      score={score}
      currentLevel={1}
      totalLevels={1}
      gameId="poster-brain-health"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Brain Health Poster</h3>
        <p className="text-white/80 mb-6 text-center">Create or select a poster that shows how to keep your brain healthy</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <h4 className="text-xl font-semibold mb-4 text-white text-center">Choose Your Favorite Poster</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posters.map((poster) => (
              <div
                key={poster.id}
                onClick={() => handlePosterSelect(poster)}
                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPoster?.id === poster.id
                    ? 'border-white ring-2 ring-white/30 bg-white/20'
                    : 'border-white/30 hover:border-white/50 bg-white/10'
                }`}
              >
                <div className={`rounded-lg p-4 mb-4 ${poster.color}`}>
                  <h5 className="text-white font-bold text-center">{poster.title}</h5>
                </div>
                <p className="text-white/80 text-sm mb-4">{poster.description}</p>
                
                <div className="space-y-3">
                  {poster.elements.map((element, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-white mr-3">
                        {element.icon}
                      </div>
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
              {isSubmitted ? 'Poster Submitted!' : 'Submit My Choice'}
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

export default PosterBrainHealth;
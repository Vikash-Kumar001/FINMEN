// File: FeelingsMatterPoster.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Smile, Frown, Zap, Heart } from 'lucide-react';

const FeelingsMatterPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
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
        title: "It’s Okay to Feel",
        elements: [{ icon: <Smile />, text: "Happy" }, { icon: <Frown />, text: "Sad" }],
        color: "bg-gradient-to-r from-blue-500 to-green-500"
      },
      {
        id: 2,
        title: "Feelings Are Okay",
        elements: [{ icon: <Zap />, text: "Angry" }, { icon: <Heart />, text: "Love" }],
        color: "bg-gradient-to-r from-red-500 to-yellow-500"
      }
    ],
    [
      {
        id: 1,
        title: "Emotions Matter",
        elements: [{ icon: <Smile />, text: "Joy" }, { icon: <Frown />, text: "Sadness" }],
        color: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        id: 2,
        title: "Feel It All",
        elements: [{ icon: <Zap />, text: "Anger" }, { icon: <Heart />, text: "Care" }],
        color: "bg-gradient-to-r from-green-500 to-blue-500"
      }
    ],
    [
      {
        id: 1,
        title: "Feelings Are Real",
        elements: [{ icon: <Smile />, text: "Happy" }, { icon: <Frown />, text: "Tears" }],
        color: "bg-gradient-to-r from-yellow-500 to-orange-500"
      },
      {
        id: 2,
        title: "Emotions Are Fine",
        elements: [{ icon: <Zap />, text: "Mad" }, { icon: <Heart />, text: "Kind" }],
        color: "bg-gradient-to-r from-blue-500 to-purple-500"
      }
    ],
    [
      {
        id: 1,
        title: "Feel Your Way",
        elements: [{ icon: <Smile />, text: "Smile" }, { icon: <Frown />, text: "Cry" }],
        color: "bg-gradient-to-r from-pink-500 to-red-500"
      },
      {
        id: 2,
        title: "All Feelings Okay",
        elements: [{ icon: <Zap />, text: "Frustrated" }, { icon: <Heart />, text: "Loved" }],
        color: "bg-gradient-to-r from-green-500 to-yellow-500"
      }
    ],
    [
      {
        id: 1,
        title: "Embrace Emotions",
        elements: [{ icon: <Smile />, text: "Cheer" }, { icon: <Frown />, text: "Gloomy" }],
        color: "bg-gradient-to-r from-orange-500 to-red-500"
      },
      {
        id: 2,
        title: "Feelings Are Good",
        elements: [{ icon: <Zap />, text: "Upset" }, { icon: <Heart />, text: "Warm" }],
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
      setScore(prev => prev + 5);
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
      title="Poster: Feelings Matter"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-86"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Poster: Feelings Matter</h3>
        <p className="text-white/80 mb-6 text-center">Select a poster about feelings.</p>
        
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

export default FeelingsMatterPoster;
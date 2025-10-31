import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Monitor, Clock, TreePine, Goal, Book, Bike, Paintbrush } from 'lucide-react';

const BalanceTechPoster = () => {
  const navigate = useNavigate();
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
        title: "Screens in Balance",
        elements: [{ icon: <Monitor />, text: "1 hr Limit" }, { icon: <TreePine />, text: "Outdoor Play" }],
        color: "bg-gradient-to-r from-blue-500 to-green-500"
      },
      {
        id: 2,
        title: "Tech and Fun",
        elements: [{ icon: <Clock />, text: "Time Control" }, { icon: <Book />, text: "Read Time" }],
        color: "bg-gradient-to-r from-yellow-500 to-orange-500"
      }
    ],
    [
      {
        id: 1,
        title: "Balance Your Day",
        elements: [{ icon: <Monitor />, text: "Short Screen" }, { icon: <TreePine />, text: "Nature Time" }],
        color: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        id: 2,
        title: "Smart Tech Use",
        elements: [{ icon: <Clock />, text: "Set Limits" }, { icon: <Bike />, text: "Ride Outside" }],
        color: "bg-gradient-to-r from-green-500 to-teal-500"
      }
    ],
    [
      {
        id: 1,
        title: "Tech in Check",
        elements: [{ icon: <Monitor />, text: "Less Screen" }, { icon: <TreePine />, text: "Play Outside" }],
        color: "bg-gradient-to-r from-orange-500 to-red-500"
      },
      {
        id: 2,
        title: "Balanced Life",
  elements: [{ icon: <Clock />, text: "Time Manage" }, { icon: <Goal />, text: "Sports Fun" }],
        color: "bg-gradient-to-r from-blue-500 to-purple-500"
      }
    ],
    [
      {
        id: 1,
        title: "Screen Smart",
        elements: [{ icon: <Monitor />, text: "Short Use" }, { icon: <TreePine />, text: "Explore Out" }],
        color: "bg-gradient-to-r from-teal-500 to-blue-500"
      },
      {
        id: 2,
        title: "Live Balanced",
        elements: [{ icon: <Clock />, text: "Screen Break" }, { icon: <Paintbrush />, text: "Art Time" }],
        color: "bg-gradient-to-r from-pink-500 to-red-500"
      }
    ],
    [
      {
        id: 1,
        title: "Tech Harmony",
        elements: [{ icon: <Monitor />, text: "Limit Use" }, { icon: <TreePine />, text: "Outdoor Fun" }],
        color: "bg-gradient-to-r from-green-500 to-yellow-500"
      },
      {
        id: 2,
        title: "Smart Balance",
        elements: [{ icon: <Clock />, text: "Time Wise" }, { icon: <Book />, text: "Study First" }],
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
      setFeedbackMessage("Awesome balanced poster!");
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
      title="Poster: Balance Tech"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      gameId="brain-kids-146"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Poster: Balance Tech</h3>
        <p className="text-white/80 mb-6 text-center">Select a balanced tech poster.</p>
        
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

export default BalanceTechPoster;
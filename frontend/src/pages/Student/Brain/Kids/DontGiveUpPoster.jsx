import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Rocket, RefreshCw, ArrowUp } from 'lucide-react';

const DontGiveUpPoster = () => {
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
        title: "Failure = Step to Success",
        elements: [{ icon: <Rocket />, text: "Keep Going" }, { icon: <RefreshCw />, text: "Try Again" }],
        color: "bg-gradient-to-r from-blue-500 to-green-500"
      },
      {
        id: 2,
        title: "Never Stop Trying",
        elements: [{ icon: <Brain />, text: "Learn More" }, { icon: <ArrowUp />, text: "Rise Up" }],
        color: "bg-gradient-to-r from-yellow-500 to-orange-500"
      }
    ],
    [
      {
        id: 1,
        title: "Bounce Back Strong",
        elements: [{ icon: <Rocket />, text: "Push Forward" }, { icon: <RefreshCw />, text: "Retry" }],
        color: "bg-gradient-to-r from-purple-500 to-pink-500"
      },
      {
        id: 2,
        title: "Keep Moving Up",
        elements: [{ icon: <Brain />, text: "Grow Strong" }, { icon: <ArrowUp />, text: "Get Up" }],
        color: "bg-gradient-to-r from-green-500 to-teal-500"
      }
    ],
    [
      {
        id: 1,
        title: "Rise After Fall",
        elements: [{ icon: <Rocket />, text: "Stay Resilient" }, { icon: <RefreshCw />, text: "Try Harder" }],
        color: "bg-gradient-to-r from-orange-500 to-red-500"
      },
      {
        id: 2,
        title: "Never Give Up",
        elements: [{ icon: <Brain />, text: "Keep Learning" }, { icon: <ArrowUp />, text: "Bounce Back" }],
        color: "bg-gradient-to-r from-blue-500 to-purple-500"
      }
    ],
    [
      {
        id: 1,
        title: "Try Until You Win",
        elements: [{ icon: <Rocket />, text: "Keep At It" }, { icon: <RefreshCw />, text: "Start Over" }],
        color: "bg-gradient-to-r from-teal-500 to-blue-500"
      },
      {
        id: 2,
        title: "Resilient Mind",
        elements: [{ icon: <Brain />, text: "Learn Always" }, { icon: <ArrowUp />, text: "Rise Again" }],
        color: "bg-gradient-to-r from-pink-500 to-red-500"
      }
    ],
    [
      {
        id: 1,
        title: "Stronger Each Try",
        elements: [{ icon: <Rocket />, text: "Push On" }, { icon: <RefreshCw />, text: "Try Again" }],
        color: "bg-gradient-to-r from-green-500 to-yellow-500"
      },
      {
        id: 2,
        title: "Resilience Wins",
        elements: [{ icon: <Brain />, text: "Stay Strong" }, { icon: <ArrowUp />, text: "Keep Rising" }],
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
      setFeedbackMessage("Awesome resilient poster!");
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
      title="Poster: Don’t Give Up"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-186"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Poster: Don’t Give Up</h3>
        <p className="text-white/80 mb-6 text-center">Select a resilient poster.</p>
        
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

export default DontGiveUpPoster;
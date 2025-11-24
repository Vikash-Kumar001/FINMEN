// File: HomeworkStory.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, BookOpen, Check, X } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const Homework = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-61";
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
      story: "Kid has lots of homework, feels stressed. Best action?",
      choices: ["Do one step at a time", "Ignore it", "Cry"],
      correct: "Do one step at a time",
      icon: <BookOpen className="w-8 h-8" />
    },
    {
      id: 2,
      story: "Too many chores, feeling overwhelmed. What to do?",
      choices: ["Start with easiest", "Give up", "Complain"],
      correct: "Start with easiest",
      icon: <List className="w-8 h-8" />
    },
    {
      id: 3,
      story: "Big project due soon. Best way?",
      choices: ["Break into small parts", "Do all at once", "Postpone"],
      correct: "Break into small parts",
      icon: <Clipboard className="w-8 h-8" />
    },
    {
      id: 4,
      story: "Many tests coming up. How to handle?",
      choices: ["Study bit by bit", "Panic", "Skip school"],
      correct: "Study bit by bit",
      icon: <Calendar className="w-8 h-8" />
    },
    {
      id: 5,
      story: "Lots of reading assignment. Best action?",
      choices: ["Read one page at a time", "Rush through", "Don't read"],
      correct: "Read one page at a time",
      icon: <Book className="w-8 h-8" />
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
        setFeedbackMessage("Great choice! That's the way.");
        setScore(prev => prev + 5);
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
        setFeedbackMessage("Try again!");
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setIsSubmitted(false);
        }, 2000);
      }
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Please select a choice!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Homework Story"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-61"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Homework Story</h3>
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

export default Homework;
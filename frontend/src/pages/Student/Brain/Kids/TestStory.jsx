import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, BookOpenCheck, Check, X, Calculator, FlaskConical, Paintbrush, Book } from 'lucide-react';

const TestStory = () => {
  const navigate = useNavigate();
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
      story: "Kid fails spelling test. Best response?",
      choices: ["Study and try again", "Give up", "Blame teacher"],
      correct: "Study and try again",
      icon: <BookOpenCheck className="w-8 h-8" />
    },
    {
      id: 2,
      story: "Kid fails math quiz. Best action?",
      choices: ["Practice more", "Stop studying", "Cheat next time"],
      correct: "Practice more",
      icon: <Calculator className="w-8 h-8" />
    },
    {
      id: 3,
      story: "Kid misses science project deadline. Next?",
      choices: ["Ask for extension", "Quit project", "Ignore it"],
      correct: "Ask for extension",
      icon: <FlaskConical className="w-8 h-8" />
    },
    {
      id: 4,
      story: "Kid fails history test. Best step?",
      choices: ["Review and retry", "Skip studying", "Complain"],
      correct: "Review and retry",
      icon: <Book className="w-8 h-8" />
    },
    {
      id: 5,
      story: "Kid struggles in art class. Best choice?",
      choices: ["Keep practicing", "Stop trying", "Blame materials"],
      correct: "Keep practicing",
      icon: <Paintbrush className="w-8 h-8" />
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
        setFeedbackMessage("Resilient choice!");
        setScore(prev => prev + 5);
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("Bounce back! Try again.");
        // No points for wrong answers
      }
      setShowFeedback(true);
      
      // Always move to the next question after a short delay, regardless of correct/incorrect
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
      title="Test Story"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      gameId="brain-kids-185"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    >
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Test Story</h3>
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

export default TestStory;
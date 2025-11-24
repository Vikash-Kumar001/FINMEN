// File: ShoppingListStory.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';
import { 
  Brain, 
  ShoppingCart, 
  Check, 
  X, 
  Apple, 
  Milk, 
  Wheat, 
  Egg, 
  GlassWater, 
  Book, 
  Pen, 
  Eraser, 
  Ruler, 
  Backpack, 
  Circle, 
  Dog, 
  Cat, 
  Bird, 
  Fish, 
  Rabbit, 
  Mouse 
} from 'lucide-react';

const ShoppingListStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-41";
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
      story: "Mom gives you 3 items to buy: Apple, Milk, Bread. You forget 2. Is this good memory?",
      choices: ["Yes", "No"],
      correct: "No",
      items: [<Apple className="w-8 h-8" />, <Milk className="w-8 h-8" />, <Wheat className="w-8 h-8" />]
    },
    {
      id: 2,
      story: "Dad asks for 4 things: Eggs, Juice, Cheese, Banana. You remember only 1. Good memory?",
      choices: ["Yes", "No"],
      correct: "No",
      items: [<Egg className="w-8 h-8" />, <GlassWater className="w-8 h-8" />, <Circle className="w-8 h-8" fill="currentColor" />, <Circle className="w-8 h-8" />]
    },
    {
      id: 3,
      story: "Teacher gives 5 words: Book, Pen, Eraser, Ruler, Bag. You recall all. Good memory?",
      choices: ["Yes", "No"],
      correct: "Yes",
      items: [<Book className="w-8 h-8" />, <Pen className="w-8 h-8" />, <Eraser className="w-8 h-8" />, <Ruler className="w-8 h-8" />, <Backpack className="w-8 h-8" />]
    },
    {
      id: 4,
      story: "Friend lists 6 colors: Red, Blue, Green, Yellow, Purple, Orange. You forget 3. Good memory?",
      choices: ["Yes", "No"],
      correct: "No",
      items: [<Circle className="w-8 h-8 text-red-500" />, <Circle className="w-8 h-8 text-blue-500" />, <Circle className="w-8 h-8 text-green-500" />, <Circle className="w-8 h-8 text-yellow-500" />, <Circle className="w-8 h-8 text-purple-500" />, <Circle className="w-8 h-8 text-orange-500" />]
    },
    {
      id: 5,
      story: "You make a list of 7 animals: Dog, Cat, Bird, Fish, Lion, Elephant, Monkey. You remember all after practice. Good memory?",
      choices: ["Yes", "No"],
      correct: "Yes",
      items: [<Dog className="w-8 h-8" />, <Cat className="w-8 h-8" />, <Bird className="w-8 h-8" />, <Fish className="w-8 h-8" />, <Rabbit className="w-8 h-8" />, <Rabbit className="w-8 h-8" />, <Mouse className="w-8 h-8" />]
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
        setFeedbackMessage("Great job! That's right.");
        setScore(prev => prev + 1);
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
        setFeedbackMessage("Oops! Try again.");
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
      title="Shopping List Story"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-41"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Shopping List Story</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.story}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center space-x-4 mb-4">
            {currentLevelData.items.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {currentLevelData.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(choice)}
                className={`p-4 rounded-lg ${selectedChoice === choice ? 'bg-blue-500' : 'bg-white/20'} text-white`}
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

export default ShoppingListStory;
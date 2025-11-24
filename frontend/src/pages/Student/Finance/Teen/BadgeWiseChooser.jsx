import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, ShoppingCart, Home, Car, GraduationCap, Heart, Utensils, Phone, Gamepad2, Watch, Laptop, Shirt, Plane, Dumbbell, Music, Camera } from "lucide-react";
import GameShell from "../GameShell";
import { useGameFeedback } from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeWiseChooser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-80";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [gameState, setGameState] = useState('intro'); // intro, challenge, completed
  const [currentDilemma, setCurrentDilemma] = useState(0);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  // Needs vs Wants dilemmas
  const dilemmas = [
    {
      id: 1,
      scenario: "You're planning your back-to-school shopping",
      choices: [
        { id: 1, name: "Basic school supplies (pens, notebooks)", type: "need", icon: GraduationCap, cost: 30 },
        { id: 2, name: "Designer backpack and trendy accessories", type: "want", icon: ShoppingCart, cost: 150 }
      ],
      correct: 1,
      explanation: "Basic school supplies are essential for education, while designer items are wants that enhance appearance."
    },
    {
      id: 2,
      scenario: "Your phone is several years old and slow",
      choices: [
        { id: 1, name: "Basic phone for calls and messages", type: "need", icon: Phone, cost: 100 },
        { id: 2, name: "Latest smartphone with all features", type: "want", icon: Phone, cost: 800 }
      ],
      correct: 1,
      explanation: "A basic phone for communication is a need, while premium features are wants."
    },
    {
      id: 3,
      scenario: "You want to stay fit and healthy",
      choices: [
        { id: 1, name: "Gym membership for regular exercise", type: "need", icon: Dumbbell, cost: 30 },
        { id: 2, name: "Expensive fitness tracker and smartwatch", type: "want", icon: Watch, cost: 300 }
      ],
      correct: 1,
      explanation: "Regular exercise is essential for health, while gadgets are wants that may motivate but aren't necessary."
    },
    {
      id: 4,
      scenario: "You're preparing for an important exam",
      choices: [
        { id: 1, name: "Quiet study space and textbooks", type: "need", icon: GraduationCap, cost: 80 },
        { id: 2, name: "Noise-canceling headphones and premium desk setup", type: "want", icon: Music, cost: 400 }
      ],
      correct: 1,
      explanation: "A study space and materials are essential for learning, while premium equipment is a want."
    },
    {
      id: 5,
      scenario: "You want to capture memories with friends",
      choices: [
        { id: 1, name: "Basic camera or phone for photos", type: "need", icon: Camera, cost: 150 },
        { id: 2, name: "Professional DSLR camera with multiple lenses", type: "want", icon: Camera, cost: 1500 }
      ],
      correct: 1,
      explanation: "A basic device to capture memories is a need, while professional equipment is a want for enthusiasts."
    },
    {
      id: 6,
      scenario: "You need clothing for school and daily activities",
      choices: [
        { id: 1, name: "Essential clothing for school and weather", type: "need", icon: Shirt, cost: 100 },
        { id: 2, name: "Designer clothes and trendy fashion items", type: "want", icon: Shirt, cost: 500 }
      ],
      correct: 1,
      explanation: "Clothing appropriate for weather and school is a need, while designer items are wants for style."
    },
    {
      id: 7,
      scenario: "You want to eat healthy meals",
      choices: [
        { id: 1, name: "Nutritious food for daily meals", type: "need", icon: Utensils, cost: 200 },
        { id: 2, name: "Gourmet ingredients and restaurant dining", type: "want", icon: Utensils, cost: 600 }
      ],
      correct: 1,
      explanation: "Nutritious food for sustenance is a need, while gourmet options are wants for taste experience."
    },
    {
      id: 8,
      scenario: "You're planning a family vacation",
      choices: [
        { id: 1, name: "Budget-friendly destination within driving distance", type: "need", icon: Home, cost: 300 },
        { id: 2, name: "Luxury resort in an exotic international location", type: "want", icon: Plane, cost: 3000 }
      ],
      correct: 1,
      explanation: "A reasonable family trip is a need for bonding, while luxury international travel is a want."
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'challenge' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'challenge' && selectedChoice === null) {
      // Time's up, auto-select the need option
      handleChoiceSelect(dilemmas[currentDilemma].choices[0]);
    }
  }, [gameState, timeLeft, selectedChoice]);

  const startGame = () => {
    setGameState('challenge');
    setCurrentDilemma(0);
    setScore(0);
    setTotalScore(0);
    setTimeLeft(20);
    setSelectedChoice(null);
    setStreak(0);
    setMultiplier(1);
  };

  const handleChoiceSelect = (choice) => {
    if (gameState !== 'challenge' || selectedChoice !== null) return;
    
    resetFeedback();
    setSelectedChoice(choice);
    
    const isCorrect = choice.type === "need";
    
    if (isCorrect) {
      const points = 20 * multiplier;
      setScore(score + points);
      setTotalScore(totalScore + points);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Update multiplier based on streak
      if (newStreak >= 5) {
        setMultiplier(3);
      } else if (newStreak >= 3) {
        setMultiplier(2);
      }
      
      showCorrectAnswerFeedback(points, true);
      setFeedbackMessage(`Correct! +${points} points. Streak: ${newStreak}x`);
      setIsSuccess(true);
    } else {
      setStreak(0);
      setMultiplier(1);
      setFeedbackMessage("That's a want, not a need. Streak reset!");
      setIsSuccess(false);
    }
    
    // Move to next dilemma or complete game
    setTimeout(() => {
      if (currentDilemma < dilemmas.length - 1) {
        setCurrentDilemma(currentDilemma + 1);
        setScore(0);
        setTimeLeft(20);
        setSelectedChoice(null);
        setFeedbackMessage('');
      } else {
        setGameState('completed');
        setFeedbackMessage(`Game complete! Total score: ${totalScore + (isCorrect ? 20 * multiplier : 0)}`);
        setIsSuccess(true);
      }
    }, 2500);
  };

  const getTypeColor = (type) => {
    return type === "need" 
      ? "bg-green-500/20 border-green-400 text-green-300" 
      : "bg-red-500/20 border-red-400 text-red-300";
  };

  const getTypeLabel = (type) => {
    return type === "need" ? "Need" : "Want";
  };

  return (
    <GameShell
      gameId="finance-teens-80"
      gameType="achievement"
      totalLevels={dilemmas.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={currentDilemma + 1}
      score={totalScore}
      totalScore={800} // Max possible score
      maxScore={dilemmas.length} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      onGameComplete={() => navigate("/games/financial-literacy/teen")}
    >
      <div className="text-center text-white space-y-6">
        <h3 className="text-3xl font-bold mb-4">Wise Chooser Challenge</h3>
        
        {gameState === 'intro' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4" />
            <h4 className="text-2xl font-bold mb-4">Become a Wise Chooser!</h4>
            <p className="text-white/90 text-lg mb-6">
              Test your ability to distinguish between needs and wants in 8 real-life dilemmas
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200">
                For each scenario, choose the option that represents a true need rather than a want. 
                Build streaks for bonus points!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="font-bold text-green-300">Need</div>
                <div className="text-sm text-white/80">Essential for survival, health, education</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3">
                <div className="font-bold text-red-300">Want</div>
                <div className="text-sm text-white/80">Desirable but not essential</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Wise Choice Challenge
            </button>
          </div>
        )}
        
        {gameState === 'challenge' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <h4 className="text-xl font-bold">Dilemma {currentDilemma + 1}</h4>
                <p className="text-white/80">{dilemmas[currentDilemma].scenario}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">Streak: {streak}x</div>
                {multiplier > 1 && (
                  <div className="text-md font-semibold text-orange-400">Multiplier: {multiplier}x</div>
                )}
                <div className="text-lg font-semibold text-red-400">{timeLeft}s</div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-blue-200 text-sm">
                <span className="font-bold">Tip:</span> Needs are essential for survival, health, safety, and education. 
                Wants are things we desire but can live without.
              </p>
            </div>
            
            {feedbackMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                isSuccess ? 'bg-green-500/30 text-green-200 border border-green-400' : 'bg-red-500/30 text-red-200 border border-red-400'
              }`}>
                {feedbackMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {dilemmas[currentDilemma].choices.map((choice) => {
                const IconComponent = choice.icon;
                const isSelected = selectedChoice && selectedChoice.id === choice.id;
                const isRevealed = selectedChoice !== null;
                const isCorrectChoice = choice.type === "need";
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={selectedChoice !== null}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      isRevealed
                        ? (isCorrectChoice
                            ? 'bg-green-500/30 border-green-400'
                            : 'bg-red-500/30 border-red-400')
                        : (isSelected
                            ? 'bg-blue-500/30 border-blue-400 transform scale-[1.02]'
                            : 'bg-white/5 hover:bg-white/10 border-white/30')
                    } ${selectedChoice === null ? 'hover:shadow-lg cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <IconComponent className="w-6 h-6 mr-3 text-white" />
                        <div className="font-bold">{choice.name}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(choice.type)}`}>
                        {getTypeLabel(choice.type)}
                      </span>
                    </div>
                    <div className="text-right text-sm text-white/70">${choice.cost}</div>
                    
                    {isRevealed && (
                      <div className="mt-2 text-sm">
                        {isCorrectChoice ? (
                          <span className="text-green-300">✓ This is a need</span>
                        ) : (
                          <span className="text-red-300">✗ This is a want</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {selectedChoice && (
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400">
                <p className="font-bold text-yellow-200 mb-1">Explanation:</p>
                <p className="text-yellow-100">{dilemmas[currentDilemma].explanation}</p>
              </div>
            )}
          </div>
        )}
        
        {gameState === 'completed' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <Trophy className="mx-auto w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
            <h4 className="text-2xl font-bold mb-4">Wise Chooser Achieved!</h4>
            <p className="text-white/90 text-lg mb-6">Congratulations on mastering needs vs wants!</p>
            
            <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-xl p-6 mb-6 border-2 border-yellow-400">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalScore} Points</div>
              <p className="text-white/90">
                {totalScore >= 700 ? "🏆 Financial Wisdom Master!" : 
                 totalScore >= 500 ? "🥇 Smart Decision Maker!" : 
                 totalScore >= 300 ? "🥈 Thoughtful Chooser!" : 
                 "🥉 Keep Learning!"}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/20 rounded-lg p-3">
                <Heart className="mx-auto w-8 h-8 text-green-400 mb-2" />
                <div className="font-bold">{dilemmas.length}</div>
                <div className="text-xs text-white/80">Dilemmas</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-3">
                <GraduationCap className="mx-auto w-8 h-8 text-blue-400 mb-2" />
                <div className="font-bold">{streak}</div>
                <div className="text-xs text-white/80">Best Streak</div>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3">
                <Trophy className="mx-auto w-8 h-8 text-purple-400 mb-2" />
                <div className="font-bold">{multiplier}x</div>
                <div className="text-xs text-white/80">Max Multiplier</div>
              </div>
            </div>
            
            <p className="text-white/80 mb-6">
              Lesson: Wise choices prioritize needs over wants for financial health!
            </p>
            
            <button
              onClick={() => navigate("/games/financial-literacy/teen")}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Continue Financial Journey
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeWiseChooser;
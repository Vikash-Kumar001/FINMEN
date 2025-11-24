import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, FeedbackBubble } from '../../Finance/GameShell';
import { Brain, Lightbulb, Check, X, Users, Wrench, Sparkles } from 'lucide-react';
import { getGameDataById } from '../../../../utils/getGameData';

const CreativityQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-82";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const levels = [
    {
      id: 1,
      question: "Which is problem solving? (a) Crying, (b) Finding another way, (c) Giving up",
      options: ["(a) Crying", "(b) Finding another way", "(c) Giving up"],
      correct: "(b) Finding another way",
      icon: <Lightbulb className="w-8 h-8" />
    },
    {
      id: 2,
      question: "Creative thinking is? (a) Copying, (b) New ideas, (c) Waiting",
      options: ["(a) Copying", "(b) New ideas", "(c) Waiting"],
      correct: "(b) New ideas",
      icon: <Brain className="w-8 h-8" />
    },
    {
      id: 3,
      question: "Best for solving issues? (a) Asking for help, (b) Ignoring, (c) Blaming",
      options: ["(a) Asking for help", "(b) Ignoring", "(c) Blaming"],
      correct: "(a) Asking for help",
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 4,
      question: "Stuck on a task? Best is? (a) Try new way, (b) Quit, (c) Complain",
      options: ["(a) Try new way", "(b) Quit", "(c) Complain"],
      correct: "(a) Try new way",
      icon: <Wrench className="w-8 h-8" />
    },
    {
      id: 5,
      question: "Creative solution means? (a) Same old, (b) Unique fix, (c) Do nothing",
      options: ["(a) Same old", "(b) Unique fix", "(c) Do nothing"],
      correct: "(b) Unique fix",
      icon: <Sparkles className="w-8 h-8" />
    }
  ];

  const currentLevelData = levels[currentLevel - 1];

  const handleAnswerSelect = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
      if (selectedAnswer === currentLevelData.correct) {
        setFeedbackType("correct");
        setFeedbackMessage("Correct! Creative thinking!");
        setScore(prev => prev + 1);
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setSelectedAnswer(null);
            setIsSubmitted(false);
          } else {
            setLevelCompleted(true);
          }
        }, 2000);
      } else {
        setFeedbackType("wrong");
        setFeedbackMessage("Think creatively! Try again.");
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
          setIsSubmitted(false);
        }, 2000);
      }
    } else {
      setFeedbackType("wrong");
      setFeedbackMessage("Select an answer!");
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/kids');
  };

  return (
    <GameShell
      title="Quiz on Creativity"
      score={score}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      gameId="brain-kids-162"
      gameType="brain-health"
      showGameOver={levelCompleted}
      backPath="/games/brain-health/kids"
    
      maxScore={5} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Quiz on Creativity</h3>
        <p className="text-white/80 mb-6 text-center">{currentLevelData.question}</p>
        
        <div className="rounded-2xl p-6 mb-6 bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center mb-4">{currentLevelData.icon}</div>
          <div className="space-y-4">
            {currentLevelData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-lg ${selectedAnswer === option ? 'bg-blue-500' : 'bg-white/20'} text-white text-left`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || isSubmitted}
              className={`px-8 py-3 rounded-full font-bold transition duration-200 text-lg ${
                selectedAnswer && !isSubmitted
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

export default CreativityQuiz;
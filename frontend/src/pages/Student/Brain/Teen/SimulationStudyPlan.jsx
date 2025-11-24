import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';
import { getGameDataById } from '../../../../utils/getGameData';

const SimulationStudyPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-18";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || 5;
  const totalCoins = gameData?.coins || 5;
  const totalXp = gameData?.xp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      text: "You have 2 hours available for studying. Which environment will help you focus best?",
      options: [
        { 
          id: 'quiet', 
          text: 'Quiet study area', 
          description: 'Dedicated study space with no distractions' 
        },
        { 
          id: 'phone', 
          text: 'Phone + book', 
          description: 'Study with phone nearby for breaks' 
        },
        { 
          id: 'tv', 
          text: 'Study with TV on', 
          description: 'Background entertainment while studying' 
        },
        { 
          id: 'bed', 
          text: 'Study in bed', 
          description: 'Comfortable but not ideal for focus' 
        }
      ],
      correct: "quiet",
      explanation: "A quiet study environment without distractions is optimal for concentration and learning. Having your phone nearby significantly reduces focus and retention!"
    },
    {
      id: 2,
      text: "You're feeling overwhelmed with assignments. What's the best approach?",
      options: [
        { 
          id: 'breakdown', 
          text: 'Break tasks into smaller parts', 
          description: 'Create manageable chunks' 
        },
        { 
          id: 'procrastinate', 
          text: 'Procrastinate and do last minute', 
          description: 'Delay work until deadline' 
        },
        { 
          id: 'panic', 
          text: 'Panic and stress out', 
          description: 'Feel anxious about workload' 
        },
        { 
          id: 'ignore', 
          text: 'Ignore some assignments', 
          description: 'Skip difficult tasks' 
        }
      ],
      correct: "breakdown",
      explanation: "Breaking large tasks into smaller, manageable parts reduces overwhelm and makes progress feel achievable. This approach improves motivation and reduces stress!"
    },
    {
      id: 3,
      text: "During exam week, how should you manage your time?",
      options: [
        { 
          id: 'schedule', 
          text: 'Create study schedule', 
          description: 'Plan study sessions in advance' 
        },
        { 
          id: 'cram', 
          text: 'Cram all night before', 
          description: 'Study intensively at last minute' 
        },
        { 
          id: 'random', 
          text: 'Study randomly when you feel like it', 
          description: 'No structured approach' 
        },
        { 
          id: 'skip', 
          text: 'Skip studying and hope for best', 
          description: 'Minimal preparation' 
        }
      ],
      correct: "schedule",
      explanation: "A structured study schedule helps distribute workload evenly, reduces stress, and improves retention. Consistent study habits are more effective than last-minute cramming!"
    },
    {
      id: 4,
      text: "You've been studying for 90 minutes straight. What should you do?",
      options: [
        { 
          id: 'break', 
          text: 'Take a 10-minute break', 
          description: 'Rest to refresh your mind' 
        },
        { 
          id: 'continue', 
          text: 'Keep studying without break', 
          description: 'Push through fatigue' 
        },
        { 
          id: 'quit', 
          text: 'Stop studying for the day', 
          description: 'End session early' 
        },
        { 
          id: 'snack', 
          text: 'Eat sugary snacks for energy', 
          description: 'Quick energy boost' 
        }
      ],
      correct: "break",
      explanation: "Taking regular breaks prevents mental fatigue and maintains focus. The brain needs rest periods to consolidate information and maintain optimal performance!"
    },
    {
      id: 5,
      text: "How should you prepare for a difficult subject?",
      options: [
        { 
          id: 'early', 
          text: 'Start early and review regularly', 
          description: 'Consistent preparation approach' 
        },
        { 
          id: 'avoid', 
          text: 'Avoid and focus on easy subjects', 
          description: 'Skip challenging material' 
        },
        { 
          id: 'intense', 
          text: 'Intense single session', 
          description: 'One long study period' 
        },
        { 
          id: 'copy', 
          text: 'Copy friend\'s notes last minute', 
          description: 'Passive learning approach' 
        }
      ],
      correct: "early",
      explanation: "Starting early with regular review builds strong foundations and reduces anxiety. Spaced repetition and consistent effort are key to mastering difficult subjects!"
    }
  ];

  const currentScenario = questions[currentQuestion];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || levelCompleted) return;
    
    setSelectedOption(optionId);
    const isCorrect = optionId === currentScenario.correct;
    setFeedbackType(isCorrect ? "correct" : "wrong");
    setShowFeedback(true);
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        selected: optionId,
        correct: isCorrect
      }
    }));
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1); // 1 coin for correct answer
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    // Auto-move to next question or complete after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setLevelCompleted(true);
      }
    }, 2000);
  };

  const handleGameComplete = () => {
    navigate('/games/brain-health/teens');
  };

  // Calculate coins based on correct answers (1 coin per question)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 1;
  };

  return (
    <GameShell
      title="Simulation: Study Plan"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="brain"
      showGameOver={levelCompleted}
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/teens"
    >
      {/* Removed LevelCompleteHandler */}
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Study Plan Simulator</h3>
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-2xl p-6 mb-8">
          <p className="text-xl font-semibold text-white text-center">"{currentScenario.text}"</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Choose the best option:</h4>
          {currentScenario.options.map((option) => (
            <div 
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition duration-200 ${
                selectedOption === option.id
                  ? 'bg-white/20 border-white'
                  : levelCompleted
                  ? 'opacity-70 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 border-white/30'
              }`}
            >
              <h5 className="font-bold text-white">{option.text}</h5>
              <p className="text-white/80 text-sm mt-1">{option.description}</p>
            </div>
          ))}
        </div>
        
        {showFeedback && (
          <FeedbackBubble 
            message={feedbackType === "correct" ? "Perfect choice! 🎉" : "Not quite! 🤔"}
            type={feedbackType}
          />
        )}
        
        {showFeedback && feedbackType === "wrong" && (
          <div className="mt-4 text-white/90 text-center">
            <p>💡 {currentScenario.explanation}</p>
          </div>
        )}
      </GameCard>
    </GameShell>
  );
};

export default SimulationStudyPlan;
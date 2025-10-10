import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameShell, { GameCard, OptionButton, FeedbackBubble } from '../../Finance/GameShell';

const SimulationDailyRoutine = () => {
  const navigate = useNavigate();
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
      text: "You have a busy day ahead. Which daily routine will best support your brain health?",
      options: [
        { 
          id: 'both', 
          text: 'Sleep 8 hours and play sport', 
          description: 'Get adequate rest and engage in physical activity' 
        },
        { 
          id: 'sleep', 
          text: 'Sleep 8 hours only', 
          description: 'Focus on rest but skip physical activity' 
        },
        { 
          id: 'sport', 
          text: 'Play sport only', 
          description: 'Stay active but sacrifice sleep' 
        },
        { 
          id: 'junk', 
          text: 'Eat junk food all day', 
          description: 'Poor nutrition choices' 
        }
      ],
      correct: "both",
      explanation: "Both 8 hours of sleep and playing sports are essential for optimal brain function. Sleep helps consolidate memories, while exercise increases blood flow to the brain!"
    },
    {
      id: 2,
      text: "It's 10 PM and you have an exam tomorrow. What's the best approach for your brain?",
      options: [
        { 
          id: 'study', 
          text: 'Study all night', 
          description: 'Cram as much as possible' 
        },
        { 
          id: 'sleep', 
          text: 'Sleep well and review briefly', 
          description: 'Get rest and light review' 
        },
        { 
          id: 'panic', 
          text: 'Panic and stress', 
          description: 'Feel anxious about the exam' 
        },
        { 
          id: 'ignore', 
          text: 'Ignore the exam completely', 
          description: 'Do nothing to prepare' 
        }
      ],
      correct: "sleep",
      explanation: "Adequate sleep is crucial for memory consolidation. Brief review before a good night's sleep is more effective than all-night cramming!"
    },
    {
      id: 3,
      text: "During study breaks, what activity is most beneficial for your brain?",
      options: [
        { 
          id: 'walk', 
          text: 'Take a short walk outdoors', 
          description: 'Get fresh air and movement' 
        },
        { 
          id: 'social', 
          text: 'Scroll social media', 
          description: 'Check notifications and messages' 
        },
        { 
          id: 'snack', 
          text: 'Eat sugary snacks', 
          description: 'Quick energy boost' 
        },
        { 
          id: 'nap', 
          text: 'Take a long nap', 
          description: 'Extended rest period' 
        }
      ],
      correct: "walk",
      explanation: "Short walks increase blood flow to the brain and refresh your mind, making you more focused when you return to studying!"
    },
    {
      id: 4,
      text: "How should you structure your daily study schedule for optimal brain performance?",
      options: [
        { 
          id: 'pomodoro', 
          text: 'Use Pomodoro technique (25 min study, 5 min break)', 
          description: 'Structured work-break intervals' 
        },
        { 
          id: 'marathon', 
          text: 'Study for 4 hours straight', 
          description: 'Long continuous sessions' 
        },
        { 
          id: 'random', 
          text: 'Study randomly throughout the day', 
          description: 'Irregular timing' 
        },
        { 
          id: 'night', 
          text: 'Only study late at night', 
          description: 'Single time period focus' 
        }
      ],
      correct: "pomodoro",
      explanation: "The Pomodoro technique helps maintain focus and prevents mental fatigue by balancing work and rest periods!"
    },
    {
      id: 5,
      text: "What's the best way to start your morning for brain health?",
      options: [
        { 
          id: 'healthy', 
          text: 'Healthy breakfast and light stretching', 
          description: 'Nourish body and activate muscles' 
        },
        { 
          id: 'rush', 
          text: 'Rush out without eating', 
          description: 'Quick start to the day' 
        },
        { 
          id: 'heavy', 
          text: 'Heavy meal and stay in bed', 
          description: 'Large breakfast and minimal movement' 
        },
        { 
          id: 'skip', 
          text: 'Skip breakfast entirely', 
          description: 'No morning meal' 
        }
      ],
      correct: "healthy",
      explanation: "A healthy breakfast provides glucose for brain energy, and light stretching increases blood flow to wake up your brain!"
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
      setScore(prevScore => prevScore + 3); // 3 coins for correct answer (max 15 coins for 5 questions)
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

  // Calculate coins based on correct answers (max 15 coins for 5 questions)
  const calculateTotalCoins = () => {
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    return correctAnswers * 3;
  };

  return (
    <GameShell
      title="Simulation: Daily Routine"
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      gameId="brain-teens-8"
      gameType="brain-health"
      showGameOver={levelCompleted}
      showAnswerConfetti={showConfetti}
      backPath="/games/brain-health/teens"
    >
      {/* Removed LevelCompleteHandler */}
      <GameCard>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Daily Routine Simulator</h3>
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

export default SimulationDailyRoutine;
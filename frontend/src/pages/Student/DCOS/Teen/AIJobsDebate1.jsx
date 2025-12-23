import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIJobsDebate1 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-75";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Will AI take jobs or create new ones?",
      options: [
        { 
          id: "take-jobs", 
          text: "AI will only take jobs", 
          emoji: "🤖", 
          description: "AI will replace all human workers",
          isCorrect: false
        },
        { 
          id: "both-fairness", 
          text: "Both - fairness needed", 
          emoji: "✅", 
          description: "AI will both take and create jobs, but fairness is needed",
          isCorrect: true
        },
        { 
          id: "create-only", 
          text: "AI will only create jobs", 
          emoji: "💼", 
          description: "AI will only create new job opportunities",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should we be worried about AI replacing workers?",
      options: [
        { 
          id: "balance-fair", 
          text: "Balance change with fairness", 
          emoji: "✅", 
          description: "We should balance AI changes with fairness for workers",
          isCorrect: true
        },
        { 
          id: "yes-worried", 
          text: "Yes - AI will replace everyone", 
          emoji: "😰", 
          description: "We should be very worried about AI replacing all workers",
          isCorrect: false
        },
        
        { 
          id: "no-worried", 
          text: "No - nothing to worry about", 
          emoji: "😊", 
          description: "There's nothing to worry about with AI",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "How should we handle AI in the workplace?",
      options: [
        { 
          id: "ban-ai", 
          text: "Ban AI completely", 
          emoji: "🚫", 
          description: "We should ban AI from workplaces",
          isCorrect: false
        },
       
        { 
          id: "use-all", 
          text: "Use AI everywhere without limits", 
          emoji: "🤖", 
          description: "Use AI everywhere without any restrictions",
          isCorrect: false
        },
         { 
          id: "ethical-fair", 
          text: "Use AI ethically and fairly", 
          emoji: "✅", 
          description: "Use AI ethically with fairness for all workers",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What's the best approach to AI and jobs?",
      options: [
        { 
          id: "fear-ai", 
          text: "Fear and resist AI", 
          emoji: "😨", 
          description: "We should fear and resist all AI technology",
          isCorrect: false
        },
        { 
          id: "adapt-fair", 
          text: "Adapt with fairness and ethics", 
          emoji: "✅", 
          description: "Adapt to AI changes while ensuring fairness and ethics",
          isCorrect: true
        },
        { 
          id: "ignore-ai", 
          text: "Ignore AI completely", 
          emoji: "🙈", 
          description: "Just ignore AI and continue as before",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should workers be protected from AI changes?",
      options: [
        { 
          id: "no-protection", 
          text: "No - let AI replace workers", 
          emoji: "🤖", 
          description: "AI should replace workers without protection",
          isCorrect: false
        },
        
        { 
          id: "maybe", 
          text: "Maybe - depends on the job", 
          emoji: "🤔", 
          description: "Protect only certain types of jobs",
          isCorrect: false
        },
        { 
          id: "yes-fair-transition", 
          text: "Yes - ensure fair transition", 
          emoji: "✅", 
          description: "Protect workers and ensure fair transition to AI",
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: AI in Jobs"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default AIJobsDebate1;

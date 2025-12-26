import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const SleepHealthQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-22");
  const gameId = gameData?.id || "dcos-teen-22";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepHealthQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Using mobile at midnight affects sleep. Is this healthy?",
      options: [
        { 
          id: "a", 
          text: "No - screens before bed disrupt sleep", 
          emoji: "❌", 
          description: "Blue light from screens disrupts your sleep cycle and makes it harder to fall asleep",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes - it helps me relax", 
          emoji: "😴", 
          description: "Screens before bed actually disrupt sleep, not help you relax",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Maybe - depends on the person", 
          emoji: "🤔", 
          description: "Screens before bed disrupt sleep for everyone, regardless of individual differences",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Is it okay to use your phone right before sleeping?",
      options: [
        { 
          id: "a", 
          text: "Yes - it's fine", 
          emoji: "😐", 
          description: "Using phones before bed disrupts sleep quality",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - blue light affects sleep quality", 
          emoji: "❌", 
          description: "Blue light from phones suppresses melatonin and disrupts your natural sleep cycle",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Sometimes - not a big deal", 
          emoji: "🤷", 
          description: "Even occasional phone use before bed can significantly disrupt sleep",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Does screen time before bed affect your sleep schedule?",
      options: [
        { 
          id: "a", 
          text: "No - it doesn't matter", 
          emoji: "😑", 
          description: "Screen time before bed significantly affects your sleep schedule",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Only if you use it for hours", 
          emoji: "🤔", 
          description: "Even short screen time before bed can disrupt your sleep cycle",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Yes - it disrupts your sleep cycle", 
          emoji: "✅", 
          description: "Screen time before bed disrupts your circadian rhythm and sleep cycle",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Should you check notifications right before bed?",
      options: [
        { 
          id: "a", 
          text: "No - it can keep you awake", 
          emoji: "❌", 
          description: "Notifications can trigger alertness and make it harder to fall asleep",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Yes - to stay updated", 
          emoji: "📱", 
          description: "Checking notifications before bed can keep you awake and disrupt sleep",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Only important ones", 
          emoji: "🤷", 
          description: "Even checking important notifications can disrupt your sleep preparation",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is using devices in bed good for sleep hygiene?",
      options: [
        { 
          id: "a", 
          text: "Yes - it's comfortable", 
          emoji: "😴", 
          description: "Using devices in bed disrupts the association between bed and sleep",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "No - bed should be for sleep only", 
          emoji: "✅", 
          description: "Bed should be reserved for sleep to maintain good sleep hygiene and better rest",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Sometimes - not harmful", 
          emoji: "😐", 
          description: "Using devices in bed can harm sleep quality even if done occasionally",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Sleep Health Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
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

export default SleepHealthQuiz;

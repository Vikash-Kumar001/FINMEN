import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EncourageRoleplay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-16");
  const gameId = gameData?.id || "dcos-teen-16";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for EncourageRoleplay, using fallback ID");
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
      text: "Your classmate Maya is being cyberbullied. She's posting about feeling sad and alone. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Encourage her and report the bullying", 
          emoji: "🤗", 
          description: "Supporting victims and reporting bullying helps them feel less alone and stops the harassment",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Ignore it - not my business", 
          emoji: "😑", 
          description: "Ignoring bullying allows it to continue and can harm the victim",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Tell her to just delete social media", 
          emoji: "📱", 
          description: "While this may provide temporary relief, it doesn't address the bullying or support the victim",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend Sam is being trolled online and feels hopeless. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Stay out of it", 
          emoji: "🚶", 
          description: "Avoiding the situation leaves your friend without support when they need it most",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Support them and report the trolling", 
          emoji: "🤗", 
          description: "Supporting victims and reporting harassment provides emotional help and addresses the problem",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Tell them to ignore it", 
          emoji: "🔇", 
          description: "Ignoring serious harassment doesn't help the victim cope with the emotional impact",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "A classmate is being excluded and bullied in a group chat. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Don't get involved", 
          emoji: "🚫", 
          description: "Not getting involved allows the bullying to continue and can make the victim feel isolated",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Just watch", 
          emoji: "👁️", 
          description: "Being a passive observer doesn't help the victim and can make the situation worse",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Include them and report the bullying", 
          emoji: "🤗", 
          description: "Inclusion helps the victim feel supported, and reporting stops the harassment",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Someone you know is being harassed online and feels scared. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Encourage them and report harassment", 
          emoji: "🤗", 
          description: "Encouragement provides emotional support, and reporting helps stop the harassment",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "It's not my problem", 
          emoji: "🤷", 
          description: "Bullying affects the whole community, and helping others creates a safer environment for all",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Tell them to block everyone", 
          emoji: "🚫", 
          description: "Blocking may provide temporary relief but doesn't address the root problem or support the victim",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A friend is being cyberbullied and losing confidence. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Ignore the situation", 
          emoji: "🙈", 
          description: "Ignoring the situation allows the bullying to continue and can damage your friendship",
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Support them and report the bullying", 
          emoji: "🤗", 
          description: "Support helps rebuild confidence, and reporting addresses the source of the problem",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Tell them to toughen up", 
          emoji: "💪", 
          description: "Telling someone to toughen up dismisses their pain and doesn't address the bullying",
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Encourage Roleplay"
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

export default EncourageRoleplay;

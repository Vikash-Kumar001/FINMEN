import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const DebateFossilFuelsVsRenewables = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-6");
  const gameId = gameData?.id || "sustainability-teens-6";
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Debate: Fossil Fuels vs Renewables game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameFinished, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "Should we transition from fossil fuels to renewable energy?",
      options: [
        {
          id: "a",
          text: "Yes, immediately",
          emoji: "✅"
        },
        {
          id: "b",
          text: "Gradually over time",
          emoji: "⏳"
        },
        {
          id: "c",
          text: "No, keep fossil fuels",
          emoji: "❌"
        }
      ],
      correctAnswer: "b",
      explanation: "Gradually over time. Urgent action needed for climate, but balance is important. Fossil fuels harm the environment."
    },
    {
      id: 2,
      text: "What's the main advantage of renewable energy?",
      options: [
        {
          id: "a",
          text: "Always cheaper",
          emoji: "💰"
        },
        {
          id: "b",
          text: "Clean and sustainable",
          emoji: "🌱"
        },
        {
          id: "c",
          text: "Always available",
          emoji: "⚡"
        }
      ],
      correctAnswer: "c",
      explanation: "Always available. Costs vary, and depends on conditions. Reduces pollution."
    },
    {
      id: 3,
      text: "What's a challenge with renewable energy?",
      options: [
        {
          id: "a",
          text: "Too expensive",
          emoji: "💸"
        },
        {
          id: "b",
          text: "Doesn't work",
          emoji: "❌"
        },
        {
          id: "c",
          text: "Energy storage",
          emoji: "🔋"
        }
      ],
      correctAnswer: "a",
      explanation: "Too expensive. Costs are decreasing, but still a challenge. Renewable energy is effective. Need better battery technology."
    },
    {
      id: 4,
      text: "Which energy source produces the most carbon emissions?",
      options: [
        {
          id: "a",
          text: "Solar power",
          emoji: "☀️"
        },
        {
          id: "b",
          text: "Wind power",
          emoji: "🌬️"
        },
        {
          id: "c",
          text: "Coal power",
          emoji: "🏭"
        }
      ],
      correctAnswer: "c",
      explanation: "Coal power. Clean energy source, but highest carbon emissions."
    },
    {
      id: 5,
      text: "What's the best approach for energy transition?",
      options: [
        {
          id: "a",
          text: "Immediate shift",
          emoji: "⚡"
        },
        {
          id: "b",
          text: "Government investment",
          emoji: "🏛️"
        },
        {
          id: "c",
          text: "Individual action",
          emoji: "👤"
        }
      ],
      correctAnswer: "b",
      explanation: "Government investment. May cause disruptions, but supports innovation. Individual action is important but not sufficient."
    }
  ];

  const handleOptionSelect = (optionId) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionId === currentQuestion.correctAnswer;
    
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const currentQuestionData = questions[currentQuestionIndex];

  return (
    <GameShell
      title="Debate: Fossil Fuels vs Renewables"
      score={score}
      subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={gameFinished}
      gameId={gameId}
      gameType="sustainability"


      maxScore={questions.length}

      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}


    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Debate: Fossil Fuels vs Renewables</h3>
              <p className="text-white/90 text-lg">{currentQuestionData.text}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !showFeedback && handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-white/10 p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex flex-col items-center gap-3 group ${selectedOption === option.id ? (showFeedback ? (option.id === currentQuestionData.correctAnswer ? 'border-green-400 bg-green-400/20' : 'border-red-400 bg-red-400/20') : 'border-yellow-400 bg-yellow-400/20') : 'border-white/20 hover:bg-white/20'} ${showFeedback && option.id === currentQuestionData.correctAnswer ? 'border-green-400 bg-green-400/20' : ''}`}
                >
                  <div className="text-5xl transition-transform">
                    {option.emoji}
                  </div>
                  <div className="text-white font-bold text-lg text-center">
                    {option.text}
                  </div>
                  {showFeedback && selectedOption === option.id && option.id !== currentQuestionData.correctAnswer && (
                    <div className="text-red-400 font-bold">Incorrect</div>
                  )}
                  {showFeedback && option.id === currentQuestionData.correctAnswer && (
                    <div className="text-green-400 font-bold">Correct!</div>
                  )}
                </button>
              ))}
            </div>
            
            {showFeedback && (
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/90 text-center">{currentQuestionData.explanation}</p>
              </div>
            )}
          </div>
        </div>
    </GameShell>
  );
};

export default DebateFossilFuelsVsRenewables;


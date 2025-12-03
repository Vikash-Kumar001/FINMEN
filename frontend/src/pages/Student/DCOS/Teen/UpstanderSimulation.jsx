import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getDcosTeenGames } from "../../../../pages/Games/GameCategories/DCOS/teenGamesData";

const UpstanderSimulation = () => {
  const location = useLocation();
  const gameId = "dcos-teen-19";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getDcosTeenGames({});
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

  const scenarios = [
    {
      id: 1,
      title: "Group Trolling Situation",
      emoji: "👥",
      situation: "You see a group of classmates ganging up to troll and bully someone online. What do you do?",
      choices: [
        { id: 1, text: "Join them to fit in", emoji: "😞", isCorrect: false },
        { id: 2, text: "Ignore it and walk away", emoji: "🚶", isCorrect: false },
        { id: 3, text: "Defend the victim and report the bullying", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 2,
      title: "Cyberbully Attack",
      emoji: "💔",
      situation: "You witness someone being cyberbullied in a group chat. What's your response?",
      choices: [
        { id: 1, text: "Stay silent", emoji: "😐", isCorrect: false },
        { id: 2, text: "Watch from the sidelines", emoji: "👀", isCorrect: false },
        { id: 3, text: "Stand up and report the bullying", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 3,
      title: "Hate Comments Situation",
      emoji: "😡",
      situation: "You see hateful comments being posted about someone. What should you do?",
      choices: [
        { id: 1, text: "Ignore it", emoji: "😑", isCorrect: false },
        { id: 2, text: "Just watch", emoji: "👁️", isCorrect: false },
        { id: 3, text: "Defend them and report the hate", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 4,
      title: "Exclusion Situation",
      emoji: "🚫",
      situation: "You see someone being excluded and bullied in an online group. What do you do?",
      choices: [
        { id: 1, text: "Don't get involved", emoji: "😶", isCorrect: false },
        { id: 2, text: "Stay out of it", emoji: "😐", isCorrect: false },
        { id: 3, text: "Include them and report the bullying", emoji: "🛡️", isCorrect: true }
      ]
    },
    {
      id: 5,
      title: "Rumor Spreading",
      emoji: "💬",
      situation: "You see false rumors being spread about someone online. What's the right action?",
      choices: [
        { id: 1, text: "Let it happen", emoji: "😐", isCorrect: false },
        { id: 2, text: "Stay neutral", emoji: "😶", isCorrect: false },
        { id: 3, text: "Defend them and stop the rumor", emoji: "🛡️", isCorrect: true }
      ]
    }
  ];

  const handleChoice = (choiceId) => {
    if (answered) return;
    
    setSelectedChoice(choiceId);
    setAnswered(true);
    resetFeedback();
    
    const currentScenarioData = scenarios[currentScenario];
    const choice = currentScenarioData.choices.find(c => c.id === choiceId);
    const isCorrect = choice?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        setSelectedChoice(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Upstander Simulation"
      score={score}
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Game Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      maxScore={scenarios.length}
      showConfetti={showResult && score === scenarios.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl">
            <div className="text-6xl md:text-8xl mb-4 text-center">{currentScenarioData.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 text-center text-red-400">{currentScenarioData.title}</h2>
            <div className="bg-red-500/20 border-2 border-red-400 rounded-lg p-4 md:p-5 mb-6">
              <p className="text-white text-base md:text-lg leading-relaxed text-center">
                {currentScenarioData.situation}
              </p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">Choose Your Action:</h3>
            
            <div className="space-y-3">
              {currentScenarioData.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={answered}
                  className={`w-full border-2 rounded-xl p-4 md:p-5 transition-all ${
                    answered && choice.isCorrect
                      ? 'bg-green-500/50 border-green-400 ring-2 ring-green-300'
                      : answered && !choice.isCorrect && selectedChoice === choice.id
                      ? 'bg-red-500/30 border-red-400 opacity-60'
                      : selectedChoice === choice.id
                      ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                      : 'bg-white/20 border-white/40 hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-3xl md:text-4xl">{choice.emoji}</div>
                    <div className="text-white font-semibold text-base md:text-lg">{choice.text}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 w-full max-w-2xl text-center">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {score === scenarios.length ? "Perfect Upstander Badge! 🎉" : `You got ${score} out of ${scenarios.length}!`}
            </h2>
            <p className="text-white/90 text-lg mb-6">
              {score === scenarios.length 
                ? "Perfect! You chose to be an UPSTANDER! Defending victims and reporting bullying is brave and essential. You're not just protecting one person - you're showing others that bullying is unacceptable. Your courage inspires change!"
                : "Great job! Keep learning to be an upstander!"}
            </p>
            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm">
                💡 Be an upstander, not a bystander! Stand up for others and report bullying!
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default UpstanderSimulation;

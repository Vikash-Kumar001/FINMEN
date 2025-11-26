import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StrangerChatStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-2";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      stranger: "Hi! What is your name?",
      emoji: "👤",
      options: [
        { id: "ignore", text: "Don't reply and close chat", isSafe: true },
        { id: "reply", text: "Tell them your name", isSafe: false },
        { id: "ask", text: "Ask who they are first", isSafe: false }
      ]
    },
    {
      id: 2,
      stranger: "Where do you go to school?",
      emoji: "🏫",
      options: [
        { id: "tell", text: "Tell them your school name", isSafe: false },
        { id: "lie", text: "Make up a fake school", isSafe: false },
        { id: "block", text: "Don't reply and block them", isSafe: true }
      ]
    },
    {
      id: 3,
      stranger: "Can I have your phone number?",
      emoji: "📱",
      options: [
        { id: "refuse", text: "Say no and report to adult", isSafe: true },
        { id: "give", text: "Share your phone number", isSafe: false },
        { id: "parent", text: "Give parent's number instead", isSafe: false }
      ]
    },
    {
      id: 4,
      stranger: "I have candy! Want to meet in person?",
      emoji: "🍬",
      options: [
        { id: "meet", text: "Agree to meet them", isSafe: false },
        { id: "ask", text: "Ask where to meet", isSafe: false },
        { id: "tell", text: "Don't respond and tell parent immediately", isSafe: true }
      ]
    },
    {
      id: 5,
      stranger: "Send me a photo of yourself!",
      emoji: "📸",
      options: [
        { id: "refuse", text: "Refuse and tell trusted adult", isSafe: true },
        { id: "send", text: "Send a photo", isSafe: false },
        { id: "old", text: "Send an old photo", isSafe: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find(opt => opt.id === optionId);
    
    if (option.isSafe) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentScenarioData = scenarios[currentScenario];

  return (
    <GameShell
      title="Stranger Chat Story"
      score={score}
      subtitle={!showResult ? `Scenario ${currentScenario + 1} of ${scenarios.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      maxScore={scenarios.length}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentScenarioData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Never share personal information with strangers online!
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentScenarioData.emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic text-lg">
                  Stranger says: "{currentScenarioData.stranger}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center font-semibold text-lg">What should you do?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentScenarioData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Safe Kid Badge!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} out of {scenarios.length} safe choices!
                  You earned the Safe Kid Badge! 🏆
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Remember: NEVER share personal information with strangers online. Always tell a trusted adult!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} out of {scenarios.length} safe choices.
                  Get 4 or more safe choices to earn the badge!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Remember: NEVER share personal information with strangers online. Always tell a trusted adult!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StrangerChatStory;


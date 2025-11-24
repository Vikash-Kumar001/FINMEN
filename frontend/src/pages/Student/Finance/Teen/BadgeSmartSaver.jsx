import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeSmartSaver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-10";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [challenge, setChallenge] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Emergency Situation",
      description: "Your bike needs urgent repairs costing ₹500. You have ₹300 saved. What do you do?",
      choices: [
        { 
          id: "save", 
          text: "Use savings + earn more", 
          emoji: "🛠️", 
          description: "Use ₹300 savings and do extra work to earn the remaining ₹200",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Borrow from friends", 
          emoji: "👥", 
          description: "Ask friends to lend you the full amount",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Investment Opportunity",
      description: "A friend offers 50% return on ₹1000 investment in 1 month. What's your choice?",
      choices: [
        { 
          id: "save", 
          text: "Decline risky offer", 
          emoji: "🛡️", 
          description: "Avoid high-risk investments with unrealistic returns",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Invest the money", 
          emoji: "🎰", 
          description: "Take the chance for quick profit",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Shopping Temptation",
      description: "You see a ₹2000 gadget you want, but you're saving for college fees. Do you buy it?",
      choices: [
        { 
          id: "save", 
          text: "Stick to college goal", 
          emoji: "🎓", 
          description: "Continue saving for the more important college fees",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Buy the gadget", 
          emoji: "📱", 
          description: "Buy the gadget because you want it now",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Bonus Dilemma",
      description: "You receive ₹1000 bonus. Should you save it all or spend some?",
      choices: [
        { 
          id: "save", 
          text: "Save 80%, spend 20%", 
          emoji: "💰", 
          description: "Save ₹800 and use ₹200 for a small reward",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Spend 50% on fun", 
          emoji: "🎉", 
          description: "Spend ₹500 on entertainment and save ₹500",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Peer Pressure",
      description: "Friends are planning an expensive trip. You can't afford it but don't want to miss out. What do you do?",
      choices: [
        { 
          id: "save", 
          text: "Plan affordable alternative", 
          emoji: "🧭", 
          description: "Suggest a less expensive activity you can all enjoy",
          isCorrect: true
        },
        { 
          id: "spend", 
          text: "Borrow to join", 
          emoji: "💸", 
          description: "Use credit to join the trip and pay later",
          isCorrect: false
        }
      ]
    }
  ];

  const handleDecision = (selectedChoice) => {
    const newDecisions = [...decisions, { 
      challengeId: challenges[challenge].id, 
      choice: selectedChoice,
      isCorrect: challenges[challenge].choices.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setDecisions(newDecisions);
    
    // If the choice is correct, show flash/confetti
    const isCorrect = challenges[challenge].choices.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next challenge or show results
    if (challenge < challenges.length - 1) {
      setTimeout(() => {
        setChallenge(prev => prev + 1);
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
    } else {
      // Calculate final score
      const correctDecisions = newDecisions.filter(decision => decision.isCorrect).length;
      setFinalScore(correctDecisions);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setDecisions([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/teen/allowance-story");
  };

  const getCurrentChallenge = () => challenges[challenge];

  // Calculate progress
  const progress = Math.round(((challenge + 1) / challenges.length) * 100);

  return (
    <GameShell
      title="Badge: Smart Saver"
      subtitle={showResult ? "Achievement Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={finalScore}
      gameId="finance-teens-10"
      gameType="finance"
      totalLevels={20}
      coinsPerLevel={coinsPerLevel}
      currentLevel={10}
      maxScore={20} // Max score is total number of questions (all correct)
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore>= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-4">
                <div className="flex justify-between text-white/80 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{getCurrentChallenge().title}</h3>
              <p className="text-white text-lg mb-6">
                {getCurrentChallenge().description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCurrentChallenge().choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleDecision(choice.id)}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{choice.emoji}</div>
                    <h4 className="font-bold text-xl mb-2">{choice.text}</h4>
                    <p className="text-white/90">{choice.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Smart Saver!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart saving decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Smart Saver</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Smart Choices</h4>
                    <p className="text-white/90">
                      You chose to save for emergencies, avoid risky investments, prioritize important goals, 
                      and resist peer pressure spending.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90">
                      These habits will help you build wealth and achieve your long-term financial goals!
                    </p>
                  </div>
                </div>
                
                <p className="text-white/80 mb-6">
                  Congratulations on completing the first 10 finance games! You're well on your way to becoming financially literate.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart saving decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, smart saving means prioritizing important goals, avoiding risky investments, 
                  and making thoughtful financial decisions.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeSmartSaver;
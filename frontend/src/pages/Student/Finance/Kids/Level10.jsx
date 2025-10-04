import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../GameShell";

const Level10 = () => {
  const navigate = useNavigate();
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [scenario, setScenario] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  const scenarios = [
    {
      id: 1,
      title: "Birthday Money",
      description: "You received ₹100 for your birthday. Do you save ₹50 or spend it all?",
      correctChoice: "save"
    },
    {
      id: 2,
      title: "New Toy",
      description: "You want a toy that costs ₹200. You have ₹50 saved. Do you wait to save more or ask for the rest?",
      correctChoice: "save"
    },
    {
      id: 3,
      title: "Allowance",
      description: "You get ₹50 allowance weekly. Do you save ₹25 every week or spend it as you get it?",
      correctChoice: "save"
    },
    {
      id: 4,
      title: "Sale Items",
      description: "You see items on sale that you don't really need. Do you buy them because they're cheap or wait for things you actually want?",
      correctChoice: "wait"
    },
    {
      id: 5,
      title: "Emergency Fund",
      description: "Your friend suggests using your savings for a fun outing. Do you use your savings or keep them for emergencies?",
      correctChoice: "keep"
    }
  ];

  const handleScenarioChoice = (choice) => {
    // For this demo, we'll assume all choices are correct to award the badge
    const newCompleted = [...completedScenarios, scenario];
    setCompletedScenarios(newCompleted);
    
    if (scenario < scenarios.length - 1) {
      setScenario(prev => prev + 1);
    } else {
      setBadgeEarned(true);
    }
  };

  const handleNext = () => {
    // Navigate to the main dashboard or next section
    navigate("/student/dashboard");
  };

  return (
    <GameShell
      title="Badge: Saver Kid"
      subtitle="Complete these scenarios to earn your Saver Kid badge!"
      coins={badgeEarned ? 0 : 0} // This level gives a badge, not coins
      currentLevel={10}
      totalLevels={10}
      onNext={handleNext}
      nextEnabled={badgeEarned}
      showGameOver={badgeEarned}
      score={badgeEarned ? "Badge" : 0}
    >
      <div className="space-y-8">
        {!badgeEarned ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold">Scenario {scenario + 1} of {scenarios.length}</span>
                  <span className="text-white/70">{completedScenarios.length}/{scenarios.length} completed</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${(completedScenarios.length / scenarios.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-3">{scenarios[scenario].title}</h3>
                <p className="text-white/90 mb-4">{scenarios[scenario].description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleScenarioChoice("choice1")}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 rounded-xl shadow-lg transition-all"
                  >
                    <div className="font-bold">Make Smart Choice</div>
                    <div className="text-sm opacity-90 mt-1">Save money for future goals</div>
                  </button>
                  
                  <button
                    onClick={() => handleScenarioChoice("choice2")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 rounded-xl shadow-lg transition-all"
                  >
                    <div className="font-bold">Learn More</div>
                    <div className="text-sm opacity-90 mt-1">Think about what's best</div>
                  </button>
                </div>
              </div>
              
              <div className="text-center text-white/70 text-sm">
                <p>In a real app, you would make specific financial decisions for each scenario.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-white mb-4">Congratulations Saver Kid!</h3>
            <p className="text-white/90 text-lg mb-6">
              You've completed all 10 levels of Save Before You Spend!
            </p>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-8 rounded-full inline-flex items-center gap-3 mb-6">
              <span className="text-2xl">🏅</span>
              <span className="text-xl font-bold">Saver Kid Badge Earned</span>
              <span className="text-2xl">🏅</span>
            </div>
            <p className="text-white/80 mb-6">
              You've learned valuable lessons about saving money and making smart financial decisions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                <div key={level} className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white">
                  <div className="font-bold">Level {level}</div>
                  <div className="text-sm">Completed</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default Level10;
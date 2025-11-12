import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [debateStage, setDebateStage] = useState("prep");
  const [selectedArguments, setSelectedArguments] = useState([]);
  const [listeningScore, setListeningScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const debateTopic = "Does respect mean you must agree with everyone?";
  
  const argumentOptions = [
    { id: 1, text: "Respect means listening even when you disagree", strong: true },
    { id: 2, text: "I just think respect is good", strong: false },
    { id: 3, text: "You can disagree respectfully by acknowledging their view first", strong: true },
    { id: 4, text: "Everyone should think the same way", strong: false },
    { id: 5, text: "Respect involves understanding different perspectives", strong: true },
    { id: 6, text: "My friend said respect is important", strong: false }
  ];

  const listeningBehaviors = [
    { id: 1, text: "Maintained eye contact and nodded", isGood: true },
    { id: 2, text: "Interrupted frequently", isGood: false },
    { id: 3, text: "Asked clarifying questions", isGood: true },
    { id: 4, text: "Checked phone during opponent's turn", isGood: false },
    { id: 5, text: "Took notes on opponent's points", isGood: true }
  ];

  const handleArgumentToggle = (argId) => {
    if (selectedArguments.includes(argId)) {
      setSelectedArguments(selectedArguments.filter(id => id !== argId));
    } else if (selectedArguments.length < 3) {
      setSelectedArguments([...selectedArguments, argId]);
    }
  };

  const handleStartDebate = () => {
    if (selectedArguments.length === 3) {
      setDebateStage("listening");
    }
  };

  const handleListeningBehavior = (behaviorId) => {
    const behavior = listeningBehaviors.find(b => b.id === behaviorId);
    if (behavior.isGood) {
      setListeningScore(prev => prev + 1);
    }
    
    if (behaviorId === listeningBehaviors.length) {
      const strongArgs = selectedArguments.filter(id => 
        argumentOptions.find(a => a.id === id)?.strong
      ).length;
      
      const totalScore = strongArgs + listeningScore;
      
      if (totalScore >= 4) {
        setCoins(5); // +5 Coins for good debate (double points for complex activity)
        showCorrectAnswerFeedback(5, false);
      }
      
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/inclusion-journal");
  };

  const strongArgs = selectedArguments.filter(id => 
    argumentOptions.find(a => a.id === id)?.strong
  ).length;

  return (
    <GameShell
      title="Respect Debate"
      subtitle={debateStage === "prep" ? "Preparation" : "Listening Skills"}
      onNext={handleNext}
      nextEnabled={showResult && (strongArgs + listeningScore) >= 4}
      showGameOver={showResult && (strongArgs + listeningScore) >= 4}
      score={coins}
      gameId="uvls-teen-15"
      gameType="uvls"
      totalLevels={20}
      currentLevel={15}
      showConfetti={showResult && (strongArgs + listeningScore) >= 4}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {debateStage === "prep" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg p-4 mb-6">
                <p className="text-white text-lg font-bold text-center">
                  {debateTopic}
                </p>
              </div>
              
              <h3 className="text-white text-xl font-bold mb-4">
                Select 3 Arguments ({selectedArguments.length}/3)
              </h3>
              
              <div className="space-y-3 mb-6">
                {argumentOptions.map(arg => (
                  <button
                    key={arg.id}
                    onClick={() => handleArgumentToggle(arg.id)}
                    disabled={!selectedArguments.includes(arg.id) && selectedArguments.length >= 3}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedArguments.includes(arg.id)
                        ? 'bg-purple-500/50 border-purple-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${!selectedArguments.includes(arg.id) && selectedArguments.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{arg.text}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        arg.strong ? 'bg-green-500/50' : 'bg-yellow-500/50'
                      }`}>
                        {arg.strong ? 'strong' : 'weak'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleStartDebate}
                disabled={selectedArguments.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedArguments.length === 3
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Start Debate! 🎤
              </button>
            </div>
          </div>
        )}
        
        {debateStage === "listening" && !showResult && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 text-center">
                During the debate, which listening behaviors did you demonstrate?
              </p>
              
              <div className="space-y-3">
                {listeningBehaviors.map(behavior => (
                  <button
                    key={behavior.id}
                    onClick={() => handleListeningBehavior(behavior.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{behavior.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {(strongArgs + listeningScore) >= 4 ? "🎉 Great Debater!" : "💪 Keep Practicing!"}
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Strong Arguments:</span>
                <span className="text-white font-bold">{strongArgs}/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Good Listening:</span>
                <span className="text-white font-bold">{listeningScore}/{listeningBehaviors.filter(b => b.isGood).length}</span>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {(strongArgs + listeningScore) >= 4 ? "You earned 10 Coins! 🪙" : "Score 4+ for coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach "agree to disagree" skills - you can respect someone without agreeing!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RespectDebate;


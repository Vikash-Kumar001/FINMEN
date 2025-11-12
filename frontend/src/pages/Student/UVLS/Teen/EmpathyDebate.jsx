import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmpathyDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [debateStage, setDebateStage] = useState("prep"); // prep, debate, judging, result
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [selectedRebuttal, setSelectedRebuttal] = useState(null);
  const [prepTime, setPrepTime] = useState(300); // 5 minutes
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback } = useGameFeedback();

  const debateTopic = "Should empathy be a required part of the school curriculum?";
  
  const evidenceOptions = [
    { id: 1, text: "Studies show empathetic students perform better academically", strength: "strong" },
    { id: 2, text: "Empathy reduces bullying in schools", strength: "strong" },
    { id: 3, text: "I think empathy is nice", strength: "weak" },
    { id: 4, text: "Empathy helps create better teamwork and collaboration", strength: "strong" },
    { id: 5, text: "My friend said empathy is important", strength: "weak" },
    { id: 6, text: "Research links empathy to reduced violence and conflict", strength: "strong" }
  ];

  const rebuttalOptions = [
    { id: 1, text: "I understand your concern, but evidence shows...", respectful: true },
    { id: 2, text: "That's completely wrong and you don't know what you're talking about", respectful: false },
    { id: 3, text: "I see your point, however, consider this...", respectful: true },
    { id: 4, text: "You're just making that up", respectful: false }
  ];

  const handleEvidenceToggle = (evidenceId) => {
    if (selectedEvidence.includes(evidenceId)) {
      setSelectedEvidence(selectedEvidence.filter(id => id !== evidenceId));
    } else if (selectedEvidence.length < 3) {
      setSelectedEvidence([...selectedEvidence, evidenceId]);
    }
  };

  const handleStartDebate = () => {
    if (selectedEvidence.length === 3) {
      setDebateStage("debate");
    }
  };

  const handleRebuttalSelect = (rebuttalId) => {
    setSelectedRebuttal(rebuttalId);
    setDebateStage("judging");
    
    const rebuttal = rebuttalOptions.find(r => r.id === rebuttalId);
    const strongEvidence = selectedEvidence.filter(id => 
      evidenceOptions.find(e => e.id === id)?.strength === "strong"
    ).length;
    
    const score = strongEvidence + (rebuttal.respectful ? 2 : 0);
    
    if (score >= 4) {
      setCoins(5); // +5 Coins for good debate (double points for complex activity)
      showCorrectAnswerFeedback(5, false);
    }
    
    setTimeout(() => {
      setShowResult(true);
    }, 2000);
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/reflective-journal");
  };

  const strongEvidence = selectedEvidence.filter(id => 
    evidenceOptions.find(e => e.id === id)?.strength === "strong"
  ).length;
  
  const rebuttal = rebuttalOptions.find(r => r.id === selectedRebuttal);
  const finalScore = strongEvidence + (rebuttal?.respectful ? 2 : 0);

  return (
    <GameShell
      title="Empathy Debate"
      subtitle={debateStage === "prep" ? "Preparation Time" : debateStage === "debate" ? "Choose Rebuttal" : "Judging"}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 4}
      showGameOver={showResult && finalScore >= 4}
      score={coins}
      gameId="uvls-teen-5"
      gameType="uvls"
      totalLevels={20}
      currentLevel={5}
      showConfetti={showResult && finalScore >= 4}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {debateStage === "prep" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg p-4 mb-6">
                <p className="text-white text-lg font-bold text-center">
                  {debateTopic}
                </p>
              </div>
              
              <h3 className="text-white text-xl font-bold mb-4">
                Select 3 Evidence Points ({selectedEvidence.length}/3)
              </h3>
              
              <div className="space-y-3 mb-6">
                {evidenceOptions.map(evidence => (
                  <button
                    key={evidence.id}
                    onClick={() => handleEvidenceToggle(evidence.id)}
                    disabled={!selectedEvidence.includes(evidence.id) && selectedEvidence.length >= 3}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedEvidence.includes(evidence.id)
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    } ${!selectedEvidence.includes(evidence.id) && selectedEvidence.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{evidence.text}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        evidence.strength === "strong" ? 'bg-green-500/50' : 'bg-yellow-500/50'
                      }`}>
                        {evidence.strength}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleStartDebate}
                disabled={selectedEvidence.length !== 3}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedEvidence.length === 3
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Begin Debate! 🎤
              </button>
            </div>
          </div>
        )}
        
        {debateStage === "debate" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-lg mb-6 text-center">
                The opposing side argues: "Schools should focus only on academics, not emotions."
              </p>
              
              <h3 className="text-white text-xl font-bold mb-4">How do you rebut?</h3>
              
              <div className="space-y-3">
                {rebuttalOptions.map(rebuttal => (
                  <button
                    key={rebuttal.id}
                    onClick={() => handleRebuttalSelect(rebuttal.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{rebuttal.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {finalScore >= 4 ? "🎉 Excellent Debate!" : "💪 Good Effort!"}
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Strong Evidence:</span>
                <span className="text-white font-bold">{strongEvidence}/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Respectful Rebuttal:</span>
                <span className="text-white font-bold">{rebuttal?.respectful ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Total Score:</span>
                <span className="text-yellow-400 font-bold">{finalScore}/5</span>
              </div>
            </div>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {finalScore >= 4 ? "You earned 5 Coins! 🪙" : "Score 4+ for coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Model respectful rebuttal format and emphasize evidence-based arguments.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmpathyDebate;


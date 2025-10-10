import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerSupportRoleplay = () => {
  const navigate = useNavigate();
  const [conversationStage, setConversationStage] = useState(0);
  const [selectedLines, setSelectedLines] = useState([]);
  const [empatheticCount, setEmpatheticCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const conversationStages = [
    {
      id: 1,
      peerSays: "I've been feeling really down lately. Nothing seems to be going right.",
      lines: [
        { id: 1, text: "That sounds really tough. Can you tell me more about what's been happening?", isEmpathetic: true },
        { id: 2, text: "Just think positive and you'll feel better.", isEmpathetic: false },
        { id: 3, text: "Everyone feels that way sometimes.", isEmpathetic: false }
      ]
    },
    {
      id: 2,
      peerSays: "I think I'm just not good enough. Everyone else seems to have it together.",
      lines: [
        { id: 1, text: "I hear how hard you're being on yourself. Those thoughts must be painful.", isEmpathetic: true },
        { id: 2, text: "Stop comparing yourself to others.", isEmpathetic: false },
        { id: 3, text: "You're right, they are better than you.", isEmpathetic: false }
      ]
    },
    {
      id: 3,
      peerSays: "I don't want to burden anyone with my problems.",
      lines: [
        { id: 1, text: "Your feelings are important and you're not a burden. I want to help.", isEmpathetic: true },
        { id: 2, text: "Yeah, you probably shouldn't bother people.", isEmpathetic: false },
        { id: 3, text: "Just deal with it yourself then.", isEmpathetic: false }
      ]
    },
    {
      id: 4,
      peerSays: "I'm not sure if I should talk to a counselor. What if people think I'm weak?",
      lines: [
        { id: 1, text: "Seeking help takes courage. It's a sign of strength, not weakness.", isEmpathetic: true },
        { id: 2, text: "Yeah, people might think that.", isEmpathetic: false },
        { id: 3, text: "You should just handle it alone.", isEmpathetic: false }
      ]
    }
  ];

  const handleLineSelect = (lineId) => {
    const stage = conversationStages[conversationStage];
    const line = stage.lines.find(l => l.id === lineId);
    
    const newSelectedLines = [...selectedLines, {
      stageId: stage.id,
      lineId,
      isEmpathetic: line.isEmpathetic
    }];
    
    setSelectedLines(newSelectedLines);
    
    if (line.isEmpathetic) {
      setEmpatheticCount(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    if (conversationStage < conversationStages.length - 1) {
      setTimeout(() => {
        setConversationStage(prev => prev + 1);
      }, 1000);
    } else {
      const finalEmpatheticCount = newSelectedLines.filter(l => l.isEmpathetic).length;
      if (finalEmpatheticCount >= 3) {
        setCoins(3); // +3 Coins for empathetic language (minimum for progress)
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }
  };

  const handleNext = () => {
    navigate("/student/uvls/teen/case-response-puzzle");
  };

  return (
    <GameShell
      title="Peer Support Roleplay"
      subtitle={`Stage ${conversationStage + 1} of ${conversationStages.length}`}
      onNext={handleNext}
      nextEnabled={showResult && empatheticCount >= 3}
      showGameOver={showResult && empatheticCount >= 3}
      score={coins}
      gameId="uvls-teen-7"
      gameType="uvls"
      totalLevels={20}
      currentLevel={7}
      showConfetti={showResult && empatheticCount >= 3}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Stage {conversationStage + 1}/{conversationStages.length}</span>
                <span className="text-green-400 font-bold">Empathetic: {empatheticCount}</span>
              </div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic text-lg">
                  "{conversationStages[conversationStage].peerSays}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">How do you respond?</p>
              
              <div className="space-y-3">
                {conversationStages[conversationStage].lines.map(line => (
                  <button
                    key={line.id}
                    onClick={() => handleLineSelect(line.id)}
                    className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 transition-all transform hover:scale-102 text-left"
                  >
                    <div className="text-white font-medium">{line.text}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {empatheticCount >= 3 ? "🎉 Supportive Peer!" : "💪 Practice More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              You used empathetic language {empatheticCount} out of {conversationStages.length} times!
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {empatheticCount >= 3 ? "You earned 3 Coins! 🏆" : "Use empathetic language 3+ times to earn coins!"}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Option for live pair roleplay to practice these skills!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerSupportRoleplay;


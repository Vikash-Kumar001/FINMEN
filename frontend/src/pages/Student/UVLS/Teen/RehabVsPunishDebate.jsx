import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RehabVsPunishDebate = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-100";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleConfirm();
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      topic: "Punishment deters bullying.",
      emoji: "⚖️",
      approaches: [
        { id: 1, text: "But rehab reforms", balanced: true },
        { id: 2, text: "Punish only", balanced: false },
        { id: 3, text: "Evidence for rehab", balanced: true },
        { id: 4, text: "No action", balanced: false }
      ]
    },
    {
      id: 2,
      topic: "Rehab helps bully change.",
      emoji: "🧠",
      approaches: [
        { id: 1, text: "With punishment", balanced: true },
        { id: 2, text: "Rehab only", balanced: false },
        { id: 3, text: "Restorative justice", balanced: true },
        { id: 4, text: "Ignore bully", balanced: false }
      ]
    },
    {
      id: 3,
      topic: "Victim needs justice.",
      emoji: "🤝",
      approaches: [
        { id: 1, text: "Through rehab", balanced: true },
        { id: 2, text: "Harsh punish", balanced: false },
        { id: 3, text: "Balanced approach", balanced: true },
        { id: 4, text: "No justice", balanced: false }
      ]
    },
    {
      id: 4,
      topic: "School policy on bullies.",
      emoji: "🏫",
      approaches: [
        { id: 1, text: "Combine both", balanced: true },
        { id: 2, text: "Expel", balanced: false },
        { id: 3, text: "Counseling programs", balanced: true },
        { id: 4, text: "Ignore policy", balanced: false }
      ]
    },
    {
      id: 5,
      topic: "Long-term effects.",
      emoji: "🔮",
      approaches: [
        { id: 1, text: "Rehab better long-term", balanced: true },
        { id: 2, text: "Punish immediate", balanced: false },
        { id: 3, text: "Evidence-based", balanced: true },
        { id: 4, text: "No effects", balanced: false }
      ]
    }
  ];

  const handleApproachSelect = (approachId) => {
    setSelectedApproach(approachId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const approach = question.approaches.find(a => a.id === selectedApproach) || { balanced: false };
    
    const isBalanced = approach.balanced;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isBalanced
    }];
    
    setResponses(newResponses);
    
    if (isBalanced) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedApproach(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const balancedCount = responses.filter(r => r.isBalanced).length;

  return (
    <GameShell
      title="Rehab vs Punish Debate"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && balancedCount >= 4}
      showGameOver={showResult && balancedCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-100"
      gameType="uvls"
      totalLevels={20}
      currentLevel={100}
      showConfetti={showResult && balancedCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <p className="text-white text-xl mb-6">{questions[currentQuestion].topic}</p>
              
              <p className="text-white/90 mb-4 text-center">Argue approach:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].approaches.map(approach => (
                  <button
                    key={approach.id}
                    onClick={() => handleApproachSelect(approach.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedApproach === approach.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{approach.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedApproach && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedApproach || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Argue
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {balancedCount >= 4 ? "🎉 Balanced Arguer!" : "💪 More Balanced!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Balanced arguments: {balancedCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {balancedCount >= 4 ? "Earned 10 Coins!" : "Need 4+ balanced."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Include restorative justice concepts.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RehabVsPunishDebate;
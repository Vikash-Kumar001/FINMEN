import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SystemicCasePuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-39";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(null);
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
      prompt: "Policy component.",
      emoji: "📜",
      components: [
        { id: 1, text: "Clear anti-bullying policy", multi: true },
        { id: 2, text: "Vague rules", multi: false },
        { id: 3, text: "Enforcement plan", multi: true },
        { id: 4, text: "No policy", multi: false }
      ]
    },
    {
      id: 2,
      prompt: "Workshops.",
      emoji: "📢",
      components: [
        { id: 1, text: "Regular training", multi: true },
        { id: 2, text: "One time", multi: false },
        { id: 3, text: "Interactive sessions", multi: true },
        { id: 4, text: "No workshops", multi: false }
      ]
    },
    {
      id: 3,
      prompt: "Peer mentors.",
      emoji: "👥",
      components: [
        { id: 1, text: "Trained mentors", multi: true },
        { id: 2, text: "No mentors", multi: false },
        { id: 3, text: "Buddy system", multi: true },
        { id: 4, text: "Random pairing", multi: false }
      ]
    },
    {
      id: 4,
      prompt: "Monitoring.",
      emoji: "👀",
      components: [
        { id: 1, text: "Anonymous reporting", multi: true },
        { id: 2, text: "No monitoring", multi: false },
        { id: 3, text: "Regular surveys", multi: true },
        { id: 4, text: "Ignore reports", multi: false }
      ]
    },
    {
      id: 5,
      prompt: "Evaluation.",
      emoji: "📊",
      components: [
        { id: 1, text: "Track incidents", multi: true },
        { id: 2, text: "No evaluation", multi: false },
        { id: 3, text: "Adjust program", multi: true },
        { id: 4, text: "Assume success", multi: false }
      ]
    }
  ];

  const handleComponentSelect = (componentId) => {
    setSelectedComponent(componentId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const component = question.components.find(c => c.id === selectedComponent) || { multi: false };
    
    const isMulti = component.multi;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isMulti
    }];
    
    setResponses(newResponses);
    
    if (isMulti) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedComponent(null);
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

  const multiCount = responses.filter(r => r.isMulti).length;

  return (
    <GameShell
      title="Systemic Case Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && multiCount >= 4}
      showGameOver={showResult && multiCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-39"
      gameType="uvls"
      totalLevels={20}
      currentLevel={39}
      showConfetti={showResult && multiCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <p className="text-white text-xl mb-6">{questions[currentQuestion].prompt}</p>
              
              <p className="text-white/90 mb-4 text-center">Pick component:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].components.map(component => (
                  <button
                    key={component.id}
                    onClick={() => handleComponentSelect(component.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedComponent === component.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{component.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedComponent && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedComponent || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Design
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {multiCount >= 4 ? "🎉 Program Designer!" : "💪 More Multi-pronged!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Multi-pronged: {multiCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {multiCount >= 4 ? "Earned 5 Coins!" : "Need 4+ multi."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage student leadership roles.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SystemicCasePuzzle;
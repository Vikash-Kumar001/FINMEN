import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ScenarioSimulation = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-38";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation: "Skip class or attend?",
      emoji: "🏫",
      choices: [
        { id: 1, text: "Skip", aligns: false },
        { id: 2, text: "Attend", aligns: true }
      ],
      goal: "Good grades"
    },
    {
      id: 2,
      situation: "Eat healthy or junk food?",
      emoji: "🍔",
      choices: [
        { id: 1, text: "Junk food", aligns: false },
        { id: 2, text: "Healthy", aligns: true }
      ],
      goal: "Fitness"
    },
    {
      id: 3,
      situation: "Save money or spend?",
      emoji: "💸",
      choices: [
        { id: 1, text: "Spend", aligns: false },
        { id: 2, text: "Save", aligns: true }
      ],
      goal: "Buy bike"
    },
    {
      id: 4,
      situation: "Study now or later?",
      emoji: "📖",
      choices: [
        { id: 1, text: "Later", aligns: false },
        { id: 2, text: "Now", aligns: true }
      ],
      goal: "Pass exam"
    },
    {
      id: 5,
      situation: "Help friend or self?",
      emoji: "🤝",
      choices: [
        { id: 1, text: "Self only", aligns: false },
        { id: 2, text: "Help friend", aligns: true }
      ],
      goal: "Strong relationships"
    }
  ];

  const handleChoiceSelect = (choiceId) => {
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;

    const scenario = scenarios[currentScenario];
    const choice = scenario.choices.find(c => c.id === selectedChoice);
    
    const isAligned = choice.aligns;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      choiceId: selectedChoice,
      isAligned,
      choice: choice.text
    }];
    
    setResponses(newResponses);
    
    if (isAligned) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedChoice(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const alignedCount = responses.filter(r => r.isAligned).length;

  return (
    <GameShell
      title="Scenario Simulation"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && alignedCount >= 4}
      showGameOver={showResult && alignedCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-38"
      gameType="uvls"
      totalLevels={20}
      currentLevel={38}
      showConfetti={showResult && alignedCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Situation: {scenarios[currentScenario].situation}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Goal: {scenarios[currentScenario].goal}</p>
              
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedChoice === choice.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{choice.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedChoice}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedChoice
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Simulate
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {alignedCount >= 4 ? "🎉 Wise Chooser!" : "💪 Align Better!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Aligned choices: {alignedCount} out of {scenarios.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {alignedCount >= 4 ? "Earned 5 Coins!" : "Need 4+ aligned."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Debrief on unintended consequences.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ScenarioSimulation;
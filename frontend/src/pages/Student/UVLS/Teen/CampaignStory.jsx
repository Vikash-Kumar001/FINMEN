import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CampaignStory = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState([]);
  const [impact, setImpact] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const steps = [
    {
      id: 1,
      question: "Choose goal for campaign.",
      options: [
        { id: 1, text: "Reduce plastic use", value: 20 },
        { id: 2, text: "Vague awareness", value: 5 },
        { id: 3, text: "Specific targets", value: 25 },
        { id: 4, text: "No goal", value: 0 }
      ]
    },
    {
      id: 2,
      question: "Select audience.",
      options: [
        { id: 1, text: "Students and teachers", value: 20 },
        { id: 2, text: "Everyone", value: 10 },
        { id: 3, text: "Targeted groups", value: 25 },
        { id: 4, text: "No audience", value: 0 }
      ]
    },
    {
      id: 3,
      question: "Choose channel.",
      options: [
        { id: 1, text: "Posters and social media", value: 20 },
        { id: 2, text: "One channel", value: 10 },
        { id: 3, text: "Multi-channel", value: 25 },
        { id: 4, text: "No channel", value: 0 }
      ]
    },
    {
      id: 4,
      question: "Set timeline.",
      options: [
        { id: 1, text: "One month campaign", value: 20 },
        { id: 2, text: "Indefinite", value: 10 },
        { id: 3, text: "With milestones", value: 25 },
        { id: 4, text: "No timeline", value: 0 }
      ]
    },
    {
      id: 5,
      question: "Measure impact.",
      options: [
        { id: 1, text: "Surveys and data", value: 20 },
        { id: 2, text: "Guess", value: 5 },
        { id: 3, text: "KPI tracking", value: 25 },
        { id: 4, text: "No measurement", value: 0 }
      ]
    }
  ];

  const handleSelect = (optionId) => {
    const step = steps[currentStep];
    const option = step.options.find(o => o.id === optionId);
    setSelections([...selections, option.value]);
    showCorrectAnswerFeedback(1, false);
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else {
      const total = selections.reduce((sum, val) => sum + val, 0);
      setImpact(total);
      if (total > 100) {
        setCoins(5);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  return (
    <GameShell
      title="Campaign Story"
      subtitle={`Step ${currentStep + 1} of ${steps.length}`}
      onNext={handleNext}
      nextEnabled={showResult && impact > 100}
      showGameOver={showResult && impact > 100}
      score={coins}
      gameId="civic-181"
      gameType="civic"
      totalLevels={10}
      currentLevel={1}
      showConfetti={showResult && impact > 100}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">{steps[currentStep].question}</p>
              
              <div className="space-y-3 mb-6">
                {steps[currentStep].options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className="w-full text-left border-2 rounded-xl p-4 transition-all bg-white/20 border-white/40 hover:bg-white/30"
                  >
                    <span className="text-white font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Campaign Planned!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Impact Score: {impact}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {impact > 100 ? "Earned 5 Coins!" : "Improve for better impact."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage school-level implementation.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CampaignStory;
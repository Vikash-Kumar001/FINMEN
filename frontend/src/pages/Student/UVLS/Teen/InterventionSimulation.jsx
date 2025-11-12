import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InterventionSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
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
      situation: "Verbal bullying.",
      emoji: "🗣️",
      steps: [
        { id: 1, text: "Stay calm", safe: true },
        { id: 2, text: "Yell back", safe: false },
        { id: 3, text: "Use de-escalation words", safe: true },
        { id: 4, text: "Ignore", safe: false }
      ]
    },
    {
      id: 2,
      situation: "Physical threat.",
      emoji: "💪",
      steps: [
        { id: 1, text: "Get away safely", safe: true },
        { id: 2, text: "Fight", safe: false },
        { id: 3, text: "Call for help", safe: true },
        { id: 4, text: "Stand ground", safe: false }
      ]
    },
    {
      id: 3,
      situation: "Group exclusion.",
      emoji: "👥",
      steps: [
        { id: 1, text: "Include victim", safe: true },
        { id: 2, text: "Join exclusion", safe: false },
        { id: 3, text: "Talk to group", safe: true },
        { id: 4, text: "Do nothing", safe: false }
      ]
    },
    {
      id: 4,
      situation: "Online troll.",
      emoji: "🌐",
      steps: [
        { id: 1, text: "Don't engage", safe: true },
        { id: 2, text: "Argue online", safe: false },
        { id: 3, text: "Report", safe: true },
        { id: 4, text: "Share personal", safe: false }
      ]
    },
    {
      id: 5,
      situation: "Rumor spreading.",
      emoji: "🔗",
      steps: [
        { id: 1, text: "Confront spreader calmly", safe: true },
        { id: 2, text: "Spread counter", safe: false },
        { id: 3, text: "Tell authority", safe: true },
        { id: 4, text: "Ignore rumor", safe: false }
      ]
    }
  ];

  const handleStepSelect = (stepId) => {
    setSelectedStep(stepId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const step = question.steps.find(s => s.id === selectedStep) || { safe: false };
    
    const isSafe = step.safe;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isSafe
    }];
    
    setResponses(newResponses);
    
    if (isSafe) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedStep(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const safeCount = newResponses.filter(r => r.isSafe).length;
      if (safeCount >= 4) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const safeCount = responses.filter(r => r.isSafe).length;

  return (
    <GameShell
      title="Intervention Simulation"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && safeCount >= 4}
      showGameOver={showResult && safeCount >= 4}
      score={coins}
      gameId="bully-134"
      gameType="bully"
      totalLevels={10}
      currentLevel={4}
      showConfetti={showResult && safeCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Situation: {questions[currentQuestion].situation}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose step:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].steps.map(step => (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedStep === step.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{step.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedStep && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedStep || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Defuse
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {safeCount >= 4 ? "🎉 De-escalator!" : "💪 More Safe!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Safe de-escalations: {safeCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {safeCount >= 4 ? "Earned 5 Coins!" : "Need 4+ safe."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Stress safety-first (avoid physical risk).
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InterventionSimulation;
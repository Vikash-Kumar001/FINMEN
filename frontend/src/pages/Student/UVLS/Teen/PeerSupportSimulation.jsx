import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerSupportSimulation = () => {
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
      prompt: "Listen to peer.",
      emoji: "👂",
      steps: [
        { id: 1, text: "Empathize", concrete: true },
        { id: 2, text: "Judge", concrete: false },
        { id: 3, text: "Active listen", concrete: true },
        { id: 4, text: "Interrupt", concrete: false }
      ]
    },
    {
      id: 2,
      prompt: "Offer support.",
      emoji: "🤝",
      steps: [
        { id: 1, text: "Suggest help", concrete: true },
        { id: 2, text: "Do nothing", concrete: false },
        { id: 3, text: "Plan session", concrete: true },
        { id: 4, text: "Criticize", concrete: false }
      ]
    },
    {
      id: 3,
      prompt: "Group activities.",
      emoji: "👥",
      steps: [
        { id: 1, text: "Inclusive games", concrete: true },
        { id: 2, text: "No activities", concrete: false },
        { id: 3, text: "Sharing circle", concrete: true },
        { id: 4, text: "Lecture", concrete: false }
      ]
    },
    {
      id: 4,
      prompt: "Follow-up plan.",
      emoji: "📅",
      steps: [
        { id: 1, text: "Schedule check-in", concrete: true },
        { id: 2, text: "No follow-up", concrete: false },
        { id: 3, text: "Ongoing support", concrete: true },
        { id: 4, text: "One time", concrete: false }
      ]
    },
    {
      id: 5,
      prompt: "Evaluate impact.",
      emoji: "📊",
      steps: [
        { id: 1, text: "Feedback form", concrete: true },
        { id: 2, text: "Assume good", concrete: false },
        { id: 3, text: "Adjust plan", concrete: true },
        { id: 4, text: "No evaluation", concrete: false }
      ]
    }
  ];

  const handleStepSelect = (stepId) => {
    setSelectedStep(stepId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const step = question.steps.find(s => s.id === selectedStep) || { concrete: false };
    
    const isConcrete = step.concrete;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isConcrete
    }];
    
    setResponses(newResponses);
    
    if (isConcrete) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedStep(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const concreteCount = newResponses.filter(r => r.isConcrete).length;
      if (concreteCount >= 4) {
        setCoins(5);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const concreteCount = responses.filter(r => r.isConcrete).length;

  return (
    <GameShell
      title="Peer Support Simulation"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && concreteCount >= 4}
      showGameOver={showResult && concreteCount >= 4}
      score={coins}
      gameId="emotion-147"
      gameType="emotion"
      totalLevels={10}
      currentLevel={7}
      showConfetti={showResult && concreteCount >= 4}
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
              
              <p className="text-white/90 mb-4 text-center">Design step:</p>
              
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
                Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {concreteCount >= 4 ? "🎉 Support Planner!" : "💪 More Concrete!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Concrete plans: {concreteCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {concreteCount >= 4 ? "Earned 5 Coins!" : "Need 4+ concrete."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Involve counselor if needed.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerSupportSimulation;
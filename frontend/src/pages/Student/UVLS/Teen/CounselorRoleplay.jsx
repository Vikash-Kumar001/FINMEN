import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CounselorRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
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
      prompt: "Explain incident.",
      emoji: "🗣️",
      steps: [
        { id: 1, text: "Describe clearly", supportive: true },
        { id: 2, text: "Vague description", supportive: false },
        { id: 3, text: "Provide details", supportive: true },
        { id: 4, text: "Downplay", supportive: false }
      ]
    },
    {
      id: 2,
      prompt: "Share feelings.",
      emoji: "😟",
      steps: [
        { id: 1, text: "Express honestly", supportive: true },
        { id: 2, text: "Hide emotions", supportive: false },
        { id: 3, text: "Use I statements", supportive: true },
        { id: 4, text: "Blame others", supportive: false }
      ]
    },
    {
      id: 3,
      prompt: "Counselor follow-up.",
      emoji: "❓",
      steps: [
        { id: 1, text: "Answer questions", supportive: true },
        { id: 2, text: "Avoid answers", supportive: false },
        { id: 3, text: "Ask for clarification", supportive: true },
        { id: 4, text: "Get angry", supportive: false }
      ]
    },
    {
      id: 4,
      prompt: "Make plan.",
      emoji: "📅",
      steps: [
        { id: 1, text: "Set actions", supportive: true },
        { id: 2, text: "No plan", supportive: false },
        { id: 3, text: "Follow-up schedule", supportive: true },
        { id: 4, text: "Ignore advice", supportive: false }
      ]
    },
    {
      id: 5,
      prompt: "Thank counselor.",
      emoji: "🙏",
      steps: [
        { id: 1, text: "Express thanks", supportive: true },
        { id: 2, text: "Leave rudely", supportive: false },
        { id: 3, text: "Appreciate help", supportive: true },
        { id: 4, text: "Complain", supportive: false }
      ]
    }
  ];

  const handleStepSelect = (stepId) => {
    setSelectedStep(stepId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const step = question.steps.find(s => s.id === selectedStep) || { supportive: false };
    
    const isSupportive = step.supportive;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isSupportive
    }];
    
    setResponses(newResponses);
    
    if (isSupportive) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedStep(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const supportiveCount = newResponses.filter(r => r.isSupportive).length;
      if (supportiveCount >= 4) {
        setBadge(true);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const supportiveCount = responses.filter(r => r.isSupportive).length;

  return (
    <GameShell
      title="Counselor Roleplay"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && supportiveCount >= 4}
      showGameOver={showResult && supportiveCount >= 4}
      score={0}
      gameId="bully-137"
      gameType="bully"
      totalLevels={10}
      currentLevel={7}
      showConfetti={showResult && supportiveCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white mb-2">Time left: {timeLeft}s</p>
              <div className="text-5xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Prompt: {questions[currentQuestion].prompt}
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
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
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
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Report
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {supportiveCount >= 4 ? "🎉 Reporter!" : "💪 More Supportive!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Supportive steps: {supportiveCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {supportiveCount >= 4 ? "Earned Badge!" : "Need 4+ supportive."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Optional live roleplay with counselor.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CounselorRoleplay;
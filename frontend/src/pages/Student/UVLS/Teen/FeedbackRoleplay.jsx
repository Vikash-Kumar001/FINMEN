import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FeedbackRoleplay = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [badge, setBadge] = useState(false);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      issue: "Friend late to meetings.",
      emoji: "⏰",
      feedbacks: [
        { id: 1, text: "I appreciate you, but lateness affects plans.", effective: true },
        { id: 2, text: "You're always late!", effective: false },
        { id: 3, text: "Let's set reminders.", effective: true },
        { id: 4, text: "Stop being late.", effective: false }
      ]
    },
    {
      id: 2,
      issue: "Group member not contributing.",
      emoji: "👥",
      feedbacks: [
        { id: 1, text: "Your ideas are valuable, how can we include more?", effective: true },
        { id: 2, text: "You do nothing!", effective: false },
        { id: 3, text: "Let's assign specific tasks.", effective: true },
        { id: 4, text: "Kick them out.", effective: false }
      ]
    },
    {
      id: 3,
      issue: "Teacher feedback on essay.",
      emoji: "📝",
      feedbacks: [
        { id: 1, text: "Good structure, improve arguments with evidence.", effective: true },
        { id: 2, text: "This is bad.", effective: false },
        { id: 3, text: "Suggestions for improvement.", effective: true },
        { id: 4, text: "Perfect score.", effective: false }
      ]
    },
    {
      id: 4,
      issue: "Peer review on project.",
      emoji: "🛠️",
      feedbacks: [
        { id: 1, text: "Strong design, add more features.", effective: true },
        { id: 2, text: "It sucks.", effective: false },
        { id: 3, text: "Positive + constructive.", effective: true },
        { id: 4, text: "No feedback.", effective: false }
      ]
    },
    {
      id: 5,
      issue: "Coach on performance.",
      emoji: "🏀",
      feedbacks: [
        { id: 1, text: "Great effort, work on speed.", effective: true },
        { id: 2, text: "You're slow.", effective: false },
        { id: 3, text: "Training plan.", effective: true },
        { id: 4, text: "Bench you.", effective: false }
      ]
    }
  ];

  const handleFeedbackSelect = (feedbackId) => {
    setSelectedFeedback(feedbackId);
  };

  const handleConfirm = () => {
    if (!selectedFeedback) return;

    const scenario = scenarios[currentScenario];
    const feedback = scenario.feedbacks.find(f => f.id === selectedFeedback);
    
    const isEffective = feedback.effective;
    
    const newResponses = [...responses, {
      scenarioId: scenario.id,
      feedbackId: selectedFeedback,
      isEffective,
      feedback: feedback.text
    }];
    
    setResponses(newResponses);
    
    if (isEffective) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedFeedback(null);
    
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 1500);
    } else {
      const effectiveCount = newResponses.filter(r => r.isEffective).length;
      if (effectiveCount >= 4) {
        setBadge(true);
      }
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const effectiveCount = responses.filter(r => r.isEffective).length;

  return (
    <GameShell
      title="Feedback Roleplay"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && effectiveCount >= 4}
      showGameOver={showResult && effectiveCount >= 4}
      score={0}
      gameId="communication-165"
      gameType="communication"
      totalLevels={10}
      currentLevel={5}
      showConfetti={showResult && effectiveCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-5xl mb-4 text-center">{scenarios[currentScenario].emoji}</div>
              
              <div className="bg-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-white italic">
                  Issue: {scenarios[currentScenario].issue}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Give feedback:</p>
              
              <div className="space-y-3 mb-6">
                {scenarios[currentScenario].feedbacks.map(feedback => (
                  <button
                    key={feedback.id}
                    onClick={() => handleFeedbackSelect(feedback.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedFeedback === feedback.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{feedback.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedFeedback}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedFeedback
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Give Feedback
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {effectiveCount >= 4 ? "🎉 Feedback Giver!" : "💪 More Effective!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Effective feedbacks: {effectiveCount} out of {scenarios.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {effectiveCount >= 4 ? "Earned Badge!" : "Need 4+ effective."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Teach sandwich method.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FeedbackRoleplay;
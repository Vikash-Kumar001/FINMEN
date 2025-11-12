import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const InterventionRoleplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedWording, setSelectedWording] = useState(null);
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
      comment: "Boys are stronger.",
      emoji: "💪",
      wordings: [
        { id: 1, text: "Strength not gender based.", effective: true },
        { id: 2, text: "You're wrong!", effective: false },
        { id: 3, text: "Examples of strong women.", effective: true },
        { id: 4, text: "Agree.", effective: false }
      ]
    },
    {
      id: 2,
      comment: "Girls talk too much.",
      emoji: "🗣️",
      wordings: [
        { id: 1, text: "Communication is key for all.", effective: true },
        { id: 2, text: "Shut up!", effective: false },
        { id: 3, text: "Challenge stereotype.", effective: true },
        { id: 4, text: "Laugh it off.", effective: false }
      ]
    },
    {
      id: 3,
      comment: "Men don't do housework.",
      emoji: "🧹",
      wordings: [
        { id: 1, text: "Responsibilities shared.", effective: true },
        { id: 2, text: "That's true.", effective: false },
        { id: 3, text: "Examples of men helping.", effective: true },
        { id: 4, text: "Ignore.", effective: false }
      ]
    },
    {
      id: 4,
      comment: "Women are emotional.",
      emoji: "😢",
      wordings: [
        { id: 1, text: "Emotions are human.", effective: true },
        { id: 2, text: "Yes they are.", effective: false },
        { id: 3, text: "Discuss bias.", effective: true },
        { id: 4, text: "Argue.", effective: false }
      ]
    },
    {
      id: 5,
      comment: "Boys like blue, girls pink.",
      emoji: "🎨",
      wordings: [
        { id: 1, text: "Colors for all.", effective: true },
        { id: 2, text: "That's standard.", effective: false },
        { id: 3, text: "Challenge norm.", effective: true },
        { id: 4, text: "Agree.", effective: false }
      ]
    }
  ];

  const handleWordingSelect = (wordingId) => {
    setSelectedWording(wordingId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const wording = question.wordings.find(w => w.id === selectedWording) || { effective: false };
    
    const isEffective = wording.effective;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isEffective
    }];
    
    setResponses(newResponses);
    
    if (isEffective) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedWording(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const effectiveCount = newResponses.filter(r => r.isEffective).length;
      if (effectiveCount >= 4) {
        setBadge(true);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const effectiveCount = responses.filter(r => r.isEffective).length;

  return (
    <GameShell
      title="Intervention Roleplay"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && effectiveCount >= 4}
      showGameOver={showResult && effectiveCount >= 4}
      score={0}
      gameId="gender-128"
      gameType="gender"
      totalLevels={10}
      currentLevel={8}
      showConfetti={showResult && effectiveCount >= 4}
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
                  "{questions[currentQuestion].comment}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Confront safely:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].wordings.map(wording => (
                  <button
                    key={wording.id}
                    onClick={() => handleWordingSelect(wording.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedWording === wording.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{wording.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedWording && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedWording || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Intervene
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {effectiveCount >= 4 ? "🎉 Intervener!" : "💪 More Effective!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Effective interventions: {effectiveCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {effectiveCount >= 4 ? "Earned Badge!" : "Need 4+ effective."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Stress safety & escalation.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InterventionRoleplay;
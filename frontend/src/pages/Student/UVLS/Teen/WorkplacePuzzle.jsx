import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WorkplacePuzzle = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedRemedy, setSelectedRemedy] = useState(null);
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
      problem: "Unequal pay for same work.",
      emoji: "💰",
      remedies: [
        { id: 1, text: "Conduct pay audit", effective: true },
        { id: 2, text: "Ignore difference", effective: false },
        { id: 3, text: "Promote equality policy", effective: true },
        { id: 4, text: "Reduce all pays", effective: false }
      ]
    },
    {
      id: 2,
      problem: "Harassment at work.",
      emoji: "🚫",
      remedies: [
        { id: 1, text: "Report and train staff", effective: true },
        { id: 2, text: "Blame victim", effective: false },
        { id: 3, text: "Establish hotline", effective: true },
        { id: 4, text: "Do nothing", effective: false }
      ]
    },
    {
      id: 3,
      problem: "Glass ceiling for women.",
      emoji: "📈",
      remedies: [
        { id: 1, text: "Mentorship programs", effective: true },
        { id: 2, text: "Ignore promotions", effective: false },
        { id: 3, text: "Diversity training", effective: true },
        { id: 4, text: "Favor men", effective: false }
      ]
    },
    {
      id: 4,
      problem: "Maternity leave discrimination.",
      emoji: "👶",
      remedies: [
        { id: 1, text: "Supportive policies", effective: true },
        { id: 2, text: "Deny leave", effective: false },
        { id: 3, text: "Paternity leave too", effective: true },
        { id: 4, text: "Fire on return", effective: false }
      ]
    },
    {
      id: 5,
      problem: "Stereotyped roles.",
      emoji: "🛠️",
      remedies: [
        { id: 1, text: "Diverse hiring", effective: true },
        { id: 2, text: "Enforce stereotypes", effective: false },
        { id: 3, text: "Training on bias", effective: true },
        { id: 4, text: "No change", effective: false }
      ]
    }
  ];

  const handleRemedySelect = (remedyId) => {
    setSelectedRemedy(remedyId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const remedy = question.remedies.find(r => r.id === selectedRemedy) || { effective: false };
    
    const isEffective = remedy.effective;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isEffective
    }];
    
    setResponses(newResponses);
    
    if (isEffective) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedRemedy(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const effectiveCount = newResponses.filter(r => r.isEffective).length;
      if (effectiveCount >= 4) {
        setCoins(5);
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
      title="Workplace Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && effectiveCount >= 4}
      showGameOver={showResult && effectiveCount >= 4}
      score={coins}
      gameId="gender-124"
      gameType="gender"
      totalLevels={10}
      currentLevel={4}
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
                  Problem: {questions[currentQuestion].problem}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Suggest remedy:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].remedies.map(remedy => (
                  <button
                    key={remedy.id}
                    onClick={() => handleRemedySelect(remedy.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedRemedy === remedy.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{remedy.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedRemedy && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedRemedy || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Suggest
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {effectiveCount >= 4 ? "🎉 Puzzle Solver!" : "💪 More Effective!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Effective remedies: {effectiveCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {effectiveCount >= 4 ? "Earned 5 Coins!" : "Need 4+ effective."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Discuss real-world examples.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WorkplacePuzzle;
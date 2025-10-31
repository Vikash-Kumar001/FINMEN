import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EqualityDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedArgument, setSelectedArgument] = useState(null);
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
      topic: "Policy changes equality.",
      emoji: "⚖️",
      arguments: [
        { id: 1, text: "Laws enforce rights", strong: true },
        { id: 2, text: "Policies useless", strong: false },
        { id: 3, text: "Examples from history", strong: true },
        { id: 4, text: "Personal view", strong: false }
      ]
    },
    {
      id: 2,
      topic: "Culture influences more.",
      emoji: "🌍",
      arguments: [
        { id: 1, text: "Norms shape behavior", strong: true },
        { id: 2, text: "Culture irrelevant", strong: false },
        { id: 3, text: "Local examples", strong: true },
        { id: 4, text: "Ignore culture", strong: false }
      ]
    },
    {
      id: 3,
      topic: "Policy vs culture balance.",
      emoji: "🤝",
      arguments: [
        { id: 1, text: "Both needed", strong: true },
        { id: 2, text: "One only", strong: false },
        { id: 3, text: "Evidence for synergy", strong: true },
        { id: 4, text: "No balance", strong: false }
      ]
    },
    {
      id: 4,
      topic: "Role of education.",
      emoji: "📚",
      arguments: [
        { id: 1, text: "Teaches equality", strong: true },
        { id: 2, text: "Education useless", strong: false },
        { id: 3, text: "Programs examples", strong: true },
        { id: 4, text: "Skip education", strong: false }
      ]
    },
    {
      id: 5,
      topic: "Global vs local.",
      emoji: "🗺️",
      arguments: [
        { id: 1, text: "Adapt to local", strong: true },
        { id: 2, text: "Global only", strong: false },
        { id: 3, text: "Cite local cases", strong: true },
        { id: 4, text: "Ignore local", strong: false }
      ]
    }
  ];

  const handleArgumentSelect = (argumentId) => {
    setSelectedArgument(argumentId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const argument = question.arguments.find(a => a.id === selectedArgument) || { strong: false };
    
    const isStrong = argument.strong;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isStrong
    }];
    
    setResponses(newResponses);
    
    if (isStrong) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedArgument(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const strongCount = newResponses.filter(r => r.isStrong).length;
      if (strongCount >= 4) {
        setCoins(10);
      }
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const strongCount = responses.filter(r => r.isStrong).length;

  return (
    <GameShell
      title="Equality Debate"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && strongCount >= 4}
      showGameOver={showResult && strongCount >= 4}
      score={coins}
      gameId="gender-126"
      gameType="gender"
      totalLevels={10}
      currentLevel={6}
      showConfetti={showResult && strongCount >= 4}
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
              
              <p className="text-white/90 mb-4 text-center">Build argument:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].arguments.map(argument => (
                  <button
                    key={argument.id}
                    onClick={() => handleArgumentSelect(argument.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedArgument === argument.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{argument.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedArgument && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedArgument || timeLeft === 0
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
              {strongCount >= 4 ? "🎉 Debate Winner!" : "💪 Stronger Arguments!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Strong arguments: {strongCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {strongCount >= 4 ? "Earned 10 Coins!" : "Need 4+ strong."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage citing local examples.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EqualityDebate;
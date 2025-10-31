import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OnlineHarassScenario = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
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
      post: "Insulting comment.",
      emoji: "💬",
      responses: [
        { id: 1, text: "Report post", safe: true },
        { id: 2, text: "Insult back", safe: false },
        { id: 3, text: "Block user", safe: true },
        { id: 4, text: "Ignore", safe: false }
      ]
    },
    {
      id: 2,
      post: "Fake rumor spread.",
      emoji: "🔗",
      responses: [
        { id: 1, text: "Report to admin", safe: true },
        { id: 2, text: "Spread counter rumor", safe: false },
        { id: 3, text: "Tell friends truth", safe: true },
        { id: 4, text: "Delete account", safe: false }
      ]
    },
    {
      id: 3,
      post: "Threat message.",
      emoji: "⚠️",
      responses: [
        { id: 1, text: "Save and report police", safe: true },
        { id: 2, text: "Threaten back", safe: false },
        { id: 3, text: "Inform adult", safe: true },
        { id: 4, text: "Reply jokingly", safe: false }
      ]
    },
    {
      id: 4,
      post: "Stalking online.",
      emoji: "🕵️",
      responses: [
        { id: 1, text: "Block and report", safe: true },
        { id: 2, text: "Confront stalker", safe: false },
        { id: 3, text: "Privacy settings", safe: true },
        { id: 4, text: "Share more info", safe: false }
      ]
    },
    {
      id: 5,
      post: "Cyberbullying group.",
      emoji: "👥",
      responses: [
        { id: 1, text: "Report group", safe: true },
        { id: 2, text: "Join and argue", safe: false },
        { id: 3, text: "Seek support", safe: true },
        { id: 4, text: "Ignore group", safe: false }
      ]
    }
  ];

  const handleResponseSelect = (responseId) => {
    setSelectedResponse(responseId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const response = question.responses.find(r => r.id === selectedResponse) || { safe: false };
    
    const isSafe = response.safe;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isSafe
    }];
    
    setResponses(newResponses);
    
    if (isSafe) {
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedResponse(null);
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
      title="Online Harass Scenario"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && safeCount >= 4}
      showGameOver={showResult && safeCount >= 4}
      score={coins}
      gameId="bully-131"
      gameType="bully"
      totalLevels={10}
      currentLevel={1}
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
                  Post: {questions[currentQuestion].post}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose safe response:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].responses.map(response => (
                  <button
                    key={response.id}
                    onClick={() => handleResponseSelect(response.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedResponse === response.id
                        ? 'bg-blue-500/50 border-blue-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{response.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedResponse && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedResponse || timeLeft === 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Respond
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {safeCount >= 4 ? "🎉 Safe Responder!" : "💪 More Safe!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Safe responses: {safeCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {safeCount >= 4 ? "Earned 5 Coins!" : "Need 4+ safe."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Provide reporting channels.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OnlineHarassScenario;
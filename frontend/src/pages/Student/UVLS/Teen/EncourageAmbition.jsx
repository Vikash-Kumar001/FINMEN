import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EncourageAmbition = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-21";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer per question
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleConfirm(); // Auto confirm if time out
    }
  }, [timeLeft, showResult]);

  const questions = [
    {
      id: 1,
      ambition: "I want to be an astronaut.",
      emoji: "🚀",
      responses: [
        { id: 1, text: "That's ambitious! Go for it.", supportive: true },
        { id: 2, text: "Too hard for you.", supportive: false },
        { id: 3, text: "Boys are better at that.", supportive: false },
        { id: 4, text: "Let's learn about space.", supportive: true }
      ]
    },
    {
      id: 2,
      ambition: "I dream of being a chef.",
      emoji: "👩‍🍳",
      responses: [
        { id: 1, text: "Great! Cook something.", supportive: true },
        { id: 2, text: "Girls should cook anyway.", supportive: false },
        { id: 3, text: "Not a real job.", supportive: false },
        { id: 4, text: "Explore recipes.", supportive: true }
      ]
    },
    {
      id: 3,
      ambition: "I want to be a teacher.",
      emoji: "👩‍🏫",
      responses: [
        { id: 1, text: "Wonderful! Help others learn.", supportive: true },
        { id: 2, text: "Low pay.", supportive: false },
        { id: 3, text: "Women are teachers.", supportive: false },
        { id: 4, text: "Practice teaching.", supportive: true }
      ]
    },
    {
      id: 4,
      ambition: "Aim to be a programmer.",
      emoji: "💻",
      responses: [
        { id: 1, text: "Cool! Learn coding.", supportive: true },
        { id: 2, text: "Boys dominate tech.", supportive: false },
        { id: 3, text: "Too complicated.", supportive: false },
        { id: 4, text: "Build an app.", supportive: true }
      ]
    },
    {
      id: 5,
      ambition: "Become a doctor.",
      emoji: "👩‍⚕️",
      responses: [
        { id: 1, text: "Amazing! Study hard.", supportive: true },
        { id: 2, text: "Long studies.", supportive: false },
        { id: 3, text: "Men are better doctors.", supportive: false },
        { id: 4, text: "Volunteer at hospital.", supportive: true }
      ]
    }
  ];

  const handleResponseSelect = (responseId) => {
    setSelectedResponse(responseId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const response = question.responses.find(r => r.id === selectedResponse) || { supportive: false }; // Default to false if time out
    
    const isSupportive = response.supportive;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isSupportive
    }];
    
    setResponses(newResponses);
    
    if (isSupportive) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedResponse(null);
    setTimeLeft(30);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const supportiveCount = responses.filter(r => r.isSupportive).length;

  return (
    <GameShell
      title="Encourage Ambition"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && supportiveCount >= 4}
      showGameOver={showResult && supportiveCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-21"
      gameType="uvls"
      totalLevels={20}
      currentLevel={21}
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
                  "{questions[currentQuestion].ambition}"
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Choose supportive response:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].responses.map(response => (
                  <button
                    key={response.id}
                    onClick={() => handleResponseSelect(response.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedResponse === response.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
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
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {supportiveCount >= 4 ? "🎉 Great Encourager!" : "💪 Practice More!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Supportive responses: {supportiveCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {supportiveCount >= 4 ? "Earned 5 Coins!" : "Need 4+ for coins."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Highlight diverse role models.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EncourageAmbition;
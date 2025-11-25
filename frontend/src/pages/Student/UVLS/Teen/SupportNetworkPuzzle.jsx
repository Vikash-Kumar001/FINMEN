import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SupportNetworkPuzzle = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-41";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);
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
      role: "Teacher.",
      emoji: "👩‍🏫",
      actions: [
        { id: 1, text: "Report incident", correct: true },
        { id: 2, text: "Ignore", correct: false },
        { id: 3, text: "Mediate", correct: true },
        { id: 4, text: "Punish victim", correct: false }
      ]
    },
    {
      id: 2,
      role: "Counselor.",
      emoji: "🛋️",
      actions: [
        { id: 1, text: "Emotional support", correct: true },
        { id: 2, text: "Blame", correct: false },
        { id: 3, text: "Plan safety", correct: true },
        { id: 4, text: "Dismiss", correct: false }
      ]
    },
    {
      id: 3,
      role: "Parent.",
      emoji: "👪",
      actions: [
        { id: 1, text: "Listen and act", correct: true },
        { id: 2, text: "Ignore child", correct: false },
        { id: 3, text: "Contact school", correct: true },
        { id: 4, text: "Blame child", correct: false }
      ]
    },
    {
      id: 4,
      role: "Friend.",
      emoji: "👭",
      actions: [
        { id: 1, text: "Support and report", correct: true },
        { id: 2, text: "Join bully", correct: false },
        { id: 3, text: "Stand up", correct: true },
        { id: 4, text: "Ignore", correct: false }
      ]
    },
    {
      id: 5,
      role: "Hotline.",
      emoji: "☎️",
      actions: [
        { id: 1, text: "Anonymous report", correct: true },
        { id: 2, text: "Public announce", correct: false },
        { id: 3, text: "Get advice", correct: true },
        { id: 4, text: "Hang up", correct: false }
      ]
    }
  ];

  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId);
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const action = question.actions.find(a => a.id === selectedAction) || { correct: false };
    
    const isCorrect = action.correct;
    
    const newResponses = [...responses, {
      questionId: question.id,
      isCorrect
    }];
    
    setResponses(newResponses);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setSelectedAction(null);
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

  const correctCount = responses.filter(r => r.isCorrect).length;

  return (
    <GameShell
      title="Support Network Puzzle"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && correctCount >= 4}
      showGameOver={showResult && correctCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-41"
      gameType="uvls"
      totalLevels={20}
      currentLevel={41}
      showConfetti={showResult && correctCount >= 4}
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
                  Role: {questions[currentQuestion].role}
                </p>
              </div>
              
              <p className="text-white/90 mb-4 text-center">Map action:</p>
              
              <div className="space-y-3 mb-6">
                {questions[currentQuestion].actions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action.id)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                      selectedAction === action.id
                        ? 'bg-green-500/50 border-green-400 ring-2 ring-white'
                        : 'bg-white/20 border-white/40 hover:bg-white/30'
                    }`}
                  >
                    <span className="text-white font-medium">{action.text}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleConfirm}
                disabled={!selectedAction && timeLeft > 0}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  selectedAction || timeLeft === 0
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Map
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              {correctCount >= 4 ? "🎉 Network Mapper!" : "💪 More Correct!"}
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Correct mappings: {correctCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {correctCount >= 4 ? "Earned 5 Coins!" : "Need 4+ correct."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Encourage building a support plan.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SupportNetworkPuzzle;
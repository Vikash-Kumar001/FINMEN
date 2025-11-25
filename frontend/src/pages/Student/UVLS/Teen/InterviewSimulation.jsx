import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InterviewSimulation = () => {
  const navigate = useNavigate();
  const gameId = "uvls-teen-60";
  const gameData = useMemo(() => getGameDataById(gameId), [gameId]);
  const coinsPerLevel = gameData?.coins || 1;
  const totalCoins = gameData?.coins || 1;
  const totalXp = gameData?.xp || 1;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      question: "Tell me about yourself.",
      ideal: "Structured response using STAR."
    },
    {
      id: 2,
      question: "Why this job?",
      ideal: "Show research and fit."
    },
    {
      id: 3,
      question: "Strength and weakness?",
      ideal: "Honest with examples."
    },
    {
      id: 4,
      question: "Teamwork example.",
      ideal: "STAR method."
    },
    {
      id: 5,
      question: "Questions for us?",
      ideal: "Thoughtful questions."
    }
  ];

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (answer.trim() === "") return;
    // Simulate scoring, assume good if length > 50
    const isStructured = answer.length > 50;
    const newResponses = [...responses, {
      questionId: questions[currentQuestion].id,
      answer,
      isStructured
    }];
    setResponses(newResponses);
    
    if (isStructured) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, false);
    }
    
    setAnswer("");
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/games/uvls/teens");
  };

  const structuredCount = responses.filter(r => r.isStructured).length;

  return (
    <GameShell
      title="Interview Simulation"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && structuredCount >= 4}
      showGameOver={showResult && structuredCount >= 4}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="uvls-teen-60"
      gameType="uvls"
      totalLevels={20}
      currentLevel={60}
      showConfetti={showResult && structuredCount >= 4}
      flashPoints={flashPoints}
      backPath="/games/uvls/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-white text-xl mb-6">{questions[currentQuestion].question}</p>
              
              <textarea
                value={answer}
                onChange={handleAnswerChange}
                className="w-full h-32 p-4 bg-white/20 border-2 border-white/40 rounded-xl text-white"
                placeholder="Type your answer..."
              />
              
              <button
                onClick={handleSubmit}
                disabled={answer.trim() === ""}
                className={`w-full py-3 rounded-xl font-bold text-white transition ${
                  answer.trim() !== ""
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
                    : 'bg-gray-500/50 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Interview Complete!
            </h2>
            <p className="text-white/90 text-xl mb-4">
              Structured answers: {structuredCount} out of {questions.length}
            </p>
            <p className="text-yellow-400 text-2xl font-bold mb-6">
              {structuredCount >= 4 ? "Earned 5 Coins!" : "Need 4+ structured."}
            </p>
            <p className="text-white/70 text-sm">
              Teacher Note: Use for career prep.
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InterviewSimulation;
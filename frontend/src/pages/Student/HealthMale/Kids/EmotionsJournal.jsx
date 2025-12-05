import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmotionsJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-57";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "One feeling I had today was...",
      placeholder: "I felt happy when..."
    },
    {
      id: 2,
      text: "When I feel happy, I...",
      placeholder: "I like to smile and..."
    },
    {
      id: 3,
      text: "When I'm sad, it helps to...",
      placeholder: "Talk to my mom or..."
    },
    {
      id: 4,
      text: "Something that makes me angry is...",
      placeholder: "When someone breaks my toy..."
    },
    {
      id: 5,
      text: "My favorite feeling is... because...",
      placeholder: "Excited because..."
    }
  ];

  const handleSubmit = () => {
    if (answer.trim().length > 0) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setAnswer("");

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1000);
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Journal of Emotions"
      subtitle={`Entry ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      backPath="/games/health-male/kids"
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Entry {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">{questions[currentQuestion].text}</h3>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={questions[currentQuestion].placeholder}
              className="w-full h-32 bg-white/20 border-2 border-white/30 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-all text-lg"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={answer.trim().length === 0}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 ${answer.trim().length > 0
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
          >
            Save Entry ✍️
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default EmotionsJournal;

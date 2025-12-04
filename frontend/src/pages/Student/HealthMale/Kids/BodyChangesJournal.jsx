import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BodyChangesJournal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-27";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [answer, setAnswer] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [responses, setResponses] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const prompts = [
    {
      id: 1,
      title: "Height Changes",
      text: "One body change I noticed is getting ___."
    },
    {
      id: 2,
      title: "Voice Changes",
      text: "My voice has ___ during the past year."
    },
    {
      id: 3,
      title: "Body Growth",
      text: "I feel ___ about my body growing and changing."
    },
    {
      id: 4,
      title: "Strength Changes",
      text: "I am getting ___ at sports and activities."
    },
    {
      id: 5,
      title: "Growth Feelings",
      text: "Growing up makes me feel ___."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      setResponses([...responses, { prompt: currentPrompt, answer }]);
      setAnswer("");
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);

      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Journal of Body Changes"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={27}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">{prompts[currentPrompt].title}</h3>
            <p className="text-white/90 mb-4">
              {prompts[currentPrompt].text}
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {prompts.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${index <= currentPrompt ? 'bg-green-500' : 'bg-white/30'
                    }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Your response:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50 resize-none"
                rows={4}
                maxLength={200}
              />
              <div className="text-right text-white/60 text-sm mt-1">
                {answer.length}/200 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={!answer.trim()}
              className={`w-full py-3 px-6 rounded-xl font-bold transition-all ${answer.trim()
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
            >
              {currentPrompt < prompts.length - 1 ? 'Next Prompt' : 'Complete Journal'}
            </button>
          </form>

          {gameFinished && (
            <div className="text-center space-y-4 mt-8">
              <div className="text-green-400">
                <div className="text-6xl mb-2">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">Journal Complete!</h3>
                <p className="text-white/90 mb-4">
                  Excellent reflection! You've shared 5 thoughts about your body changes.
                </p>

                <div className="space-y-3 mb-4">
                  {responses.map((response, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-3 text-left">
                      <p className="text-white font-medium mb-1">{prompts[index].title}</p>
                      <p className="text-white/80 italic">"{response.answer}"</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-2">
                  <span className="text-yellow-500 text-2xl">+{coins}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default BodyChangesJournal;

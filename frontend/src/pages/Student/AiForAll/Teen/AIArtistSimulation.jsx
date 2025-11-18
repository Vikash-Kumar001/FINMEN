import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIArtistSimulation = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const prompts = [
    { id: 1, text: "Draw a mountain 🏔️" },
    { id: 2, text: "Draw a sunset 🌅" },
    { id: 3, text: "Draw a robot 🤖" },
    { id: 4, text: "Draw a cat 🐱" },
    { id: 5, text: "Draw a spaceship 🛸" },
  ];

  const currentPromptData = prompts[currentPrompt];

  const handleGenerate = () => {
    // Each generated drawing gives 10 coins
    setCoins(prev => prev + 10);
    showCorrectAnswerFeedback(10, false);

    if (currentPrompt < prompts.length - 1) {
      setTimeout(() => setCurrentPrompt(prev => prev + 1), 500);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentPrompt(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/online-safety-quiz"); // Update with actual next game path
  };

  return (
    <GameShell
      title="AI Artist Simulation"
      subtitle={`Prompt ${currentPrompt + 1} of ${prompts.length}`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult}
      score={coins}
      gameId="ai-teen-41"
      gameType="ai"
      totalLevels={20}
      currentLevel={41}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/teens"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🎨</div>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              What should AI draw?
            </h2>

            <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-xl p-12 mb-6">
              <p className="text-4xl text-white font-bold text-center">{currentPromptData.text}</p>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 transition"
            >
              Generate Drawing 🎨
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">🎨</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              🖌️ AI Artist Completed!
            </h2>
            <p className="text-white/90 text-xl mb-6 text-center">
              You generated {prompts.length} AI drawings successfully!
            </p>

            <div className="bg-green-500/20 rounded-lg p-4 mb-4">
              <p className="text-white text-center text-sm mb-3">
                💡 Generative AI can create images, art, and content from text prompts. 
                Each drawing gives you rewards and shows how AI can bring ideas to life!
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Game ➡️
            </button>

            <button
              onClick={handleTryAgain}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Try Again 🔁
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIArtistSimulation;

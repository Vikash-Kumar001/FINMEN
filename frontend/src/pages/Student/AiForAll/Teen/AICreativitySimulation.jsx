import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AICreativitySimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [coins, setCoins] = useState(0);
  const { showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const exercises = [
    {
      id: 1,
      title: "Poem Generation",
      emoji: "📝",
      instruction: "Type a short poem. AI will generate a poem too. Reflect if it's creative."
    },
    {
      id: 2,
      title: "Story Starter",
      emoji: "📖",
      instruction: "Write the first paragraph of a story. Compare it with AI's version."
    },
    {
      id: 3,
      title: "Art Prompt",
      emoji: "🎨",
      instruction: "Describe a painting idea. AI generates a similar visual description."
    },
    {
      id: 4,
      title: "Joke Writing",
      emoji: "😂",
      instruction: "Write a short joke. See what AI comes up with. Reflect on humor creativity."
    },
    {
      id: 5,
      title: "Song Lyrics",
      emoji: "🎵",
      instruction: "Write a few lines of song lyrics. Compare with AI-generated lines."
    }
  ];

  const currentData = exercises[currentExercise];

  const handleSubmit = () => {
    if (userInput.trim() !== "") {
      showCorrectAnswerFeedback(2, true); // 2 coins per exercise for total 10
      setCoins(prev => prev + 2);
      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      setUserInput("");
      setShowResult(false);
    } else {
      navigate("/student/ai-for-all/teen/empathy-ai-roleplay");
    }
  };

  const handleTryAgain = () => {
    setUserInput("");
    setShowResult(false);
    setCoins(0);
    setCurrentExercise(0);
    resetFeedback();
  };

  return (
    <GameShell
      title="AI & Creativity Simulation"
      subtitle={`Exercise ${currentExercise + 1} of ${exercises.length}`}
      onNext={handleNext}
      nextEnabled={showResult}
      showGameOver={showResult && currentExercise === exercises.length - 1}
      score={coins}
      gameId="ai-teen-20"
      gameType="ai"
      totalLevels={20}
      currentLevel={20}
      showConfetti={showResult}
      backPath="/games/ai-for-all/teens"
    
      maxScore={20} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-8xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{currentData.title}</h2>
            <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
              <p className="text-white text-lg text-center">{currentData.instruction}</p>
            </div>

            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your creative input here..."
              className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/70 mb-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleSubmit}
              disabled={userInput.trim() === ""}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                userInput.trim()
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              Submit & Reflect
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-7xl mb-4 text-center">{currentData.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Reflection Time!</h2>
            
            <div className="bg-green-500/20 rounded-lg p-5 mb-4">
              <p className="text-white text-center">
                You explored creativity! Compare your input with AI’s suggestions and reflect on what was uniquely human.
              </p>
            </div>

            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned 2 Coins! 🪙
            </p>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Next Exercise
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AICreativitySimulation;
